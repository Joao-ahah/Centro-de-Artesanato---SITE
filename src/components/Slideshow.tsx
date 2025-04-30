'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface SlideType {
  id: number;
  imagem: string;
  titulo: string;
  subtitulo: string;
  link: string;
  linkTexto: string;
}

interface SlideshowProps {
  slides: SlideType[];
  interval?: number; // Intervalo em ms entre os slides
  height?: string;
}

const Slideshow = ({ slides, interval = 6000, height = 'h-[500px]' }: SlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoadError, setImageLoadError] = useState<Record<number, boolean>>({});
  const slideshowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === slides.length - 1 ? 0 : prevSlide + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? slides.length - 1 : prevSlide - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    
    if (!isPaused) {
      timeoutRef.current = setTimeout(() => {
        nextSlide();
      }, interval);
    }

    return () => {
      resetTimeout();
    };
  }, [currentSlide, interval, isPaused]);

  // Pausar o slideshow quando o mouse estiver sobre ele
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Cores de fundo para fallback quando as imagens não carregarem
  const fallbackColors = [
    'bg-amber-800',
    'bg-amber-700',
    'bg-amber-900',
    'bg-amber-600'
  ];

  return (
    <div 
      className={`relative ${height} overflow-hidden`}
      ref={slideshowRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Slides */}
      <div className="h-full">
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Overlay escuro para melhorar a legibilidade do texto */}
            <div className="absolute inset-0 bg-black/40 z-10"></div>
            
            {/* Imagem de fundo ou cor de fallback */}
            <div className="absolute inset-0">
              {imageLoadError[index] ? (
                <div className={`w-full h-full ${fallbackColors[index % fallbackColors.length]}`}></div>
              ) : (
                <Image 
                  src={slide.imagem}
                  alt={slide.titulo}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                  onError={(e) => {
                    // Fallback para cor de fundo quando a imagem não carrega
                    setImageLoadError(prev => ({ ...prev, [index]: true }));
                  }}
                />
              )}
            </div>
            
            {/* Conteúdo do slide */}
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center">
              <div className="max-w-3xl px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{slide.titulo}</h1>
                <p className="text-xl text-white mb-8">{slide.subtitulo}</p>
                <Link href={slide.link} className="btn-primary text-lg px-8 py-3">
                  {slide.linkTexto}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botões de navegação */}
      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/50 text-white rounded-full p-2 focus:outline-none transition-colors"
        onClick={prevSlide}
        aria-label="Slide anterior"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/50 text-white rounded-full p-2 focus:outline-none transition-colors"
        onClick={nextSlide}
        aria-label="Próximo slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Indicadores (pontos) */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full focus:outline-none transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow; 