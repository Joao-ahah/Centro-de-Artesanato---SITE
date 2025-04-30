'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/providers/AuthProvider';
import LoadingScreen from '@/components/LoadingScreen';

interface EnderecoForm {
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface UserProfileData {
  nome: string;
  email: string;
  telefone: string;
  endereco: EnderecoForm;
}

export default function PerfilPage() {
  const { user, authenticated, requireAuth } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState<UserProfileData>({
    nome: '',
    email: '',
    telefone: '',
    endereco: {
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const result = await requireAuth();
      if (!result.success) {
        router.push('/conta/login?redirect=/conta/perfil');
      } else {
        await loadUserData();
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [requireAuth, router]);

  const loadUserData = async () => {
    try {
      // Simulação de chamada à API
      // Em um ambiente real, você usaria:
      // const response = await fetch('/api/usuarios/perfil');
      // const data = await response.json();
      
      // Por enquanto, vamos apenas usar os dados do contexto de autenticação
      if (user) {
        setFormData({
          nome: user.nome || '',
          email: user.email || '',
          telefone: '',
          endereco: {
            rua: '',
            numero: '',
            complemento: '',
            bairro: '',
            cidade: '',
            estado: '',
            cep: ''
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      setMessage({
        text: 'Não foi possível carregar seus dados. Tente novamente mais tarde.',
        type: 'error'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulação de envio de dados - em produção, isso seria uma chamada à API
      // const response = await fetch('/api/usuarios/perfil', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();
      
      // Simulando resposta bem-sucedida
      setTimeout(() => {
        setMessage({
          text: 'Perfil atualizado com sucesso!',
          type: 'success'
        });
        setSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setMessage({
        text: 'Erro ao atualizar perfil. Tente novamente.',
        type: 'error'
      });
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-amber-600 text-white">
            <h1 className="text-2xl font-bold">Meu Perfil</h1>
          </div>
          
          {message.text && (
            <div className={`p-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Dados Pessoais</h2>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="nome">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="email">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado.</p>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="telefone">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="(00) 00000-0000"
                  />
                </div>
                
                <div className="col-span-2 mt-4">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">Endereço</h2>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="cep">
                    CEP
                  </label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={formData.endereco.cep}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="00000-000"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-gray-700 mb-2" htmlFor="rua">
                    Rua
                  </label>
                  <input
                    type="text"
                    id="rua"
                    name="rua"
                    value={formData.endereco.rua}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="numero">
                    Número
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    value={formData.endereco.numero}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="complemento">
                    Complemento
                  </label>
                  <input
                    type="text"
                    id="complemento"
                    name="complemento"
                    value={formData.endereco.complemento}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Apto, Bloco, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="bairro">
                    Bairro
                  </label>
                  <input
                    type="text"
                    id="bairro"
                    name="bairro"
                    value={formData.endereco.bairro}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="cidade">
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    value={formData.endereco.cidade}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="estado">
                    Estado
                  </label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.endereco.estado}
                    onChange={handleEnderecoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="AC">Acre</option>
                    <option value="AL">Alagoas</option>
                    <option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option>
                    <option value="BA">Bahia</option>
                    <option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option>
                    <option value="ES">Espírito Santo</option>
                    <option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option>
                    <option value="MT">Mato Grosso</option>
                    <option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="PA">Pará</option>
                    <option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option>
                    <option value="PE">Pernambuco</option>
                    <option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="RN">Rio Grande do Norte</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option>
                    <option value="RR">Roraima</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option>
                    <option value="SE">Sergipe</option>
                    <option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 mr-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => router.push('/conta')}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 disabled:opacity-50"
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 