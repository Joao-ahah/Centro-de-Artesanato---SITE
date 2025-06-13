import { NextAuthOptions } from 'next-auth';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import clientPromise from '@/lib/mongodb';
import dbConnect from '@/lib/db';
import UsuarioModel from '@/models/usuario';
import { JWT } from 'next-auth/jwt';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        senha: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          throw new Error('Email e senha são obrigatórios');
        }

          await dbConnect();

          const usuario = await UsuarioModel.findOne({ email: credentials.email });

          if (!usuario) {
          throw new Error('Email ou senha incorretos');
          }

        if (!usuario.senha) {
          throw new Error('Conta criada com provedor externo, faça login com seu provedor');
        }

        const senhaCorreta = await bcrypt.compare(credentials.senha, usuario.senha);

          if (!senhaCorreta) {
          throw new Error('Email ou senha incorretos');
          }

          return {
            id: usuario._id.toString(),
            email: usuario.email,
          name: usuario.nome,
          role: usuario.tipo
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "406552806440-i59jpmsa2e9b0jnh2iprnig595582iu5.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/conta/login',
    signOut: '/conta/logout',
    error: '/conta/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET || 'centro_artesanato_nextauth_secret',
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'cliente';
      }

      // Se for login via provedor externo, verifique/crie o usuário
      if (account && account.provider !== 'credentials') {
        token = await atualizarUsuarioProvedor(token, account, profile);
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Para contas sociais, garantir que o usuário existe no nosso banco
      if (account?.provider === 'google' || account?.provider === 'facebook') {
        try {
          await dbConnect();
          
          // Buscar usuário pelo email
          const usuarioExistente = await UsuarioModel.findOne({ email: user.email?.toLowerCase() });
          
          // Se o usuário não existir, criar um novo
          if (!usuarioExistente && user.email) {
            await UsuarioModel.create({
              nome: user.name || 'Usuário',
              email: user.email.toLowerCase(),
              senha: 'social-auth-' + Math.random().toString(36).substring(2, 15),
              isAdmin: false,
              tipo: 'cliente',
              ativo: true,
              socialProviders: [account.provider],
              dataCriacao: new Date()
            });
          } else if (usuarioExistente) {
            // Se o usuário já existir, atualizar providers se necessário
            const providers = usuarioExistente.socialProviders || [];
            if (!providers.includes(account.provider)) {
              providers.push(account.provider);
              usuarioExistente.socialProviders = providers;
              await usuarioExistente.save();
            }
            
            // Atualizar último login
            usuarioExistente.ultimoLogin = new Date();
            await usuarioExistente.save();
          }
        } catch (error) {
          console.error('Erro ao processar login social:', error);
          return false;
        }
      }
      
      return true;
    }
  },
};

// Helper para atualizar informações do usuário em login via provedor
async function atualizarUsuarioProvedor(token: JWT, account: any, profile: any): Promise<JWT> {
  try {
    await dbConnect();
    
    const email = token.email as string;
    
    // Verificar se o usuário já existe
    let usuario = await UsuarioModel.findOne({ email });
    
    if (usuario) {
      // Usuário existe - atualizar informações de conta/provedor
      token.role = usuario.tipo;
      token.id = usuario._id.toString();
      
      // Atualizar último login
      await UsuarioModel.findByIdAndUpdate(
        usuario._id,
        { 
          $set: { ultimoLogin: new Date() }
        }
      );
    } else {
      // Usuário não existe - criar novo
      const novoUsuario = await UsuarioModel.create({
        email,
        nome: token.name || email.split('@')[0],
        tipo: 'cliente',
        senha: 'social-auth-' + Math.random().toString(36).substring(2, 15),
        ultimoLogin: new Date()
      });
      
      token.role = novoUsuario.tipo;
      token.id = novoUsuario._id.toString();
    }
  } catch (error) {
    console.error('Erro ao processar usuário de provedor:', error);
  }
  
  return token;
} 