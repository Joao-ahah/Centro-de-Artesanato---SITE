import { NextRequest, NextResponse } from 'next/server';

// Usuário administrativo para desenvolvimento
const ADMIN_DEFAULT = {
  _id: 'admin-default-id',
  nome: 'Administrador',
  email: 'admin@admin.com',
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