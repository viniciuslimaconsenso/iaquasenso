import { Header } from '../components/Header/Header';
import { Select } from '../components/Select/Select';
import { Table } from '../components/Table/Table';
import { FiAlertCircle } from 'react-icons/fi';
import { useReports } from '../contexts/ReportsContext';

const reportTypes = [
  { value: 'Gerencial', label: 'Gerencial' },
  { value: 'Operacional', label: 'Operacional' },
  { value: 'Financeiro', label: 'Financeiro' },
];

const columns = [
  { key: 'nome', header: 'Nome' },
  { key: 'descricao', header: 'Descrição' },
  { key: 'tipo', header: 'Tipo do Relatório' },
];

export const Home = () => {
  const { filteredReports, selectedType, setSelectedType } = useReports();

  const formatTableData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      tipo: item.tipo.tipo // Extraindo apenas o nome do tipo
    }));
  };

  const renderContent = () => {
    if (!selectedType || filteredReports.length === 0) {
      return (
        <div className="table-container">
          <div className="empty-state">
            <FiAlertCircle className="empty-state-icon" />
            <span className="empty-state-text">Sem nenhum dado</span>
          </div>
        </div>
      );
    }

    return (
      <div className="table-container">
        <Table
          data={formatTableData(filteredReports)}
          columns={columns}
        />
      </div>
    );
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        <Header
          title="Exportar Dados"
          subtitle="Para exportar relatórios de dados, preencha os campos abaixo"
        />

        <Select
          options={reportTypes}
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          label="Tipo do relatório"
        />

        {renderContent()}
      </div>
    </div>
  );
}; 