import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export interface Relatorio {
  id: number;
  nome: string;
  descricao: string | null;
  tipoRelatorioId: number;
  tipoRelatorio: {
    id: number;
    tipo: string;
  };
  query: string | null;
  hasParameters: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getRelatorios = async (): Promise<Relatorio[]> => {
  const response = await api.get<Relatorio[]>('/relatorios');
  return response.data;
};