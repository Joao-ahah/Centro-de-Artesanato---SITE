'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminSetupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    setupKey: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    // Validar formulário
    if (!formData.nome || !formData.email || !formData.senha || !formData.setupKey) {
      setMessage({ text: 'Todos os campos são obrigatórios', type: 'error' });
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setMessage({ text: 'As senhas não conferem', type: 'error' });
      return;
    }

    if (formData.senha.length < 6) {
      setMessage({ text: 'A senha deve ter pelo menos 6 caracteres', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/auth/admin/create', {
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha,
        setupKey: formData.setupKey
      });

      if (response.data.success) {
        setMessage({ text: 'Administrador criado com sucesso!', type: 'success' });
        
        // Salvar token no localStorage
        localStorage.setItem('token', response.data.token);
        
        // Salvar dados do usuário no sessionStorage
        sessionStorage.setItem('user', JSON.stringify(response.data.usuario));
        
        // Redirecionar para o dashboard após 2 segundos
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Erro ao criar administrador:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Ocorreu um erro ao criar o administrador', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-amber-800 text-center mb-6">Configuração de Administrador</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Esta página é apenas para configuração inicial. Crie um administrador para gerenciar o sistema.
        </p>
        
        {message && (
          <div 
            className={`mb-4 p-3 rounded ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-700 font-medium mb-2">
              Nome completo
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Digite seu nome completo"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="seu-email@exemplo.com"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="senha" className="block text-gray-700 font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Crie uma senha forte"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmarSenha" className="block text-gray-700 font-medium mb-2">
              Confirmar senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              name="confirmarSenha"
              value={formData.confirmarSenha}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Confirme sua senha"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="setupKey" className="block text-gray-700 font-medium mb-2">
              Chave de configuração
            </label>
            <input
              type="password"
              id="setupKey"
              name="setupKey"
              value={formData.setupKey}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Digite a chave de configuração"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Esta chave é necessária para criar um usuário administrador.
            </p>
          </div>
          
          <button
            type="submit"
            className={`w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? 'Criando administrador...' : 'Criar administrador'}
          </button>
        </form>
      </div>
    </div>
  );
} 