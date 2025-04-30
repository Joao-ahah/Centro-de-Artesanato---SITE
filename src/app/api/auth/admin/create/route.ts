import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simulação para ambiente de desenvolvimento sem MongoDB
// Em produção, isso seria conectado a um banco de dados real
const DEV_MODE = process.env.NODE_ENV === 'development' && !process.env.MONGODB_URI;

// Chave de segurança para criar administrador - em ambiente de produção, isso deveria estar em variáveis de ambiente
const ADMIN_SETUP_KEY = 'chave-secreta-temporaria-2024';

export async function POST(request: Request) {
  try {
    // Obter dados da requisição
    const { nome, email, senha, setupKey } = await request.json();

    // Validar dados
    if (!nome || !email || !senha) {
      return NextResponse.json({ 
        success: false, 
        message: 'Nome, email e senha são obrigatórios' 
      }, { status: 400 });
    }

    // Verificar a chave de configuração
    if (setupKey !== ADMIN_SETUP_KEY) {
      return NextResponse.json({ 
        success: false, 
        message: 'Chave de configuração inválida' 
      }, { status: 403 });
    }

    // Modo de desenvolvimento sem MongoDB
    if (DEV_MODE) {
      console.log('==== MODO DE DESENVOLVIMENTO SEM MONGODB ====');
      console.log('Criando administrador simulado:');
      console.log(`Nome: ${nome}`);
      console.log(`Email: ${email}`);
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: 'admin-dev-id', email, isAdmin: true },
        process.env.JWT_SECRET || 'segredo-temporario',
        { expiresIn: '7d' }
      );

      // Retornar resposta de sucesso
      return NextResponse.json({
        success: true,
        message: 'Administrador criado com sucesso (MODO DEV)',
        token,
        usuario: {
          id: 'admin-dev-id',
          nome,
          email,
          isAdmin: true
        }
      });
    }

    // Conexão com banco de dados real
    try {
      // Importar dinamicamente para evitar erros se o MongoDB não estiver configurado
      const { default: dbConnect } = await import('@/lib/dbConnect');
      const { default: Usuario } = await import('@/models/usuario');
      
      // Conectar ao banco de dados
      await dbConnect();

      // Verificar se o email já está em uso
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return NextResponse.json({ 
          success: false, 
          message: 'Este email já está em uso' 
        }, { status: 400 });
      }

      // Criptografar a senha
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      // Criar o usuário administrador
      const novoUsuario = new Usuario({
        nome,
        email,
        senha: senhaCriptografada,
        isAdmin: true // Define como administrador
      });

      // Salvar no banco de dados
      await novoUsuario.save();

      // Gerar token JWT
      const token = jwt.sign(
        { id: novoUsuario._id, email: novoUsuario.email, isAdmin: true },
        process.env.JWT_SECRET || 'segredo-temporario',
        { expiresIn: '7d' }
      );

      // Retornar resposta de sucesso
      return NextResponse.json({
        success: true,
        message: 'Administrador criado com sucesso',
        token,
        usuario: {
          id: novoUsuario._id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          isAdmin: true
        }
      });
    } catch (dbError: any) {
      console.error('Erro de banco de dados:', dbError);
      return NextResponse.json({ 
        success: false, 
        message: 'Erro ao conectar ou interagir com o banco de dados',
        error: dbError.message 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Erro ao criar administrador:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao criar administrador',
      error: error.message 
    }, { status: 500 });
  }
} 