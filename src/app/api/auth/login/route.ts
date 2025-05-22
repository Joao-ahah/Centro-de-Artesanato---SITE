import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UsuarioModel from '@/models/usuario';
import jwt from 'jsonwebtoken';

// Usuário administrativo para desenvolvimento (usado apenas se não conseguir conectar ao banco)
const ADMIN_DEFAULT = {
  _id: 'admin-default-id',
  nome: 'Administrador',
  email: 'admin@centroartesanato.com.br',
  senha: 'senha123', // senha em texto puro para simplificar
  isAdmin: true
};

export async function POST(req: NextRequest) {
  try {
    console.log('API Login: Requisição recebida');
    
    // Extrair dados da requisição
    const body = await req.json();
    const { email, senha, lembrar } = body;
    
    console.log('API Login: Tentativa de login com:', { email, lembrar });

    // Validar dados
    if (!email || !senha) {
      console.log('API Login: Email ou senha ausentes');
      return NextResponse.json({ 
        success: false, 
        message: 'Email e senha são obrigatórios' 
      }, { status: 400 });
    }

    // Tentar conectar ao banco de dados
    const db = await dbConnect();
    
    // Se conectou ao banco, verificar usuário no MongoDB
    if (db) {
      console.log('API Login: Conectado ao MongoDB, buscando usuário');
      
      // Buscar usuário pelo email
      const usuarioDB = await UsuarioModel.findOne({ email: email.toLowerCase() });
      
      if (usuarioDB) {
        console.log('API Login: Usuário encontrado, verificando senha');
        
        // Verificar a senha
        const senhaCorreta = await usuarioDB.compararSenha(senha);
        
        if (senhaCorreta) {
          console.log('API Login: Senha correta, gerando token');
          
          // Gerar JWT
          const token = jwt.sign(
            { userId: usuarioDB._id, isAdmin: usuarioDB.isAdmin },
            process.env.JWT_SECRET || 'fallback-secret-key',
            { expiresIn: process.env.JWT_EXPIRATION || '7d' }
          );
          
          // Preparar o objeto de usuário para retornar (sem a senha)
          const usuario = {
            id: usuarioDB._id,
            nome: usuarioDB.nome,
            email: usuarioDB.email,
            isAdmin: usuarioDB.isAdmin
          };
          
          // Atualizar último login
          usuarioDB.ultimoLogin = new Date();
          await usuarioDB.save();
          
          // Retornar resposta de sucesso
          return NextResponse.json({
            success: true,
            message: 'Login realizado com sucesso',
            token,
            usuario
          });
        }
      }
      
      console.log('API Login: Usuário não encontrado ou senha incorreta');
      
      return NextResponse.json({ 
        success: false, 
        message: 'Credenciais inválidas' 
      }, { status: 401 });
    }
    
    // Modo fallback: banco de dados não disponível, usar admin padrão
    console.log('API Login: MongoDB não disponível, usando admin padrão');

    // Verificar credenciais do admin de forma simplificada
    if (email.toLowerCase() === ADMIN_DEFAULT.email.toLowerCase() && 
        senha === ADMIN_DEFAULT.senha) {
      
      console.log('API Login: Login de admin bem-sucedido');
      
      // Preparar o objeto de usuário para retornar (sem a senha)
      const usuario = {
        id: ADMIN_DEFAULT._id,
        nome: ADMIN_DEFAULT.nome,
        email: ADMIN_DEFAULT.email,
        isAdmin: ADMIN_DEFAULT.isAdmin
      };
      
      // Retornar resposta de sucesso
      return NextResponse.json({
        success: true,
        message: 'Login realizado com sucesso',
        token: 'token-admin-simulado-' + Date.now(),
        usuario
      });
    }

    console.log('API Login: Credenciais inválidas');
    
    // Se chegou aqui, as credenciais são inválidas
    return NextResponse.json({ 
      success: false, 
      message: 'Credenciais inválidas' 
    }, { status: 401 });
    
  } catch (error: any) {
    console.error('API Login: Erro ao processar login:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao realizar login',
      error: error.message 
    }, { status: 500 });
  }
} 