import { useEffect } from 'react';
import { Header } from '../components/Header/Header';
import { Select } from '../components/Select/Select';
import { Table } from '../components/Table/Table';
import { FiAlertCircle } from 'react-icons/fi';
import { FaBroom } from 'react-icons/fa';
import { useReports } from '../contexts/ReportsContext';
import './styles.css';

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
  const { filteredReports, selectedType, setSelectedType, reloadReports } = useReports();

  // Recarrega os dados quando a página é montada
  useEffect(() => {
    console.log('Recarregando relatórios...');
    reloadReports();
  }, []);

  const handleReset = () => {
    setSelectedType('');
  };

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
    <div className="container-fluid">
      <div className="content-wrapper">
        <Header
          title="Exportar Dados"
          subtitle="Para exportar relatórios de dados, preencha os campos abaixo"
          cadastroPath="/cadastrar"
        />

        <div className="form-section">
          <div className="d-flex gap-3 align-items-end">
            <div className="flex-grow-1">
              <Select
                options={reportTypes}
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Tipo do relatório"
              />
            </div>
            <button 
              className="btn btn-outline-custom d-flex align-items-center justify-content-center gap-2"
              onClick={handleReset}
              style={{ height: '38px', paddingLeft: '1rem', paddingRight: '1rem' }}
            >
              <FaBroom />
              <span>Limpar</span>
            </button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}; 