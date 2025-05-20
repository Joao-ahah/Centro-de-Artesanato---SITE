import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

interface EstrelasProps {
  avaliacao: number;
  tamanho?: number;
  espacamento?: number;
}

const Estrelas: React.FC<EstrelasProps> = ({ 
  avaliacao, 
  tamanho = 16, 
  espacamento = 1 
}) => {
  // Garantir que a avaliação esteja entre 0 e 5
  const notaSegura = Math.min(Math.max(0, avaliacao), 5);
  
  // Calcular quantas estrelas cheias, metade e vazias
  const estrelasInteiras = Math.floor(notaSegura);
  const temMetade = notaSegura % 1 >= 0.5;
  const estrelasVazias = 5 - estrelasInteiras - (temMetade ? 1 : 0);
  
  return (
    <div className="flex" style={{ gap: `${espacamento}px` }}>
      {/* Estrelas cheias */}
      {Array.from({ length: estrelasInteiras }, (_, i) => (
        <FaStar 
          key={`cheia-${i}`} 
          className="text-amber-400" 
          size={tamanho}
        />
      ))}
      
      {/* Estrela metade */}
      {temMetade && (
        <FaStarHalfAlt 
          className="text-amber-400" 
          size={tamanho}
        />
      )}
      
      {/* Estrelas vazias */}
      {Array.from({ length: estrelasVazias }, (_, i) => (
        <FaRegStar 
          key={`vazia-${i}`} 
          className="text-amber-400" 
          size={tamanho}
        />
      ))}
    </div>
  );
};

export default Estrelas; 