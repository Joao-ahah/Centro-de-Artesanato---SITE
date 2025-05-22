'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

interface Endereco {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface ICliente {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  endereco?: Endereco;
  ativo: boolean;
  ultimoLogin?: string;
  createdAt: string;
  updatedAt: string;
  socialProviders?: string[];
  image?: string;
}

export default function DetalhesClientePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [cliente, setCliente] = useState<ICliente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [formData, setFormData] = useState<Partial<ICliente>>({});

  // Buscar dados do cliente
  useEffect(() => {
    const buscarCliente = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        const response = await axios.get(`/api/admin/clientes/${params.id}`);
        
        if (response.data.success) {
          setCliente(response.data.cliente);
          setFormData({
            nome: response.data.cliente.nome,
            email: response.data.cliente.email,
            telefone: response.data.cliente.telefone || '',
            ativo: response.data.cliente.ativo
          });
        } else {
          throw new Error(response.data.message || 'Falha ao carregar cliente');
        }
      } catch (error: any) {
        console.error('Erro ao buscar cliente:', error);
        setErro(error.message || 'Falha ao buscar cliente. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    };
    
    buscarCliente();
  }, [params.id]);

  // Manipular alterações no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Salvar alterações
  const salvarAlteracoes = async () => {
    try {
      setSalvando(true);
      setErro(null);
      
      const response = await axios.patch(`/api/admin/clientes/${params.id}`, formData);
      
      if (response.data.success) {
        setCliente(response.data.cliente);
        setModoEdicao(false);
        toast.success('Dados do cliente atualizados com sucesso!');
      } else {
        throw new Error(response.data.message || 'Falha ao atualizar cliente');
      }
    } catch (error: any) {
      console.error('Erro ao atualizar cliente:', error);
      setErro(error.message || 'Falha ao atualizar cliente. Tente novamente.');
      toast.error(error.response?.data?.message || error.message || 'Erro ao atualizar cliente');
    } finally {
      setSalvando(false);
    }
  };

  // Formatar data
  const formatarData = (dataString: string | undefined) => {
    if (!dataString) return 'N/A';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Renderiza o conteúdo principal
  const renderConteudo = () => {
    if (carregando) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Carregando dados do cliente...</p>
        </div>
      );
    }

    if (erro) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{erro}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Tentar Novamente
            </button>
            <Link href="/admin/clientes" className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Voltar para Lista
            </Link>
          </div>
        </div>
      );
    }

    if (!cliente) {
      return (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">Cliente não encontrado</p>
          <Link href="/admin/clientes" className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700">
            Voltar para Lista
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xl font-bold border border-amber-200">
                  {cliente.image ? (
                    <img src={cliente.image} alt={cliente.nome} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    cliente.nome.charAt(0).toUpperCase()
                  )}
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{cliente.nome}</h2>
                  <p className="text-gray-600">{cliente.email}</p>
                </div>
              </div>
              
              <div className="mt-4 flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  cliente.ativo 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {cliente.ativo ? 'Ativo' : 'Inativo'}
                </span>
                
                {cliente.socialProviders && cliente.socialProviders.length > 0 && (
                  <div className="flex items-center">
                    {cliente.socialProviders.includes('google') && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M12.0003 4.87566C13.8113 4.87566 15.3473 5.49056 16.5003 6.64566L19.9693 3.17066C17.9483 1.27466 15.2343 0 12.0003 0C7.3053 0 3.25531 2.68366 1.28931 6.60466L5.2723 9.70666C6.2263 6.86866 8.8743 4.87566 12.0003 4.87566Z"
                          />
                          <path
                            fill="currentColor"
                            d="M23.49 12.2732C23.49 11.4822 23.4 10.7322 23.25 10.0132H12V14.5142H18.47C18.18 16.0472 17.34 17.3512 16.09 18.2282L19.97 21.2332C22.24 19.1402 23.49 15.9252 23.49 12.2732Z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.27031 14.2939L4.4043 15.5739L1.28931 18.3949C3.2553 22.3159 7.3053 25.0009 12.0003 25.0009C15.2343 25.0009 17.9483 23.7659 19.9703 21.2339L16.0913 18.2279C15.0073 18.9859 13.6243 19.4339 12.0003 19.4339C8.8743 19.4339 6.2263 17.4399 5.27031 14.6029V14.2939Z"
                          />
                          <path
                            fill="currentColor"
                            d="M12.0003 24.9999C15.2343 24.9999 17.9483 23.7649 19.9703 21.2329L16.0913 18.2279C15.0073 18.9859 13.6243 19.4339 12.0003 19.4339C8.8743 19.4339 6.2263 17.4399 5.27031 14.6029L1.28931 17.7049C3.2553 21.6259 7.3053 24.9999 12.0003 24.9999Z"
                          />
                        </svg>
                        Google
                      </span>
                    )}
                    {cliente.socialProviders.includes('facebook') && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M24 12.0699C24 5.40608 18.6338 0 12.0699 0C5.40608 0 0 5.40608 0 12.0699C0 18.0898 4.41407 23.0898 10.1802 24V15.5627H7.12243V12.0699H10.1802V9.41071C10.1802 6.38393 11.9862 4.71429 14.7441 4.71429C16.0652 4.71429 17.4464 4.95 17.4464 4.95V7.92207H15.921C14.4183 7.92207 13.9587 8.85379 13.9587 9.80893V12.0699H17.307L16.7759 15.5627H13.9587V24C19.7248 23.0898 24 18.0898 24 12.0699Z"
                          />
                        </svg>
                        Facebook
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {!modoEdicao && (
              <button
                onClick={() => setModoEdicao(true)}
                className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Editar Cliente
              </button>
            )}
          </div>
        </div>
        
        {modoEdicao ? (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Informações</h3>
            
            {erro && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                {erro}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo ?? true}
                  onChange={handleChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                  Cliente ativo
                </label>
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setModoEdicao(false);
                    setFormData({
                      nome: cliente.nome,
                      email: cliente.email,
                      telefone: cliente.telefone || '',
                      ativo: cliente.ativo
                    });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={salvarAlteracoes}
                  disabled={salvando}
                  className={`px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 ${
                    salvando ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Informações Pessoais */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Pessoais</h3>
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Email</span>
                    <span className="text-gray-800">{cliente.email}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Telefone</span>
                    <span className="text-gray-800">{cliente.telefone || 'Não informado'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Data de Cadastro</span>
                    <span className="text-gray-800">{formatarData(cliente.createdAt)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Último Login</span>
                    <span className="text-gray-800">{cliente.ultimoLogin ? formatarData(cliente.ultimoLogin) : 'Nunca'}</span>
                  </div>
                </div>
              </div>
              
              {/* Endereço */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
                {cliente.endereco ? (
                  <div className="space-y-3">
                    <p>{cliente.endereco.rua}, {cliente.endereco.numero}</p>
                    {cliente.endereco.complemento && <p>{cliente.endereco.complemento}</p>}
                    <p>{cliente.endereco.bairro}</p>
                    <p>{cliente.endereco.cidade} - {cliente.endereco.estado}</p>
                    <p>CEP: {cliente.endereco.cep}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum endereço cadastrado</p>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Link href="/admin/clientes" className="mr-2 text-amber-600 hover:text-amber-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Detalhes do Cliente</h1>
            </div>
            
            {renderConteudo()}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 