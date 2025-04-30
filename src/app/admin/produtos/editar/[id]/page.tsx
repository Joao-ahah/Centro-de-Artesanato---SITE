'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';
import LoadingScreen from '@/components/LoadingScreen';

interface ProdutoFormData {
  nome: string;
  descricao: string;
  preco: string;
  precoPromocional: string;
  categoria: string;
  subcategoria: string;
  estoque: string;
  imagens: string[];
  artesao: string;
  tecnica: string;
  material: string[];
  dimensoes: {
    altura: string;
    largura: string;
    comprimento: string;
    peso: string;
  };
  tags: string;
  emDestaque: boolean;
  disponivel: boolean;
}

const categorias = [
  { id: 'Decoração', nome: 'Decoração' },
  { id: 'Têxteis', nome: 'Têxteis' },
  { id: 'Acessórios', nome: 'Acessórios' },
  { id: 'Utilidades', nome: 'Utilidades' }
];

const subcategoriasPorCategoria: Record<string, string[]> = {
  'Decoração': ['Vasos', 'Quadros', 'Esculturas', 'Luminárias', 'Outros'],
  'Têxteis': ['Tapetes', 'Almofadas', 'Mantas', 'Toalhas', 'Outros'],
  'Acessórios': ['Colares', 'Brincos', 'Pulseiras', 'Anéis', 'Outros'],
  'Utilidades': ['Cestos', 'Potes', 'Utensílios de Cozinha', 'Organizadores', 'Outros']
};

export default function EditarProdutoPage() {
  const router = useRouter();
  const params = useParams();
  const produtoId = params.id as string;
  
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [previewImagem, setPreviewImagem] = useState('');
  
  const [formData, setFormData] = useState<ProdutoFormData>({
    nome: '',
    descricao: '',
    preco: '',
    precoPromocional: '',
    categoria: '',
    subcategoria: '',
    estoque: '',
    imagens: [''],
    artesao: '',
    tecnica: '',
    material: [''],
    dimensoes: {
      altura: '',
      largura: '',
      comprimento: '',
      peso: ''
    },
    tags: '',
    emDestaque: false,
    disponivel: true
  });

  // Carregar dados do produto ao montar o componente
  useEffect(() => {
    const carregarProduto = async () => {
      try {
        setCarregando(true);
        setErro(null);
        
        const response = await axios.get(`/api/produtos/${produtoId}`);
        
        if (response.data.success) {
          const produto = response.data.produto;
          
          // Converter dados para o formato do formulário
          setFormData({
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco.toString(),
            precoPromocional: produto.precoPromocional ? produto.precoPromocional.toString() : '',
            categoria: produto.categoria,
            subcategoria: produto.subcategoria || '',
            estoque: produto.estoque.toString(),
            imagens: produto.imagens.length > 0 ? produto.imagens : [''],
            artesao: produto.artesao,
            tecnica: produto.tecnica,
            material: produto.material.length > 0 ? produto.material : [''],
            dimensoes: {
              altura: produto.dimensoes?.altura ? produto.dimensoes.altura.toString() : '',
              largura: produto.dimensoes?.largura ? produto.dimensoes.largura.toString() : '',
              comprimento: produto.dimensoes?.comprimento ? produto.dimensoes.comprimento.toString() : '',
              peso: produto.dimensoes?.peso ? produto.dimensoes.peso.toString() : ''
            },
            tags: produto.tags ? produto.tags.join(', ') : '',
            emDestaque: produto.emDestaque,
            disponivel: produto.disponivel
          });
          
          // Configurar preview da primeira imagem
          if (produto.imagens?.length > 0) {
            setPreviewImagem(produto.imagens[0]);
          }
        } else {
          throw new Error(response.data.message || 'Erro ao carregar produto');
        }
      } catch (err: any) {
        console.error('Erro ao carregar produto:', err);
        setErro(err.message || 'Não foi possível carregar os dados do produto');
      } finally {
        setCarregando(false);
      }
    };
    
    if (produtoId) {
      carregarProduto();
    }
  }, [produtoId]);

  // Função para lidar com alterações nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Lidar com campos aninhados (dimensões)
    if (name.includes('dimensoes.')) {
      const dimensaoKey = name.split('.')[1] as keyof typeof formData.dimensoes;
      setFormData(prev => ({
        ...prev,
        dimensoes: {
          ...prev.dimensoes,
          [dimensaoKey]: value
        }
      }));
    } 
    // Lidar com checkbox
    else if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } 
    // Campos regulares
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Adicionar mais um campo de imagem
  const adicionarCampoImagem = () => {
    setFormData(prev => ({
      ...prev,
      imagens: [...prev.imagens, '']
    }));
  };

  // Remover um campo de imagem
  const removerCampoImagem = (index: number) => {
    if (formData.imagens.length > 1) {
      setFormData(prev => ({
        ...prev,
        imagens: prev.imagens.filter((_, i) => i !== index)
      }));
    }
  };

  // Atualizar uma imagem específica
  const handleImagemChange = (index: number, valor: string) => {
    const novasImagens = [...formData.imagens];
    novasImagens[index] = valor;
    setFormData(prev => ({
      ...prev,
      imagens: novasImagens
    }));

    // Atualizar preview com a primeira imagem
    if (index === 0) {
      setPreviewImagem(valor);
    }
  };

  // Adicionar mais um campo de material
  const adicionarCampoMaterial = () => {
    setFormData(prev => ({
      ...prev,
      material: [...prev.material, '']
    }));
  };

  // Remover um campo de material
  const removerCampoMaterial = (index: number) => {
    if (formData.material.length > 1) {
      setFormData(prev => ({
        ...prev,
        material: prev.material.filter((_, i) => i !== index)
      }));
    }
  };

  // Atualizar um material específico
  const handleMaterialChange = (index: number, valor: string) => {
    const novosMateriais = [...formData.material];
    novosMateriais[index] = valor;
    setFormData(prev => ({
      ...prev,
      material: novosMateriais
    }));
  };

  // Enviar o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);
    setSalvando(true);

    try {
      // Validar dados
      if (!formData.nome || !formData.descricao || !formData.preco || !formData.categoria || !formData.artesao || !formData.tecnica) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      // Filtrar imagens vazias
      const imagens = formData.imagens.filter(img => img.trim() !== '');
      
      // Filtrar materiais vazios
      const materiais = formData.material.filter(mat => mat.trim() !== '');

      if (imagens.length === 0) {
        throw new Error('Adicione pelo menos uma imagem');
      }

      if (materiais.length === 0) {
        throw new Error('Adicione pelo menos um material');
      }

      // Converter valores numéricos
      const produtoAtualizado = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        precoPromocional: formData.precoPromocional ? parseFloat(formData.precoPromocional) : undefined,
        categoria: formData.categoria,
        subcategoria: formData.subcategoria || undefined,
        estoque: parseInt(formData.estoque),
        imagens,
        artesao: formData.artesao,
        tecnica: formData.tecnica,
        material: materiais,
        dimensoes: {
          altura: formData.dimensoes.altura ? parseFloat(formData.dimensoes.altura) : undefined,
          largura: formData.dimensoes.largura ? parseFloat(formData.dimensoes.largura) : undefined,
          comprimento: formData.dimensoes.comprimento ? parseFloat(formData.dimensoes.comprimento) : undefined,
          peso: formData.dimensoes.peso ? parseFloat(formData.dimensoes.peso) : undefined
        },
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        emDestaque: formData.emDestaque,
        disponivel: formData.disponivel
      };

      // Enviar para a API
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Você precisa estar autenticado para editar produtos');
      }

      const response = await axios.put(`/api/produtos/${produtoId}`, produtoAtualizado, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setMensagem('Produto atualizado com sucesso!');
        setTimeout(() => {
          router.push('/admin/produtos');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Erro ao atualizar produto');
      }
    } catch (err: any) {
      setErro(err.message || 'Ocorreu um erro ao atualizar o produto');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return <LoadingScreen />;
  }

  return (
    <AdminRoute>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Link href="/admin/produtos" className="text-amber-600 hover:text-amber-800 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Editar Produto</h1>
            </div>
            
            {erro && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
                {erro}
              </div>
            )}
            
            {mensagem && (
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
                {mensagem}
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Informações básicas */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4">Informações Básicas</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Produto *
                      </label>
                      <input
                        type="text"
                        id="nome"
                        name="nome"
                        className="input-field w-full"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="artesao" className="block text-sm font-medium text-gray-700 mb-1">
                        Artesão/Artesã *
                      </label>
                      <input
                        type="text"
                        id="artesao"
                        name="artesao"
                        className="input-field w-full"
                        value={formData.artesao}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição Detalhada *
                    </label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      rows={4}
                      className="input-field w-full"
                      value={formData.descricao}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>
                
                {/* Preço e Estoque */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4">Preço e Estoque</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        id="preco"
                        name="preco"
                        step="0.01"
                        min="0"
                        className="input-field w-full"
                        value={formData.preco}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="precoPromocional" className="block text-sm font-medium text-gray-700 mb-1">
                        Preço Promocional (R$)
                      </label>
                      <input
                        type="number"
                        id="precoPromocional"
                        name="precoPromocional"
                        step="0.01"
                        min="0"
                        className="input-field w-full"
                        value={formData.precoPromocional}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="estoque" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantidade em Estoque *
                      </label>
                      <input
                        type="number"
                        id="estoque"
                        name="estoque"
                        min="0"
                        step="1"
                        className="input-field w-full"
                        value={formData.estoque}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emDestaque"
                        name="emDestaque"
                        className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        checked={formData.emDestaque}
                        onChange={handleChange}
                      />
                      <label htmlFor="emDestaque" className="ml-2 block text-sm text-gray-700">
                        Produto em Destaque
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="disponivel"
                        name="disponivel"
                        className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        checked={formData.disponivel}
                        onChange={handleChange}
                      />
                      <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-700">
                        Produto Disponível para Venda
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Categorização */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4">Categorização</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                        Categoria *
                      </label>
                      <select
                        id="categoria"
                        name="categoria"
                        className="input-field w-full"
                        value={formData.categoria}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="subcategoria" className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategoria
                      </label>
                      <select
                        id="subcategoria"
                        name="subcategoria"
                        className="input-field w-full"
                        value={formData.subcategoria}
                        onChange={handleChange}
                        disabled={!formData.categoria}
                      >
                        <option value="">Selecione uma subcategoria</option>
                        {formData.categoria && subcategoriasPorCategoria[formData.categoria]?.map((subcat) => (
                          <option key={subcat} value={subcat}>
                            {subcat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (separadas por vírgula)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      className="input-field w-full"
                      placeholder="artesanal, decoração, feito à mão, etc."
                      value={formData.tags}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Técnicas e Materiais */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4">Técnicas e Materiais</h3>
                  
                  <div className="mb-4">
                    <label htmlFor="tecnica" className="block text-sm font-medium text-gray-700 mb-1">
                      Técnica Artesanal *
                    </label>
                    <input
                      type="text"
                      id="tecnica"
                      name="tecnica"
                      className="input-field w-full"
                      placeholder="Cerâmica, Macramê, Crochê, etc."
                      value={formData.tecnica}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materiais *
                    </label>
                    
                    {formData.material.map((material, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          className="input-field flex-grow"
                          placeholder="Algodão, Argila, Madeira, etc."
                          value={material}
                          onChange={(e) => handleMaterialChange(index, e.target.value)}
                          required
                        />
                        
                        <button
                          type="button"
                          className="ml-2 text-red-600 hover:text-red-800"
                          onClick={() => removerCampoMaterial(index)}
                          disabled={formData.material.length === 1}
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="mt-2 text-sm text-amber-700 hover:text-amber-900"
                      onClick={adicionarCampoMaterial}
                    >
                      + Adicionar Material
                    </button>
                  </div>
                </div>
                
                {/* Dimensões */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4">Dimensões (opcional)</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="dimensoes.altura" className="block text-sm font-medium text-gray-700 mb-1">
                        Altura (cm)
                      </label>
                      <input
                        type="number"
                        id="dimensoes.altura"
                        name="dimensoes.altura"
                        min="0"
                        step="0.1"
                        className="input-field w-full"
                        value={formData.dimensoes.altura}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dimensoes.largura" className="block text-sm font-medium text-gray-700 mb-1">
                        Largura (cm)
                      </label>
                      <input
                        type="number"
                        id="dimensoes.largura"
                        name="dimensoes.largura"
                        min="0"
                        step="0.1"
                        className="input-field w-full"
                        value={formData.dimensoes.largura}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dimensoes.comprimento" className="block text-sm font-medium text-gray-700 mb-1">
                        Comprimento (cm)
                      </label>
                      <input
                        type="number"
                        id="dimensoes.comprimento"
                        name="dimensoes.comprimento"
                        min="0"
                        step="0.1"
                        className="input-field w-full"
                        value={formData.dimensoes.comprimento}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="dimensoes.peso" className="block text-sm font-medium text-gray-700 mb-1">
                        Peso (kg)
                      </label>
                      <input
                        type="number"
                        id="dimensoes.peso"
                        name="dimensoes.peso"
                        min="0"
                        step="0.1"
                        className="input-field w-full"
                        value={formData.dimensoes.peso}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Imagens */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Imagens do Produto *</h3>
                  
                  {/* Preview da primeira imagem */}
                  {previewImagem && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-700 mb-2">Preview:</p>
                      <div className="relative h-40 w-40 border rounded overflow-hidden">
                        <img 
                          src={previewImagem} 
                          alt="Preview" 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            // Fallback para quando a imagem não carrega
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Imagem+não+encontrada';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {formData.imagens.map((imagem, index) => (
                    <div key={index} className="flex mb-2">
                      <input
                        type="text"
                        className="input-field flex-grow"
                        placeholder="URL da imagem (https://...)"
                        value={imagem}
                        onChange={(e) => handleImagemChange(index, e.target.value)}
                        required={index === 0}
                      />
                      
                      <button
                        type="button"
                        className="ml-2 text-red-600 hover:text-red-800"
                        onClick={() => removerCampoImagem(index)}
                        disabled={formData.imagens.length === 1}
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    className="mt-2 text-sm text-amber-700 hover:text-amber-900"
                    onClick={adicionarCampoImagem}
                  >
                    + Adicionar Imagem
                  </button>
                  
                  <p className="mt-2 text-xs text-gray-500">
                    Cole URLs de imagens hospedadas em serviços como Unsplash, Imgur, ou outros sites de hospedagem de imagens.
                  </p>
                </div>
                
                {/* Botões de ação */}
                <div className="flex justify-end space-x-4 mt-8">
                  <Link 
                    href="/admin/produtos" 
                    className="btn-secondary"
                  >
                    Cancelar
                  </Link>
                  
                  <button
                    type="submit"
                    className={`btn-primary ${salvando ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={salvando}
                  >
                    {salvando ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
} 