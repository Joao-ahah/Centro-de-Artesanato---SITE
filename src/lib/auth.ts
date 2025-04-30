import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { IUsuario } from '../models/usuario';

const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_super_secreto_que_deveria_estar_em_env';
const JWT_EXPIRATION = '30d'; // Token válido por 30 dias

/**
 * Gera um token JWT para o usuário
 */
export function gerarToken(usuario: IUsuario): string {
  const payload = {
    id: usuario._id,
    email: usuario.email,
    nome: usuario.nome,
    tipo: usuario.tipo || (usuario.isAdmin ? 'admin' : 'cliente')
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
}

/**
 * Verifica se um token JWT é válido e retorna seu payload
 */
export function verificarToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Middleware para proteger rotas de API
 * Verifica o token no header Authorization e adiciona o usuário à requisição
 */
export async function authMiddleware(req: NextRequest) {
  try {
    // Obter o token do header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Acesso não autorizado. Token não fornecido.' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = verificarToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { message: 'Token inválido ou expirado.' },
        { status: 401 }
      );
    }

    // Adicionar o usuário à requisição (NextRequest não tem req.user, então retornamos o usuário)
    return { user: decoded };
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    
    return NextResponse.json(
      { message: 'Erro de autenticação.' },
      { status: 500 }
    );
  }
}

/**
 * Middleware para verificar permissões de admin
 */
export async function adminMiddleware(req: NextRequest) {
  const authResult = await authMiddleware(req);
  
  if (authResult instanceof NextResponse) {
    return authResult; // Retorna a resposta de erro se o middleware de auth falhou
  }
  
  // Verificar se o usuário é admin
  if (authResult.user && authResult.user.tipo === 'admin') {
    return { user: authResult.user };
  }
  
  return NextResponse.json(
    { message: 'Acesso restrito. Permissão de administrador necessária.' },
    { status: 403 }
  );
}

// Funções de autenticação
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware para proteger rotas
export function withAuth(handler: Function) {
  return async (req: NextRequest) => {
    try {
      // Extrair token do cabeçalho de autorização
      const authHeader = req.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, message: 'Token de autorização não fornecido' },
          { status: 401 }
        );
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (!decoded) {
        return NextResponse.json(
          { success: false, message: 'Token inválido ou expirado' },
          { status: 401 }
        );
      }
      
      // Adicionar usuário autenticado ao objeto de contexto
      const requestWithUser = {
        ...req,
        user: decoded
      };
      
      return handler(requestWithUser);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Erro de autenticação' },
        { status: 500 }
      );
    }
  };
} 