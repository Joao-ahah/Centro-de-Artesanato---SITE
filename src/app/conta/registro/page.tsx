'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function RegistroPage() {
  const router = useRouter();
  const { register, authenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    telefone: '',
    dataNascimento: '',
    termos: false,
    newsletter: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (authenticated) {
      router.push('/');
    }
  }, [authenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    // Validar se as senhas conferem
    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não conferem');
      return false;
    }

    // Validar se a senha tem pelo menos 8 caracteres
    if (formData.senha.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return false;
    }

    // Validar se aceitou os termos
    if (!formData.termos) {
      setError('Você precisa aceitar os termos de uso');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar formulário
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        telefone: formData.telefone || undefined
      });

      if (!result.success) {
        throw new Error(result.message);
      }

      // Redirecionar para a página inicial
      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-amber-900 text-center mb-8">Crie sua conta</h1>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    className="input-field w-full"
                    placeholder="Seu nome completo"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input-field w-full"
                    placeholder="seu-email@exemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="senha" className="block text-gray-700 font-medium mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    className="input-field w-full"
                    placeholder="Crie uma senha forte"
                    value={formData.senha}
                    onChange={handleChange}
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Mínimo de 8 caracteres, incluindo letras e números
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirmarSenha" className="block text-gray-700 font-medium mb-2">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    className="input-field w-full"
                    placeholder="Confirme sua senha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="telefone" className="block text-gray-700 font-medium mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    className="input-field w-full"
                    placeholder="(XX) XXXXX-XXXX"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="dataNascimento" className="block text-gray-700 font-medium mb-2">
                    Data de nascimento
                  </label>
                  <input
                    type="date"
                    id="dataNascimento"
                    name="dataNascimento"
                    className="input-field w-full"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="termos"
                    name="termos"
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    checked={formData.termos}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="termos" className="ml-2 block text-sm text-gray-700">
                    Concordo com os{' '}
                    <Link href="/termos" className="text-amber-700 hover:text-amber-600">
                      Termos de Uso
                    </Link>{' '}
                    e{' '}
                    <Link href="/politicas" className="text-amber-700 hover:text-amber-600">
                      Políticas de Privacidade
                    </Link>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                    checked={formData.newsletter}
                    onChange={handleChange}
                  />
                  <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                    Quero receber novidades, promoções e ofertas exclusivas por e-mail
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className={`btn-primary w-full py-3 mb-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
              
              <div className="text-center">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link href="/conta/login" className="text-amber-700 hover:text-amber-600 font-medium">
                    Faça login
                  </Link>
                </p>
              </div>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Ou registre-se com</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="btn-secondary flex justify-center items-center"
                  disabled={loading}
                >
                  <span className="mr-2">G</span>
                  Google
                </button>
                <button
                  type="button"
                  className="btn-secondary flex justify-center items-center"
                  disabled={loading}
                >
                  <span className="mr-2">f</span>
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 