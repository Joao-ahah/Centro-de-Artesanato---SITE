import React from 'react';

interface LoadingProps {
  mensagem?: string;
  tamanho?: 'pequeno' | 'medio' | 'grande';
}

const Loading: React.FC<LoadingProps> = ({ 
  mensagem = 'Carregando...', 
  tamanho = 'medio' 
}) => {
  // Definir tamanhos com base no parâmetro
  const tamanhos = {
    pequeno: {
      container: 'h-24',
      spinner: 'w-8 h-8 border-4'
    },
    medio: {
      container: 'h-40',
      spinner: 'w-12 h-12 border-4'
    },
    grande: {
      container: 'h-64',
      spinner: 'w-16 h-16 border-[6px]'
    }
  };

  const classes = tamanhos[tamanho];

  return (
    <div className={`flex flex-col items-center justify-center ${classes.container} w-full`}>
      <div className={`${classes.spinner} border-t-amber-600 border-amber-200 rounded-full animate-spin mb-4`}></div>
      <p className="text-gray-600 text-center">{mensagem}</p>
    </div>
  );
};

export default Loading; 