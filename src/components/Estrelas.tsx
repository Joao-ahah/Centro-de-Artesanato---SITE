import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface EstrelasProps {
  avaliacao: number;
  tamanho?: number;
  espacamento?: number;
  interativo?: boolean;
  onChange?: (valor: number) => void;
}

const Estrelas: React.FC<EstrelasProps> = ({ 
  avaliacao, 
  tamanho = 16, 
  espacamento = 1,
  interativo = false,
  onChange
}) => {
  // Garantir que a avaliação esteja entre 0 e 5
  const notaSegura = Math.min(Math.max(0, avaliacao), 5);
  
  // Calcular quantas estrelas cheias, metade e vazias
  const estrelasInteiras = Math.floor(notaSegura);
  const temMetade = notaSegura % 1 >= 0.5;
  const estrelasVazias = 5 - estrelasInteiras - (temMetade ? 1 : 0);
  
  // Função para lidar com cliques nas estrelas (quando interativo)
  const handleClick = (index: number) => {
    if (interativo && onChange) {
      onChange(index + 1); // +1 porque o índice começa em 0, mas a avaliação começa em 1
    }
  };
  
  return (
    <div className="flex" style={{ gap: `${espacamento}px` }}>
      {/* Estrelas cheias */}
      {Array.from({ length: estrelasInteiras }, (_, i) => (
        <FaStar 
          key={`cheia-${i}`} 
          className={`text-amber-400 ${interativo ? 'cursor-pointer' : ''}`}
          size={tamanho}
          onClick={() => handleClick(i)}
          onMouseEnter={() => interativo && onChange && onChange(i + 1)}
        />
      ))}
      
      {/* Estrela metade */}
      {temMetade && (
        <FaStarHalfAlt 
          className={`text-amber-400 ${interativo ? 'cursor-pointer' : ''}`}
          size={tamanho}
          onClick={() => interativo && handleClick(estrelasInteiras)}
        />
      )}
      
      {/* Estrelas vazias */}
      {Array.from({ length: estrelasVazias }, (_, i) => (
        <FaRegStar 
          key={`vazia-${i}`} 
          className={`text-amber-400 ${interativo ? 'cursor-pointer' : ''}`}
          size={tamanho}
          onClick={() => interativo && handleClick(estrelasInteiras + (temMetade ? 1 : 0) + i)}
          onMouseEnter={() => interativo && onChange && onChange(estrelasInteiras + (temMetade ? 1 : 0) + i + 1)}
        />
      ))}
    </div>
  );
};

export default Estrelas; 