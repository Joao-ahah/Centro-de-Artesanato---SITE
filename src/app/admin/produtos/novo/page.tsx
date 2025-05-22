'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import AdminRoute from '@/components/AdminRoute';
import AdminSidebar from '@/components/AdminSidebar';
import { toast } from 'react-hot-toast';

interface ProdutoForm {
  nome: string;
  descricao: string;
  preco: string;
  precoPromocional?: string;
  categoria: string;
  quantidade: string;
  estoque?: string;
  destaque: boolean;
  imagens: string[];
  disponivel: boolean;
  subcategoria?: string;
  artesao?: string;
  tecnica?: string;
  tags?: string;
  material?: string[];
  dimensoes?: {
    altura?: string;
    largura?: string;
    comprimento?: string;
    peso?: string;
  };
}

export default function NovoProdutoPage() {
  const router = useRouter();
  
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [produto, setProduto] = useState<ProdutoForm>({
    nome: '',
    descricao: '',
    preco: '',
    precoPromocional: '',
    categoria: '',
    quantidade: '1',
    estoque: '1',
    destaque: false,
    disponivel: true,
    imagens: [''], // Iniciar com um campo de imagem vazio
    material: []
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [redirecting, setRedirecting] = useState(false);

  // Lista de categorias disponíveis
  const categorias = [
    { id: 'Decoração', nome: 'Decoração' },
    { id: 'Têxteis', nome: 'Têxteis' },
    { id: 'Acessórios', nome: 'Acessórios' },
    { id: 'Utilidades', nome: 'Utilidades' }
  ];

  // Subcategorias baseadas na categoria selecionada
  const subcategoriasPorCategoria: Record<string, string[]> = {
    'Decoração': ['Vasos', 'Quadros', 'Esculturas', 'Luminárias', 'Outros'],
    'Têxteis': ['Tapetes', 'Almofadas', 'Mantas', 'Toalhas', 'Outros'],
    'Acessórios': ['Colares', 'Brincos', 'Pulseiras', 'Anéis', 'Outros'],
    'Utilidades': ['Cestos', 'Potes', 'Utensílios de Cozinha', 'Organizadores', 'Outros']
  };

  // Função para lidar com alterações nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Lidar com campos aninhados (dimensões)
    if (name.includes('dimensoes.')) {
      const dimensaoKey = name.split('.')[1] as keyof typeof produto.dimensoes;
      setProduto(prev => ({
        ...prev,
        dimensoes: {
          ...prev.dimensoes,
          [dimensaoKey]: value
        }
      }));
    } 
    // Lidar com checkbox
    else if ((e.target as HTMLInputElement).type === 'checkbox') {
      setProduto(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } 
    // Campos regulares
    else {
      setProduto(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Função para lidar com o upload de imagem
  async function handleImageUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    const file = e.target.files[0];
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      // Simulando progresso do upload
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Criar FormData para enviar o arquivo
      const formData = new FormData();
      formData.append('file', file);

      // Fazendo a requisição para a API de upload
      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Limpar o intervalo e definir progresso como 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Verificar resposta
      if (response.data.success && response.data.imageUrls && response.data.imageUrls.length > 0) {
        // Atualizar o estado das imagens do produto
        const novasImagens = [...produto.imagens];
        novasImagens[index] = response.data.imageUrls[0];
        setProduto({
          ...produto,
          imagens: novasImagens
        });
        
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 500);
      } else {
        throw new Error('Falha ao carregar imagem');
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      setErro('Erro ao fazer upload da imagem. Tente novamente.');
      setUploading(false);
      setUploadProgress(0);
    }
  }

  // Função para adicionar mais um campo de imagem
  function adicionarCampoImagem() {
    setProduto({
      ...produto,
      imagens: [...produto.imagens, '']
    });
  }

  // Função para remover um campo de imagem
  function removerCampoImagem(index: number) {
    const novasImagens = [...produto.imagens];
    novasImagens.splice(index, 1);
    
    // Garantir que sempre haja pelo menos um campo de imagem
    if (novasImagens.length === 0) {
      novasImagens.push('');
    }
    
    setProduto({
      ...produto,
      imagens: novasImagens
    });
  }

  // Função para lidar com a mudança nos campos de imagem
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
    const novasImagens = [...produto.imagens];
    novasImagens[index] = e.target.value;
    setProduto({
      ...produto,
      imagens: novasImagens
    });
  }

  // Enviar o formulário
  async function salvarProduto(e: React.FormEvent) {
    e.preventDefault();
    try {
      setCarregando(true);
      setErro(null);
      
      // Validações básicas
      if (!produto.nome || !produto.descricao || !produto.preco || !produto.categoria) {
        setErro('Preencha todos os campos obrigatórios.');
        setCarregando(false);
        return;
      }
      
      // Filtrar imagens vazias
      const imagensFiltradas = produto.imagens.filter(img => img.trim() !== '');
      if (imagensFiltradas.length === 0) {
        setErro('Adicione pelo menos uma imagem ao produto.');
        setCarregando(false);
        return;
      }
      
      // Preparar dados para envio
      const dadosProduto = {
        ...produto,
        preco: parseFloat(produto.preco),
        quantidade: parseInt(produto.quantidade),
        estoque: parseInt(produto.estoque || '0'),
        imagens: imagensFiltradas
      };
      
      // Enviar para a API
      const response = await axios.post('/api/produtos', dadosProduto);
      
      if (response.data.success) {
        // Redirecionar para a lista de produtos após salvar
        setRedirecting(true);
        toast.success('Produto salvo com sucesso!');
        setTimeout(() => {
          router.push('/admin/produtos');
        }, 1500);
      } else {
        throw new Error(response.data.message || 'Erro ao salvar produto');
      }
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error);
      setErro(`Erro ao salvar produto: ${error.message}`);
      setCarregando(false);
    }
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
              <h1 className="text-2xl font-bold text-gray-800">Adicionar Novo Produto</h1>
            </div>
            
            {erro && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
                {erro}
              </div>
            )}
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <form onSubmit={salvarProduto} className="space-y-6">
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
                        value={produto.nome}
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
                        value={produto.artesao}
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
                      value={produto.descricao}
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
                        value={produto.preco}
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
                        value={produto.precoPromocional}
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
                        value={produto.estoque}
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
                        checked={produto.destaque}
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
                        checked={produto.disponivel}
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
                        value={produto.categoria}
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
                        value={produto.subcategoria}
                        onChange={handleChange}
                        disabled={!produto.categoria}
                      >
                        <option value="">Selecione uma subcategoria</option>
                        {produto.categoria && subcategoriasPorCategoria[produto.categoria]?.map((subcat) => (
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
                      value={produto.tags}
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
                      value={produto.tecnica}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Materiais *
                    </label>
                    
                    {produto.material?.map((material, index) => (
                      <div key={index} className="flex mb-2">
                        <input
                          type="text"
                          className="input-field flex-grow"
                          placeholder="Algodão, Argila, Madeira, etc."
                          value={material}
                          onChange={(e) => {
                            const newMaterial = [...(produto.material || [])];
                            newMaterial[index] = e.target.value;
                            setProduto(prev => ({
                              ...prev,
                              material: newMaterial
                            }));
                          }}
                          required
                        />
                        
                        <button
                          type="button"
                          className="ml-2 text-red-600 hover:text-red-800"
                          onClick={() => {
                            const newMaterial = produto.material?.filter((_, i) => i !== index);
                            setProduto(prev => ({
                              ...prev,
                              material: newMaterial
                            }));
                          }}
                          disabled={produto.material?.length === 1}
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      className="mt-2 text-sm text-amber-700 hover:text-amber-900"
                      onClick={() => setProduto(prev => ({
                        ...prev,
                        material: [...(prev.material || []), '']
                      }))}
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
                        value={produto.dimensoes?.altura}
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
                        value={produto.dimensoes?.largura}
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
                        value={produto.dimensoes?.comprimento}
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
                        value={produto.dimensoes?.peso}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Seção de imagens do produto - substitua a seção atual de imagens */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-medium mb-4">Imagens do Produto</h3>
                  
                  {/* Lista de campos de imagem */}
                  {produto.imagens.map((imagem, index) => (
                    <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="flex-grow">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {index === 0 ? 'Imagem Principal *' : `Imagem ${index + 1}`}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={imagem}
                              onChange={(e) => handleImageChange(e, index)}
                              placeholder="URL da imagem"
                              className="input-field w-full"
                              disabled={uploading}
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <div className="relative overflow-hidden">
                            <input
                              type="file"
                              id={`image-upload-${index}`}
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(index, e)}
                              disabled={uploading}
                            />
                            <label
                              htmlFor={`image-upload-${index}`}
                              className="btn-secondary text-sm py-1.5 px-3 cursor-pointer inline-block w-full text-center"
                            >
                              {uploading ? 'Enviando...' : 'Selecionar arquivo'}
                            </label>
                          </div>
                          
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removerCampoImagem(index)}
                              className="btn-danger text-sm py-1.5 px-3"
                              disabled={uploading}
                            >
                              Remover
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Preview da imagem */}
                      {imagem && (
                        <div className="mt-3">
                          <img 
                            src={imagem} 
                            alt={`Prévia ${index + 1}`} 
                            className="w-24 h-24 object-cover border rounded-md" 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {uploading && (
                    <div className="w-full mt-2 mb-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {uploadProgress < 100 ? `Enviando... ${uploadProgress}%` : 'Upload concluído!'}
                      </p>
                    </div>
                  )}
                  
                  {/* Botão para adicionar mais campos de imagem */}
                  <button
                    type="button"
                    onClick={adicionarCampoImagem}
                    className="btn-secondary text-sm mt-2"
                    disabled={uploading || produto.imagens.length >= 5}
                  >
                    + Adicionar outra imagem
                  </button>
                  {produto.imagens.length >= 5 && (
                    <p className="text-xs text-gray-500 mt-1">Máximo de 5 imagens permitido</p>
                  )}
                </div>
                
                {/* Botões de ação no final do formulário */}
                <div className="flex justify-between mt-8">
                  <Link href="/admin/produtos" className="btn-secondary">
                    Cancelar
                  </Link>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={carregando || uploading || redirecting}
                  >
                    {carregando || redirecting ? 'Salvando...' : 'Salvar Produto'}
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