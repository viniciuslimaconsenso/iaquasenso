import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// Interceptor para requisições
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Requisição enviada:', {
      método: config.method?.toUpperCase(),
      url: config.url,
      dados: config.data,
      parâmetros: config.params,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('❌ Erro ao enviar requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', {
      status: response.status,
      dados: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('❌ Erro na resposta do servidor:', {
        status: error.response.status,
        dados: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error('❌ Sem resposta do servidor:', error.request);
    } else {
      // Erro na configuração da requisição
      console.error('❌ Erro na configuração da requisição:', error.message);
    }
    console.error('🔍 Configuração completa do erro:', error.config);
    return Promise.reject(error);
  }
);

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
  try {
    const response = await api.get<Relatorio[]>('/relatorios');
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar relatórios:', error);
    throw error;
  }
};

export const getQuery = async (id: number): Promise<Query> => {
  try {
    const response = await api.get<Query>(`/queries/${id}`);
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar query:', error);
    throw error;
  }
};