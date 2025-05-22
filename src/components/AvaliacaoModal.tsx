import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Estrelas from './Estrelas';

interface AvaliacaoModalProps {
  produtoId: string;
  produtoNome: string;
  isOpen: boolean;
  onClose: () => void;
  onAvaliacaoSalva: () => void;
}

const AvaliacaoModal: React.FC<AvaliacaoModalProps> = ({
  produtoId,
  produtoNome,
  isOpen,
  onClose,
  onAvaliacaoSalva
}) => {
  const [avaliacao, setAvaliacao] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Fechar o modal e resetar os estados
  const fechar = () => {
    setAvaliacao(5);
    setComentario('');
    onClose();
  };

  // Enviar a avaliação
  const enviarAvaliacao = async () => {
    if (avaliacao < 1) {
      toast.error('Por favor, selecione pelo menos 1 estrela');
      return;
    }

    setEnviando(true);

    try {
      const response = await axios.post('/api/produtos/avaliacoes', {
        produtoId,
        avaliacao,
        comentario
      });

      if (response.data.success) {
        toast.success('Avaliação enviada com sucesso!');
        onAvaliacaoSalva();
        fechar();
      } else {
        throw new Error(response.data.message || 'Erro ao enviar avaliação');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Falha ao enviar sua avaliação');
      console.error('Erro ao enviar avaliação:', error);
    } finally {
      setEnviando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Cabeçalho */}
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Avaliar Produto</h3>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-4">
          <div className="mb-4">
            <p className="text-gray-700 font-medium mb-1">Produto:</p>
            <p className="text-gray-900">{produtoNome}</p>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 font-medium mb-2">Sua avaliação:</p>
            <div className="flex items-center">
              <Estrelas
                avaliacao={avaliacao}
                tamanho={32}
                espacamento={4}
                interativo={true}
                onChange={(valor) => setAvaliacao(valor)}
              />
              <span className="ml-4 text-lg text-gray-700">{avaliacao} de 5</span>
            </div>
          </div>

          <div>
            <label htmlFor="comentario" className="block text-gray-700 font-medium mb-2">
              Comentário (opcional):
            </label>
            <textarea
              id="comentario"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Compartilhe sua experiência com o produto..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none"
            onClick={fechar}
            disabled={enviando}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md focus:outline-none transition-colors"
            onClick={enviarAvaliacao}
            disabled={enviando}
          >
            {enviando ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : 'Enviar Avaliação'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvaliacaoModal; 