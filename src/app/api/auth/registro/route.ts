import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Usuario from '@/models/usuario';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Conectar ao banco de dados
    await dbConnect();
    
    // Receber os dados do corpo da requisição
    const { nome, email, senha, telefone } = await req.json();
    
    // Validar dados obrigatórios
    if (!nome || !email || !senha) {
      return NextResponse.json(
        { success: false, message: 'Nome, email e senha são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Verificar se o email já está em uso
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return NextResponse.json(
        { success: false, message: 'Este email já está cadastrado' },
        { status: 409 }
      );
    }
    
    // Criptografar a senha
    const senhaHash = await hashPassword(senha);
    
    // Criar novo usuário
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      telefone,
      isAdmin: false,
      dataCriacao: new Date()
    });
    
    // Gerar token JWT
    const token = generateToken({
      id: novoUsuario._id,
      email: novoUsuario.email,
      nome: novoUsuario.nome,
      isAdmin: novoUsuario.isAdmin
    });
    
    // Retornar resposta com token e dados básicos do usuário
    return NextResponse.json({
      success: true,
      message: 'Usuário registrado com sucesso',
      token,
      usuario: {
        id: novoUsuario._id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        isAdmin: novoUsuario.isAdmin
      }
    });
    
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 