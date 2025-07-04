import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header/Header';
import { Select } from '../components/Select/Select';
import { Table } from '../components/Table/Table';
import { Button } from '../components/Button/Button';
import { FiAlertCircle, FiDownload, FiTrash, FiPrinter, FiFile } from 'react-icons/fi';
import { FaBroom } from 'react-icons/fa';
import { useReports } from '../contexts/ReportsContext';
import { api } from '../services/api';
import type { Relatorio } from '../services/api';
import { ConfirmationModal } from '../components/ConfirmationModal/ConfirmationModal';
import { DuplicateReportModal } from '../components/DuplicateReportModal/DuplicateReportModal';
import { ExportModal } from '../components/ExportModal/ExportModal';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './styles.css';

const reportTypes = [
  { value: 'Gerencial', label: 'Gerencial' },
  { value: 'Financeiro', label: 'Financeiro' },
  { value: 'Operacional', label: 'Operacional' },
];

const columns = [
  { key: 'nome', header: 'Nome' },
  { key: 'descricao', header: 'Descrição' },
  { key: 'tipoRelatorio.tipo', header: 'Tipo do Relatório' },
];

export const Home = () => {
  const navigate = useNavigate();
  const { filteredReports, selectedType, setSelectedType, reloadReports } = useReports();
  const [showResults, setShowResults] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [resultColumns, setResultColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
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

  const handleExportCSV = () => {
    try {
      // Preparar cabeçalhos e dados
      const headers = resultColumns.map(col => col.header);
      const data = queryResults.map(row => 
        resultColumns.map(col => row[col.key]?.toString() || '')
      );
      
      // Criar conteúdo CSV
      const csvContent = [
        headers.join(','),
        ...data.map(row => row.join(','))
      ].join('\n');
      
      // Criar e baixar o arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'relatorio.csv';
      link.click();
      
      Swal.fire({
        title: 'Sucesso!',
        text: 'CSV gerado com sucesso!',
        icon: 'success',
        confirmButtonColor: 'var(--primary)'
      });
    } catch (error) {
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao gerar o CSV.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    }
  };

  const handleExportTXT = () => {
    try {
      // Preparar cabeçalhos e dados
      const headers = resultColumns.map(col => col.header);
      const data = queryResults.map(row => 
        resultColumns.map(col => row[col.key]?.toString() || '')
      );
      
      // Criar conteúdo TXT
      const txtContent = [
        headers.join('\t'),
        ...data.map(row => row.join('\t'))
      ].join('\n');
      
      // Criar e baixar o arquivo
      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'relatorio.txt';
      link.click();
      
      Swal.fire({
        title: 'Sucesso!',
        text: 'TXT gerado com sucesso!',
        icon: 'success',
        confirmButtonColor: 'var(--primary)'
      });
    } catch (error) {
      Swal.fire({
        title: 'Erro',
        text: 'Erro ao gerar o TXT.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    }
  };

  const handleExport = (format: 'pdf' | 'csv' | 'txt') => {
    switch (format) {
      case 'pdf':
        handleExportPDF();
        break;
      case 'csv':
        handleExportCSV();
        break;
      case 'txt':
        handleExportTXT();
        break;
    }
  };

  const handleRowClick = async (report: any) => {
    try {
      setIsLoading(true);
      setSelectedReport(report);
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

  const formatTableData = (data: Relatorio[]) => {
    return data.map(row => {
      const formattedRow = { ...row };
      
      // Garantir que tipoRelatorio.tipo existe
      if (!formattedRow.tipoRelatorio || !formattedRow.tipoRelatorio.tipo) {
        formattedRow.tipoRelatorio = { id: 0, tipo: '' };
      }
      
      return formattedRow;
    });
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

  const handlePrintClick = async (report: any) => {
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
        setShowExportModal(true);
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

  const handleDuplicateClick = (report: any) => {
    if (!report) {
      Swal.fire({
        title: 'Erro',
        text: 'Por favor, selecione um relatório primeiro.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
      return;
    }
    setSelectedReport(report);
    setShowDuplicateModal(true);
  };

  const renderContent = () => {
    if (showResults) {
      return (
        <div className="results-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="results-title">Resultados da Query</h3>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-custom"
                onClick={() => handleDuplicateClick(selectedReport)}
                icon={<FiFile />}
                style={{ width: '212px', height: '40px', borderRadius: '4px', border: '1px solid #404d65' }}
              >
                Atualizar relatório
              </Button>
              <Button
                variant="outline-custom"
                onClick={() => setShowExportModal(true)}
                icon={<FiDownload />}
                style={{ width: '200px' }}
              >
                Exportar Relatório
              </Button>
              <Button
                variant="outline-custom"
                onClick={() => {
                  setShowResults(false);
                  setSelectedReport(null);
                }}
                style={{ width: '200px' }}
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
              onClick: (row) => handlePrintClick(row),
              title: 'Exportar relatório'
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

        <DuplicateReportModal
          show={showDuplicateModal}
          onHide={() => setShowDuplicateModal(false)}
          report={selectedReport}
          onSuccess={() => {
            setShowDuplicateModal(false);
            reloadReports();
          }}
        />

        <ExportModal
          show={showExportModal}
          onHide={() => setShowExportModal(false)}
          onExport={handleExport}
        />
      </div>
    </div>
  );
}; 