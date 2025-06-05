'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';

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
    if (authenticated && user && !loading) {
      console.log('Usuário já autenticado, redirecionando...');
      if (redirectPath) {
        router.push(redirectPath);
      } else if (user.isAdmin) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [authenticated, user, loading, router, redirectPath]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const result = await login(formData.email, formData.senha, formData.lembrar);
      
      if (result.success) {
        // Login bem-sucedido - não redirecionar aqui, deixar o useEffect fazer isso
        // O useEffect já tem a lógica correta para redirecionar admin para dashboard
        console.log('Login realizado com sucesso, aguardando redirecionamento automático...');
      } else {
        setError(result.message || 'Falha no login. Verifique suas credenciais.');
        setLoading(false);
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError(error.message || 'Ocorreu um erro ao fazer login. Tente novamente.');
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    try {
      setSocialLoading(provider);
      setError(null);
      
      const result = await signIn(provider, { 
        redirect: false, 
        callbackUrl: redirectPath || '/' 
      });
      
      if (result?.error) {
        setError(`Erro ao fazer login com ${provider}: ${result.error}`);
        toast.error(`Falha ao autenticar com ${provider}`);
      } else if (result?.url) {
        router.push(result.url);
      }
    } catch (error: any) {
      console.error(`Erro ao fazer login com ${provider}:`, error);
      setError(error.message || `Ocorreu um erro ao fazer login com ${provider}.`);
      toast.error(`Erro ao conectar com ${provider}`);
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Entrar no Centro de Artesanato
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link href="/conta/registro" className="font-medium text-amber-600 hover:text-amber-500">
            criar uma nova conta
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Login social */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={loading || socialLoading !== null}
              className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 focus:outline-none ${
                socialLoading === 'google' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {socialLoading === 'google' ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Conectando com Google...
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.0003 4.87566C13.8113 4.87566 15.3473 5.49056 16.5003 6.64566L19.9693 3.17066C17.9483 1.27466 15.2343 0 12.0003 0C7.3053 0 3.25531 2.68366 1.28931 6.60466L5.2723 9.70666C6.2263 6.86866 8.8743 4.87566 12.0003 4.87566Z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.49 12.2732C23.49 11.4822 23.4 10.7322 23.25 10.0132H12V14.5142H18.47C18.18 16.0472 17.34 17.3512 16.09 18.2282L19.97 21.2332C22.24 19.1402 23.49 15.9252 23.49 12.2732Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27031 14.2939L4.4043 15.5739L1.28931 18.3949C3.2553 22.3159 7.3053 25.0009 12.0003 25.0009C15.2343 25.0009 17.9483 23.7659 19.9703 21.2339L16.0913 18.2279C15.0073 18.9859 13.6243 19.4339 12.0003 19.4339C8.8743 19.4339 6.2263 17.4399 5.27031 14.6029V14.2939Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12.0003 24.9999C15.2343 24.9999 17.9483 23.7649 19.9703 21.2329L16.0913 18.2279C15.0073 18.9859 13.6243 19.4339 12.0003 19.4339C8.8743 19.4339 6.2263 17.4399 5.27031 14.6029L1.28931 17.7049C3.2553 21.6259 7.3053 24.9999 12.0003 24.9999Z"
                    />
                  </svg>
                  Entrar com Google
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={loading || socialLoading !== null}
              className={`w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 focus:outline-none ${
                socialLoading === 'facebook' ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {socialLoading === 'facebook' ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Conectando com Facebook...
                </span>
              ) : (
                <span className="inline-flex items-center">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#1877F2"
                      d="M24 12.0699C24 5.40608 18.6338 0 12.0699 0C5.40608 0 0 5.40608 0 12.0699C0 18.0898 4.41407 23.0898 10.1802 24V15.5627H7.12243V12.0699H10.1802V9.41071C10.1802 6.38393 11.9862 4.71429 14.7441 4.71429C16.0652 4.71429 17.4464 4.95 17.4464 4.95V7.92207H15.921C14.4183 7.92207 13.9587 8.85379 13.9587 9.80893V12.0699H17.307L16.7759 15.5627H13.9587V24C19.7248 23.0898 24 18.0898 24 12.0699Z"
                    />
                  </svg>
                  Entrar com Facebook
                </span>
              )}
            </button>
          </div>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Ou continue com email
              </span>
            </div>
          </div>

          {/* Formulário de login */}
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.senha}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="lembrar"
                  name="lembrar"
                  type="checkbox"
                  checked={formData.lembrar}
                  onChange={handleChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="lembrar" className="ml-2 block text-sm text-gray-900">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <Link href="/conta/recuperar-senha" className="font-medium text-amber-600 hover:text-amber-500">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="inline-flex items-center">
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
        </div>
      </div>
    </div>
  );
} 