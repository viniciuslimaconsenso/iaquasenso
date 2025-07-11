import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000'
});

export interface Query {
  id: number;
  query: string;
  createdAt: string;
  updatedAt: string;
}

export interface Relatorio {
  id: number;
  nome: string;
  descricao: string | null;
  tipoRelatorioId: number;
  tipoRelatorio: {
    id: number;
    tipo: string;
  };
  queryId: number | null;
  query: Query | null;
  hasParameters: boolean;
  createdAt: string;
  updatedAt: string;
}

export const getRelatorios = async (): Promise<Relatorio[]> => {
  const response = await api.get<Relatorio[]>('/relatorios');
  return response.data;
};

export const getQuery = async (id: number): Promise<Query> => {
  const response = await api.get<Query>(`/queries/${id}`);
  return response.data;
};