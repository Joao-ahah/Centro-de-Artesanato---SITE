/**
 * Formata um número para o formato de moeda brasileira (BRL)
 * @param valor Valor a ser formatado
 * @returns String formatada em formato de moeda
 */
export const formatarMoeda = (valor: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}; 