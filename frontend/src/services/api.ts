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

export interface Report {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
}

const gerencialReports = [
  { id: 1, nome: "Relatório de Desempenho Mensal", descricao: "Análise mensal de KPIs", tipo: "Gerencial" },
  { id: 2, nome: "Dashboard Executivo", descricao: "Visão geral para diretoria", tipo: "Gerencial" },
  { id: 3, nome: "Análise de Produtividade", descricao: "Métricas de eficiência", tipo: "Gerencial" },
  { id: 4, nome: "Relatório de Metas", descricao: "Acompanhamento de objetivos", tipo: "Gerencial" },
  { id: 5, nome: "Indicadores Estratégicos", descricao: "Métricas estratégicas", tipo: "Gerencial" },
  { id: 6, nome: "Relatório de Performance", descricao: "Avaliação de desempenho", tipo: "Gerencial" },
  { id: 7, nome: "Análise de Tendências", descricao: "Projeções e tendências", tipo: "Gerencial" },
  { id: 8, nome: "Relatório de Qualidade", descricao: "Controle de qualidade", tipo: "Gerencial" },
  { id: 9, nome: "Dashboard de Projetos", descricao: "Status de projetos", tipo: "Gerencial" },
  { id: 10, nome: "Análise Competitiva", descricao: "Comparativo mercado", tipo: "Gerencial" },
  { id: 11, nome: "Relatório de Riscos", descricao: "Gestão de riscos", tipo: "Gerencial" },
  { id: 12, nome: "Indicadores de Inovação", descricao: "Métricas de inovação", tipo: "Gerencial" },
  { id: 13, nome: "Relatório de Satisfação", descricao: "Feedback de clientes", tipo: "Gerencial" },
  { id: 14, nome: "Análise de Crescimento", descricao: "Indicadores de crescimento", tipo: "Gerencial" },
  { id: 15, nome: "Dashboard Operacional", descricao: "Visão operacional", tipo: "Gerencial" },
  { id: 16, nome: "Relatório de Eficiência", descricao: "Métricas de eficiência", tipo: "Gerencial" },
  { id: 17, nome: "Análise de Mercado", descricao: "Estudos de mercado", tipo: "Gerencial" },
  { id: 18, nome: "Relatório de Estratégia", descricao: "Planejamento estratégico", tipo: "Gerencial" },
  { id: 19, nome: "Indicadores de Gestão", descricao: "Métricas gerenciais", tipo: "Gerencial" },
  { id: 20, nome: "Dashboard de Resultados", descricao: "Resultados gerais", tipo: "Gerencial" }
];

const operacionalReports = [
  { id: 21, nome: "Relatório de Produção", descricao: "Dados de produção diária", tipo: "Operacional" },
  { id: 22, nome: "Controle de Estoque", descricao: "Gestão de inventário", tipo: "Operacional" },
  { id: 23, nome: "Manutenção Preventiva", descricao: "Cronograma de manutenção", tipo: "Operacional" },
  { id: 24, nome: "Relatório de Ocorrências", descricao: "Registro de incidentes", tipo: "Operacional" },
  { id: 25, nome: "Controle de Qualidade", descricao: "Inspeção de qualidade", tipo: "Operacional" },
  { id: 26, nome: "Eficiência Operacional", descricao: "Métricas operacionais", tipo: "Operacional" },
  { id: 27, nome: "Relatório de Segurança", descricao: "Indicadores de segurança", tipo: "Operacional" },
  { id: 28, nome: "Controle de Processos", descricao: "Fluxos operacionais", tipo: "Operacional" },
  { id: 29, nome: "Relatório de Equipamentos", descricao: "Status de equipamentos", tipo: "Operacional" },
  { id: 30, nome: "Gestão de Recursos", descricao: "Alocação de recursos", tipo: "Operacional" },
  { id: 31, nome: "Controle de Perdas", descricao: "Análise de perdas", tipo: "Operacional" },
  { id: 32, nome: "Relatório de Produtividade", descricao: "Eficiência produtiva", tipo: "Operacional" },
  { id: 33, nome: "Gestão de Fornecedores", descricao: "Controle de fornecedores", tipo: "Operacional" },
  { id: 34, nome: "Controle de Expedição", descricao: "Logística de envios", tipo: "Operacional" },
  { id: 35, nome: "Relatório de Manutenção", descricao: "Registros de manutenção", tipo: "Operacional" },
  { id: 36, nome: "Gestão de Qualidade", descricao: "Controles de qualidade", tipo: "Operacional" },
  { id: 37, nome: "Controle de Produção", descricao: "Métricas de produção", tipo: "Operacional" },
  { id: 38, nome: "Relatório de Logística", descricao: "Operações logísticas", tipo: "Operacional" },
  { id: 39, nome: "Gestão de Estoque", descricao: "Controle de estoque", tipo: "Operacional" },
  { id: 40, nome: "Controle de Operações", descricao: "Processos operacionais", tipo: "Operacional" }
];

const financeiroReports = [
  { id: 41, nome: "Relatório Financeiro Mensal", descricao: "Demonstrativo mensal", tipo: "Financeiro" },
  { id: 42, nome: "Fluxo de Caixa", descricao: "Controle de caixa", tipo: "Financeiro" },
  { id: 43, nome: "Balanço Patrimonial", descricao: "Demonstrações contábeis", tipo: "Financeiro" },
  { id: 44, nome: "DRE", descricao: "Demonstração de resultados", tipo: "Financeiro" },
  { id: 45, nome: "Relatório de Custos", descricao: "Análise de custos", tipo: "Financeiro" },
  { id: 46, nome: "Controle de Receitas", descricao: "Gestão de receitas", tipo: "Financeiro" },
  { id: 47, nome: "Análise de Investimentos", descricao: "Retorno sobre investimento", tipo: "Financeiro" },
  { id: 48, nome: "Relatório de Despesas", descricao: "Controle de gastos", tipo: "Financeiro" },
  { id: 49, nome: "Projeção Financeira", descricao: "Previsões financeiras", tipo: "Financeiro" },
  { id: 50, nome: "Análise de Rentabilidade", descricao: "Indicadores de rentabilidade", tipo: "Financeiro" },
  { id: 51, nome: "Controle Orçamentário", descricao: "Gestão orçamentária", tipo: "Financeiro" },
  { id: 52, nome: "Relatório de Inadimplência", descricao: "Controle de inadimplentes", tipo: "Financeiro" },
  { id: 53, nome: "Análise de Crédito", descricao: "Avaliação de crédito", tipo: "Financeiro" },
  { id: 54, nome: "Relatório Tributário", descricao: "Gestão de tributos", tipo: "Financeiro" },
  { id: 55, nome: "Controle de Pagamentos", descricao: "Gestão de pagamentos", tipo: "Financeiro" },
  { id: 56, nome: "Análise de Margem", descricao: "Margens financeiras", tipo: "Financeiro" },
  { id: 57, nome: "Relatório de Faturamento", descricao: "Controle de faturamento", tipo: "Financeiro" },
  { id: 58, nome: "Gestão de Ativos", descricao: "Controle de ativos", tipo: "Financeiro" },
  { id: 59, nome: "Análise de Liquidez", descricao: "Indicadores de liquidez", tipo: "Financeiro" },
  { id: 60, nome: "Relatório de Auditoria", descricao: "Resultados de auditoria", tipo: "Financeiro" }
];

const mockReports: Report[] = [
  ...gerencialReports,
  ...operacionalReports,
  ...financeiroReports
];

export const getReports = async (): Promise<Report[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReports);
    }, 1000);
  });
};

export const getReportsByType = async (type: string): Promise<Report[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockReports.filter(report => report.tipo === type));
    }, 1000);
  });
}; 