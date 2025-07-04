import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Relatorio } from '../services/api';
import { getRelatorios } from '../services/api';
import { useLoading } from './LoadingContext';

interface ReportsContextData {
  reports: Relatorio[];
  filteredReports: Relatorio[];
  setSelectedType: (type: string) => void;
  selectedType: string;
  isLoaded: boolean;
  reloadReports: () => Promise<void>;
}

const ReportsContext = createContext<ReportsContextData>({} as ReportsContextData);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Relatorio[]>([]);
  const [filteredReports, setFilteredReports] = useState<Relatorio[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const { setIsLoading } = useLoading();

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const data = await getRelatorios();
      console.log('Dados retornados da API:', data);
      setReports(data);
      setIsLoaded(true);
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Carrega todos os relatórios ao iniciar
  useEffect(() => {
    loadReports();
  }, []);

  // Filtra os relatórios quando o tipo é selecionado
  useEffect(() => {
    if (!selectedType) {
      setFilteredReports([]);
      return;
    }

    const filtered = reports.filter(report => report.tipoRelatorio?.tipo === selectedType);
    console.log('Relatórios filtrados:', filtered);
    setFilteredReports(filtered);
  }, [selectedType, reports]);

  return (
    <ReportsContext.Provider 
      value={{ 
        reports, 
        filteredReports, 
        setSelectedType, 
        selectedType,
        isLoaded,
        reloadReports: loadReports
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportsContext);

  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }

  return context;
} 