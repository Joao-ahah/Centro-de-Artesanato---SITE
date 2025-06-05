'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';

export default function NovaNoticia() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro', texto: string } | null>(null);

  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    slug: '',
    resumo: '',
    conteudo: '',
    imagem: '',
    autor: '',
    categorias: [] as string[],
    tags: [] as string[],
    publicado: false
  });

  // Categorias disponíveis
  const categoriasDisponiveis = [
    'Eventos', 'Workshop', 'Notícias', 'Lançamento', 
    'Sustentabilidade', 'Exposição', 'Feira', 'Cerâmica',
    'Capacitação', 'Comunidades', 'Fotografia'
  ];

  // Função para gerar slug automaticamente
  const gerarSlug = (titulo: string) => {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/-+/g, '-') // Remove hífens duplicados
      .trim();
  };

  // Manipular mudanças nos campos
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Gerar slug automaticamente quando o título mudar
      if (name === 'titulo' && !formData.slug) {
        setFormData(prev => ({
          ...prev,
          slug: gerarSlug(value)
        }));
      }
    }
  };

  // Manipular categorias
  const handleCategoriaChange = (categoria: string) => {
    setFormData(prev => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter(c => c !== categoria)
        : [...prev.categorias, categoria]
    }));
  };

  // Manipular tags
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.titulo || !formData.resumo || !formData.conteudo || !formData.autor) {
      setMensagem({ tipo: 'erro', texto: 'Por favor, preencha todos os campos obrigatórios.' });
      return;
    }

    if (formData.categorias.length === 0) {
      setMensagem({ tipo: 'erro', texto: 'Selecione pelo menos uma categoria.' });
      return;
    }

    try {
      setLoading(true);
      setMensagem(null);

      const response = await axios.post('/api/noticias', formData);

      if (response.data.success) {
        setMensagem({ tipo: 'sucesso', texto: 'Notícia criada com sucesso!' });
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          router.push('/admin/noticias');
        }, 2000);
      } else {
        setMensagem({ tipo: 'erro', texto: response.data.message || 'Erro ao criar notícia' });
      }
    } catch (error: any) {
      console.error('Erro ao criar notícia:', error);
      setMensagem({ 
        tipo: 'erro', 
        texto: error.response?.data?.message || 'Erro ao criar notícia. Tente novamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Nova Notícia</h1>
              <button
                onClick={() => router.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md"
              >
                Voltar
              </button>
            </div>

            {/* Mensagem de feedback */}
            {mensagem && (
              <div className={`mb-6 p-4 rounded-md ${
                mensagem.tipo === 'sucesso' 
                  ? 'bg-green-100 border border-green-400 text-green-700' 
                  : 'bg-red-100 border border-red-400 text-red-700'
              }`}>
                {mensagem.texto}
                <button 
                  onClick={() => setMensagem(null)}
                  className="float-right text-lg font-bold"
                >
                  ×
                </button>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Coluna esquerda */}
                <div className="space-y-6">
                  {/* Título */}
                  <div>
                    <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      id="titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="sera-gerado-automaticamente"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Deixe em branco para gerar automaticamente
                    </p>
                  </div>

                  {/* Resumo */}
                  <div>
                    <label htmlFor="resumo" className="block text-sm font-medium text-gray-700 mb-2">
                      Resumo *
                    </label>
                    <textarea
                      id="resumo"
                      name="resumo"
                      value={formData.resumo}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Breve descrição da notícia..."
                      required
                    />
                  </div>

                  {/* Autor */}
                  <div>
                    <label htmlFor="autor" className="block text-sm font-medium text-gray-700 mb-2">
                      Autor *
                    </label>
                    <input
                      type="text"
                      id="autor"
                      name="autor"
                      value={formData.autor}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  {/* Imagem */}
                  <div>
                    <label htmlFor="imagem" className="block text-sm font-medium text-gray-700 mb-2">
                      URL da Imagem
                    </label>
                    <input
                      type="url"
                      id="imagem"
                      name="imagem"
                      value={formData.imagem}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                </div>

                {/* Coluna direita */}
                <div className="space-y-6">
                  {/* Categorias */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categorias *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {categoriasDisponiveis.map(categoria => (
                        <label key={categoria} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.categorias.includes(categoria)}
                            onChange={() => handleCategoriaChange(categoria)}
                            className="mr-2 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-sm">{categoria}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags.join(', ')}
                      onChange={handleTagsChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Separe as tags com vírgulas
                    </p>
                  </div>

                  {/* Status de publicação */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="publicado"
                        checked={formData.publicado}
                        onChange={handleInputChange}
                        className="mr-2 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Publicar imediatamente
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Se desmarcado, a notícia será salva como rascunho
                    </p>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="mt-6">
                <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-2">
                  Conteúdo *
                </label>
                <textarea
                  id="conteudo"
                  name="conteudo"
                  value={formData.conteudo}
                  onChange={handleInputChange}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Escreva o conteúdo completo da notícia..."
                  required
                />
              </div>

              {/* Botões */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvando...' : 'Salvar Notícia'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 