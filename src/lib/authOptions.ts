import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from './db';
import { comparePasswords } from './auth';
import UsuarioModel from '@/models/usuario';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        senha: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) {
          return null;
        }

        try {
          await dbConnect();

          // Buscar usuário pelo email
          const usuario = await UsuarioModel.findOne({ email: credentials.email });

          if (!usuario) {
            return null;
          }

          // Verificar senha
          const senhaCorreta = await comparePasswords(credentials.senha, usuario.senha);

          if (!senhaCorreta) {
            return null;
          }

          // Retornar dados do usuário
          return {
            id: usuario._id.toString(),
            email: usuario.email,
            nome: usuario.nome,
            tipo: usuario.tipo || 'cliente',
            isAdmin: usuario.tipo === 'admin'
          };
        } catch (error) {
          console.error('Erro na autenticação:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.nome = user.nome;
        token.tipo = user.tipo;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.nome = token.nome;
        session.user.tipo = token.tipo;
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    }
  },
  pages: {
    signIn: '/conta/login',
    signOut: '/',
    error: '/conta/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET || 'este_deveria_ser_seu_secret_em_variavel_de_ambiente'
}; 