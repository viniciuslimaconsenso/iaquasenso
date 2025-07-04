import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { TextArea } from '../TextArea/TextArea';
import { Button } from '../Button/Button';
import { ParameterForm } from '../ParameterForm/ParameterForm';
import { ParametersTable } from '../ParametersTable/ParametersTable';
import { api } from '../../services/api';
import Swal from 'sweetalert2';
import './DuplicateReportModal.css';

interface Parameter {
  nome: string;
  tipo: string;
  tamanho: string;
  label: string;
}

interface TipoRelatorio {
  id: number;
  tipo: string;
}

interface Report {
  id: number;
  nome: string;
  descricao: string;
  query: string;
  tipo_relatorio_id: number;
  has_parameters: boolean;
  parameters: Parameter[];
}

interface DuplicateReportModalProps {
  show: boolean;
  onHide: () => void;
  report: Report | null;
  onSuccess: () => void;
}

const PROHIBITED_WORDS = [
  'insert', 'update', 'delete', 'drop', 'truncate', 'alter',
  'create', 'replace', 'exec', 'execute', 'relatorios',
  'tipos_relatorio', ';', '--', '/*', '*/'
];

export const DuplicateReportModal: React.FC<DuplicateReportModalProps> = ({
  show,
  onHide,
  report,
  onSuccess
}) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [query, setQuery] = useState('');
  const [tipoRelatorioId, setTipoRelatorioId] = useState('');
  const [tiposRelatorio, setTiposRelatorio] = useState<TipoRelatorio[]>([]);
  const [hasParameters, setHasParameters] = useState(false);
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [errors, setErrors] = useState({
    nome: '',
    descricao: '',
    query: '',
    tipoRelatorioId: ''
  });

  // Carrega os tipos de relatório
  useEffect(() => {
    const fetchTiposRelatorio = async () => {
      try {
        const response = await api.get('/tipos-relatorio');
        setTiposRelatorio(response.data);
      } catch (error) {
        console.error('Erro ao buscar tipos de relatório:', error);
      }
    };

    if (show) {
      fetchTiposRelatorio();
    }
  }, [show]);

  // Preenche o formulário com os dados do relatório selecionado
  useEffect(() => {
    if (report && show) {
      setNome(report.nome);
      setDescricao(report.descricao || '');
      setQuery(report.query || '');
      setTipoRelatorioId(report.tipo_relatorio_id?.toString() || '');
      setHasParameters(report.has_parameters || false);
      setParameters(report.parameters || []);
    }
  }, [report, show]);

  // Limpa o formulário ao fechar o modal
  useEffect(() => {
    if (!show) {
      setNome('');
      setDescricao('');
      setQuery('');
      setTipoRelatorioId('');
      setHasParameters(false);
      setParameters([]);
      setErrors({
        nome: '',
        descricao: '',
        query: '',
        tipoRelatorioId: ''
      });
    }
  }, [show]);

  const checkProhibitedWords = (value: string) => {
    const lowerValue = value.toLowerCase();
    return PROHIBITED_WORDS.some(word => lowerValue.includes(word.toLowerCase()));
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (checkProhibitedWords(value)) {
      setErrors(prev => ({ ...prev, query: 'Comando não autorizado' }));
    } else {
      setErrors(prev => ({ ...prev, query: '' }));
    }
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNome(value);
    if (value.trim() === '') {
      setErrors(prev => ({ ...prev, nome: 'Nome é obrigatório' }));
    } else {
      setErrors(prev => ({ ...prev, nome: '' }));
    }
  };

  const handleDescricaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setDescricao(value);
    if (value.trim() === '') {
      setErrors(prev => ({ ...prev, descricao: 'Descrição é obrigatória' }));
    } else {
      setErrors(prev => ({ ...prev, descricao: '' }));
    }
  };

  const handleTipoRelatorioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTipoRelatorioId(value);
    if (value === '') {
      setErrors(prev => ({ ...prev, tipoRelatorioId: 'Tipo de relatório é obrigatório' }));
    } else {
      setErrors(prev => ({ ...prev, tipoRelatorioId: '' }));
    }
  };

  const handleAddParameter = (parameter: Parameter) => {
    setParameters([...parameters, parameter]);
  };

  const handleDeleteParameter = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {
      nome: nome.trim() === '' ? 'Nome é obrigatório' : '',
      descricao: descricao.trim() === '' ? 'Descrição é obrigatória' : '',
      query: query.trim() === '' ? 'Query é obrigatória' : checkProhibitedWords(query) ? 'Comando não autorizado' : '',
      tipoRelatorioId: tipoRelatorioId === '' ? 'Tipo de relatório é obrigatório' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !report) {
      return;
    }

    try {
      await api.put(`/relatorios/${report.id}`, {
        nome,
        descricao,
        query,
        tipo_relatorio_id: Number(tipoRelatorioId),
        has_parameters: hasParameters,
        parameters: hasParameters ? parameters : []
      });

      Swal.fire({
        title: 'Relatório atualizado com sucesso!',
        icon: 'success',
        confirmButtonColor: 'var(--primary)'
      });

      onSuccess();
      onHide();
    } catch (error) {
      console.error('Erro ao atualizar relatório:', error);
      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao atualizar o relatório.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered dialogClassName="wide-modal">
      <Modal.Header closeButton>
        <Modal.Title>Atualizar Relatório</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="input-row">
            <div className="input-group">
              <Input
                label="Nome"
                labelExtra={<span className="required-asterisk">*</span>}
                value={nome}
                onChange={handleNomeChange}
                placeholder="Digite o nome do relatório"
                error={errors.nome}
              />
            </div>
            <div className="input-group">
              <Select
                label="Tipo do Relatório"
                labelExtra={<span className="required-asterisk">*</span>}
                value={tipoRelatorioId}
                onChange={handleTipoRelatorioChange}
                options={tiposRelatorio.map(tipo => ({
                  value: tipo.id.toString(),
                  label: tipo.tipo
                }))}
                error={errors.tipoRelatorioId}
              />
            </div>
          </div>

          <TextArea
            label="Query"
            labelExtra={<span className="required-asterisk">*</span>}
            value={query}
            onChange={handleQueryChange}
            placeholder="Digite a query SQL do relatório"
            error={errors.query}
            maxLength={2000}
            showCounter
          />

          <div className="available-tables">
            <div className="available-tables-title">Tabelas disponíveis para consulta</div>
            <div className="table-tags">
              <span className="table-tag">clientes</span>
              <span className="table-tag">produtos</span>
              <span className="table-tag">vendas</span>
              <span className="table-tag">venda_itens</span>
            </div>
          </div>

          <TextArea
            label="Descrição"
            labelExtra={<span className="required-asterisk">*</span>}
            value={descricao}
            onChange={handleDescricaoChange}
            placeholder="Digite a descrição do relatório"
            error={errors.descricao}
            maxLength={400}
            showCounter
            style={{ minHeight: '80px' }}
          />

          <div className="parameters-section">
            <div className="parameters-header">
              <label className="parameters-label">
                A query tem parâmetros?
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="hasParameters"
                      value="yes"
                      checked={hasParameters}
                      onChange={() => setHasParameters(true)}
                    />
                    Sim
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="hasParameters"
                      value="no"
                      checked={!hasParameters}
                      onChange={() => setHasParameters(false)}
                    />
                    Não
                  </label>
                </div>
              </label>
            </div>

            {hasParameters && (
              <>
                <ParameterForm onAddParameter={handleAddParameter} />
                <ParametersTable
                  parameters={parameters}
                  onDeleteParameter={handleDeleteParameter}
                />
              </>
            )}
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-custom" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Atualizar Relatório
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 