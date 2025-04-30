'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const router = useRouter();
  const { login, authenticated, user, setAdminUser } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    lembrar: false
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (authenticated && user) {
      console.log('Usuário já autenticado, redirecionando...');
      if (redirectPath) {
        router.push(redirectPath);
      } else if (user.isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [authenticated, user, router, redirectPath]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await login(formData.email, formData.senha, formData.lembrar);
      
      if (result.success) {
        console.log('Login bem-sucedido! Definindo caminho de redirecionamento');
        // Definir caminho de redirecionamento com base no email
        if (formData.email.toLowerCase() === 'admin@admin.com') {
          setRedirectPath('/admin/dashboard');
        } else {
          setRedirectPath('/');
        }
      } else {
        setError(result.message || 'Falha ao fazer login. Verifique suas credenciais.');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError(err.message || 'Ocorreu um erro ao tentar fazer login.');
    } finally {
      setLoading(false);
    }
  };

  // Função para login rápido como admin
  const tentarLoginAdmin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Usar a nova função setAdminUser para definir diretamente os dados do usuário admin
      setAdminUser();
      
      // Definir o caminho de redirecionamento
      setRedirectPath('/admin/dashboard');
      
      console.log('Login admin concluído, redirecionando para dashboard');
    } catch (err: any) {
      console.error('Erro ao fazer login admin:', err);
      setError(err.message || 'Erro ao definir usuário administrador');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider);
    // Simular um login social (em produção, isso seria uma autenticação real)
    setTimeout(() => {
      setError('Login social ainda não implementado.');
      setSocialLoading(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-amber-800">Centro de Artesanato</h1>
          <h2 className="text-xl font-medium text-gray-700 mt-2">Entrar na sua conta</h2>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <Link 
                href="/conta/recuperar-senha" 
                className="text-sm text-amber-700 hover:text-amber-900"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <input
              id="senha"
              name="senha"
              type="password"
              autoComplete="current-password"
              required
              value={formData.senha}
              onChange={handleChange}
              className="input-field w-full"
              placeholder="Sua senha"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="lembrar"
              name="lembrar"
              type="checkbox"
              checked={formData.lembrar}
              onChange={handleChange}
              className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
            />
            <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-700">
              Lembrar de mim
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              className={`btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-4 text-center">
          <button 
            onClick={tentarLoginAdmin}
            className="text-sm text-amber-700 hover:text-amber-900 underline"
            disabled={loading}
          >
            Login rápido como admin
          </button>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou continue com
              </span>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('google')}
              disabled={!!socialLoading}
              className="btn-secondary flex justify-center items-center"
            >
              {socialLoading === 'google' ? (
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M12.545,10.239v3.821h5.445c-0.212,1.439-1.447,4.116-5.445,4.116c-3.268,0-5.945-2.704-5.945-6.056
                      c0-3.352,2.677-6.056,5.945-6.056c1.87,0,3.118,0.795,3.834,1.482l2.611-2.515c-1.67-1.563-3.836-2.513-6.445-2.513
                      c-5.336,0-9.663,4.327-9.663,9.664c0,5.336,4.327,9.664,9.663,9.664c5.576,0,9.273-3.916,9.273-9.442
                      c0-0.638-0.054-1.13-0.169-1.618H12.545V10.239z"
                      fill="#4285F4"
                    />
                  </svg>
                  Google
                </>
              )}
            </button>
            
            <button
              onClick={() => handleSocialLogin('facebook')}
              disabled={!!socialLoading}
              className="btn-secondary flex justify-center items-center"
            >
              {socialLoading === 'facebook' ? (
                <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M20.0062 3H3.99375C3.445 3 3 3.445 3 3.99375V20.0062C3 20.555 3.445 21 3.99375 21H12.6169V14.1806H10.1794V11.2969H12.6169V9.15625C12.6169 6.7425 14.0106 5.485 16.1706 5.485C17.2084 5.485 18.1034 5.57125 18.375 5.6075V8.19375H16.8C15.5556 8.19375 15.3169 8.8125 15.3169 9.67375V11.2969H18.2906L17.9212 14.1806H15.3169V21H20.0062C20.555 21 21 20.555 21 20.0062V3.99375C21 3.445 20.555 3 20.0062 3Z"
                      fill="#1877F2"
                    />
                  </svg>
                  Facebook
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/conta/registro" className="text-amber-700 hover:text-amber-900 font-medium">
              Registre-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 