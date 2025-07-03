import { useEffect, useState } from 'react';
import { Header } from '../components/Header/Header';
import { Select } from '../components/Select/Select';
import { Table } from '../components/Table/Table';
import { Button } from '../components/Button/Button';
import { FiAlertCircle, FiDownload, FiTrash, FiPrinter } from 'react-icons/fi';
import { FaBroom } from 'react-icons/fa';
import { useReports } from '../contexts/ReportsContext';
import { api } from '../services/api';
import { ConfirmationModal } from '../components/ConfirmationModal/ConfirmationModal';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  const [showResults, setShowResults] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [resultColumns, setResultColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmButtonText?: string;
    confirmButtonVariant?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Recarrega os dados quando a página é montada
  useEffect(() => {
    console.log('Recarregando relatórios...');
    reloadReports();
  }, []);

  const handleReset = () => {
    setSelectedType('');
    setShowResults(false);
    setQueryResults([]);
    setResultColumns([]);
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Configuração do cabeçalho do PDF
      doc.setFontSize(16);
      doc.text('Relatório de Dados', 14, 15);
      doc.setFontSize(10);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);
      
      // Preparar dados para a tabela
      const headers = resultColumns.map(col => col.header);
      const data = queryResults.map(row => 
        resultColumns.map(col => row[col.key]?.toString() || '')
      );
      
      // Configuração e geração da tabela
      autoTable(doc, {
        head: [headers],
        body: data,
        startY: 30,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [53, 119, 241],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });
      
      // Salvar o PDF
      doc.save('relatorio.pdf');
      
      Swal.fire({
        title: 'Sucesso!',
        text: 'PDF gerado com sucesso!',
        icon: 'success',
        confirmButtonColor: 'var(--primary)'
      });
    } catch (error) {
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao gerar o PDF.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    }
  };

  const handleRowClick = async (report: any) => {
    try {
      setIsLoading(true);
      const response = await api.post('/query/execute', {
        query: report.query
      });

      if (response.data && response.data.length > 0) {
        // Extrair as colunas do primeiro resultado
        const columns = Object.keys(response.data[0]).map(key => ({
          key,
          header: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
        }));

        setResultColumns(columns);
        setQueryResults(response.data);
        setShowResults(true);
      } else {
        Swal.fire({
          title: 'Sem resultados',
          text: 'A query não retornou nenhum resultado.',
          icon: 'info',
          confirmButtonColor: 'var(--primary)'
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.response?.data?.error || 'Erro ao executar a query.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTableData = (data: any[]) => {
    return data.map(item => ({
      ...item,
      tipo: item.tipo.tipo // Extraindo apenas o nome do tipo
    }));
  };

  const handleDelete = async (report: any) => {
    try {
      await api.delete(`/relatorios/${report.id}`);
      await reloadReports();
      Swal.fire({
        title: 'Sucesso!',
        text: 'Relatório excluído com sucesso!',
        icon: 'success',
        confirmButtonColor: 'var(--primary)'
      });
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.response?.data?.error || 'Erro ao excluir o relatório.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    }
  };

  const handleDownloadPDF = async (report: any) => {
    try {
      setIsLoading(true);
      const response = await api.post('/query/execute', {
        query: report.query
      });

      if (response.data && response.data.length > 0) {
        const doc = new jsPDF();
        
        // Configuração do cabeçalho do PDF
        doc.setFontSize(16);
        doc.text(report.nome, 14, 15);
        doc.setFontSize(10);
        doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 14, 22);
        
        // Extrair colunas do primeiro resultado
        const columns = Object.keys(response.data[0]);
        const headers = columns.map(col => 
          col.charAt(0).toUpperCase() + col.slice(1).replace(/_/g, ' ')
        );
        
        // Preparar dados para a tabela
        const data = response.data.map((row: any) => 
          columns.map(col => row[col]?.toString() || '')
        );
        
        // Configuração e geração da tabela
        autoTable(doc, {
          head: [headers],
          body: data,
          startY: 30,
          styles: {
            fontSize: 8,
            cellPadding: 2,
          },
          headStyles: {
            fillColor: [53, 119, 241],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
        });
        
        // Salvar o PDF
        doc.save(`${report.nome.toLowerCase().replace(/\s+/g, '_')}.pdf`);
        
        Swal.fire({
          title: 'Sucesso!',
          text: 'PDF gerado com sucesso!',
          icon: 'success',
          confirmButtonColor: 'var(--primary)'
        });
      } else {
        Swal.fire({
          title: 'Sem resultados',
          text: 'A query não retornou nenhum resultado para gerar o PDF.',
          icon: 'info',
          confirmButtonColor: 'var(--primary)'
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.response?.data?.error || 'Erro ao gerar o PDF.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: 'delete' | 'download', report: any) => {
    const config = {
      delete: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir o relatório "${report.nome}"?`,
        onConfirm: () => handleDelete(report),
        confirmButtonText: 'Excluir',
        confirmButtonVariant: 'danger'
      },
      download: {
        title: 'Confirmar Download',
        message: `Deseja baixar o relatório "${report.nome}" em PDF?`,
        onConfirm: () => handleDownloadPDF(report),
        confirmButtonText: 'Baixar',
        confirmButtonVariant: 'primary'
      }
    };

    setModalConfig({
      isOpen: true,
      ...config[action]
    });
  };

  const closeModal = () => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  };

  const renderContent = () => {
    if (showResults) {
      return (
        <div className="results-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="results-title">Resultados da Query</h3>
            <div className="d-flex gap-2">
              <Button
                variant="outline-custom"
                onClick={handleExportPDF}
                icon={<FiDownload />}
              >
                Exportar para PDF
              </Button>
              <Button
                variant="outline-custom"
                onClick={() => setShowResults(false)}
              >
                Voltar para Relatórios
              </Button>
            </div>
          </div>
          {queryResults.length > 0 ? (
            <Table
              data={queryResults}
              columns={resultColumns}
            />
          ) : (
            <div className="empty-state">
              <FiAlertCircle className="empty-state-icon" />
              <span className="empty-state-text">Nenhum resultado encontrado</span>
            </div>
          )}
        </div>
      );
    }

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
          onRowClick={handleRowClick}
          actions={[
            {
              icon: <FiPrinter />,
              onClick: (row) => handleActionClick('download', row),
              title: 'Baixar PDF'
            },
            {
              icon: <FiTrash />,
              onClick: (row) => handleActionClick('delete', row),
              title: 'Excluir'
            }
          ]}
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

        {!showResults && (
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
        )}

        {renderContent()}

        <ConfirmationModal
          isOpen={modalConfig.isOpen}
          onClose={closeModal}
          onConfirm={() => {
            modalConfig.onConfirm();
            closeModal();
          }}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmButtonText={modalConfig.confirmButtonText}
          confirmButtonVariant={modalConfig.confirmButtonVariant}
        />
      </div>
    </div>
  );
}; 