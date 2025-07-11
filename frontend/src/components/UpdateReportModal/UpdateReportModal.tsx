import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { TextArea } from '../TextArea/TextArea';
import { Button } from '../Button/Button';
import { api } from '../../services/api';
import Swal from 'sweetalert2';
import './UpdateReportModal.css';
import { ParametersTable } from '../ParametersTable/ParametersTable';
import { ParameterInputForm } from '../ParameterForm/ParameterInputForm';

interface UpdateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: any;
  onSuccess: () => void;
}

const reportTypes = [
  { value: 'Gerencial', label: 'Gerencial' },
  { value: 'Financeiro', label: 'Financeiro' },
  { value: 'Operacional', label: 'Operacional' },
];

export const UpdateReportModal: React.FC<UpdateReportModalProps> = ({
  isOpen,
  onClose,
  report,
  onSuccess
}) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [tipo, setTipo] = useState('');
  const [query, setQuery] = useState('');
  const [hasParameters, setHasParameters] = useState(false);
  const [parameters, setParameters] = useState<any[]>([]);
  const [errors, setErrors] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    query: '',
    parameters: ''
  });

  useEffect(() => {
    if (report) {
      setNome(report.nome || '');
      setDescricao(report.descricao || '');
      setTipo(report.tipoRelatorio?.tipo || '');
      setQuery(report.query?.query || '');
      setHasParameters(report.hasParameters || false);
      setParameters(report.parametros || []);
    }
  }, [report]);

  const validateParameters = () => {
    // Verificar se há parâmetros duplicados
    const parameterNames = parameters.map(p => p.nome.toLowerCase());
    const hasDuplicates = parameterNames.length !== new Set(parameterNames).size;
    if (hasDuplicates) {
      setErrors(prev => ({ ...prev, parameters: 'Existem parâmetros com nomes duplicados' }));
      return false;
    }

    // Verificar se os parâmetros na query existem na tabela
    const queryParams = (query.match(/:[a-zA-Z_][a-zA-Z0-9_]*/g) || [])
      .map(param => param.substring(1).toLowerCase());
    
    const tableParams = parameters.map(p => p.nome.toLowerCase());
    
    // Verificar parâmetros na query que não estão na tabela
    const missingInTable = queryParams.filter(param => !tableParams.includes(param));
    if (missingInTable.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        parameters: `Parâmetros na query não encontrados na tabela: ${missingInTable.join(', ')}` 
      }));
      return false;
    }

    // Verificar parâmetros na tabela que não estão na query
    const missingInQuery = tableParams.filter(param => !queryParams.includes(param));
    if (missingInQuery.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        parameters: `Parâmetros na tabela não utilizados na query: ${missingInQuery.join(', ')}` 
      }));
      return false;
    }

    // Verificar se marcou não tem parâmetros mas existem na query
    if (!hasParameters && queryParams.length > 0) {
      setErrors(prev => ({ 
        ...prev, 
        parameters: 'Existem parâmetros na query mas "Tem parâmetros?" está marcado como Não' 
      }));
      return false;
    }

    setErrors(prev => ({ ...prev, parameters: '' }));
    return true;
  };

  const validateForm = () => {
    const newErrors = {
      nome: nome.trim() === '' ? 'Nome é obrigatório' : '',
      descricao: descricao.trim() === '' ? 'Descrição é obrigatória' : '',
      tipo: tipo === '' ? 'Tipo é obrigatório' : '',
      query: query.trim() === '' ? 'Query é obrigatória' : '',
      parameters: ''
    };

    setErrors(newErrors);

    // Se tem erros básicos, retorna false
    if (Object.values(newErrors).some(error => error !== '')) {
      return false;
    }

    // Validar parâmetros se necessário
    if (hasParameters || query.includes(':')) {
      return validateParameters();
    }

    return true;
  };

  const handleAddParameter = async (parameter: any) => {
    try {
      // Verificar se já existe um parâmetro com o mesmo nome
      const paramExists = parameters.some(
        p => p.nome.toLowerCase() === parameter.nome.toLowerCase()
      );

      if (paramExists) {
        Swal.fire({
          title: 'Erro',
          text: 'Já existe um parâmetro com este nome.',
          icon: 'error',
          confirmButtonColor: 'var(--primary)'
        });
        return;
      }

      const response = await api.post(`/relatorios/${report.id}/parametros`, parameter);
      setParameters([...parameters, response.data]);
      setHasParameters(true);

      // Limpar erro de parâmetros ao adicionar um novo
      setErrors(prev => ({ ...prev, parameters: '' }));
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.response?.data?.error || 'Erro ao adicionar parâmetro.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    }
  };

  const handleDeleteParameter = async (index: number) => {
    try {
      const parameter = parameters[index];
      await api.delete(`/relatorios/${report.id}/parametros/${parameter.id}`);
      const updatedParameters = parameters.filter((_, i) => i !== index);
      setParameters(updatedParameters);
      setHasParameters(updatedParameters.length > 0);

      // Limpar erro de parâmetros ao remover um
      setErrors(prev => ({ ...prev, parameters: '' }));
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.response?.data?.error || 'Erro ao excluir parâmetro.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Se houver erro de parâmetros, mostrar alerta
      if (errors.parameters) {
        Swal.fire({
          title: 'Erro de Validação',
          text: errors.parameters,
          icon: 'error',
          confirmButtonColor: 'var(--primary)'
        });
      }
      return;
    }

    try {
      // Primeiro, atualizar a query
      if (report.queryId) {
        await api.put(`/queries/${report.queryId}`, {
          query: query
        });
      } else {
        const queryResponse = await api.post('/queries', {
          query: query
        });
        report.queryId = queryResponse.data.id;
      }

      // Depois, atualizar o relatório
      await api.put(`/relatorios/${report.id}`, {
        nome,
        descricao,
        tipo_relatorio_id: report.tipoRelatorioId,
        query_id: report.queryId,
        hasParameters
      });

      Swal.fire({
        title: 'Sucesso!',
        text: 'Relatório atualizado com sucesso!',
        icon: 'success',
        confirmButtonColor: 'var(--primary)'
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      Swal.fire({
        title: 'Erro',
        text: error.response?.data?.error || 'Erro ao atualizar o relatório.',
        icon: 'error',
        confirmButtonColor: 'var(--primary)'
      });
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered className="update-report-modal" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Atualizar Relatório</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="update-form">
          <Input
            label="Nome do relatório"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do relatório"
            error={errors.nome}
          />
          <TextArea
            label="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Digite a descrição do relatório"
            error={errors.descricao}
          />
          <Select
            label="Tipo do relatório"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={reportTypes}
            error={errors.tipo}
          />
          <TextArea
            label="Query SQL"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Digite a query SQL"
            error={errors.query}
            style={{ height: '200px' }}
          />
          
          <div className="parameters-section">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Parâmetros</h4>
              <div className="radio-group">
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="hasParametersYes"
                    name="hasParameters"
                    checked={hasParameters}
                    onChange={() => setHasParameters(true)}
                  />
                  <label className="form-check-label" htmlFor="hasParametersYes">
                    Sim
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="form-check-input"
                    id="hasParametersNo"
                    name="hasParameters"
                    checked={!hasParameters}
                    onChange={() => setHasParameters(false)}
                  />
                  <label className="form-check-label" htmlFor="hasParametersNo">
                    Não
                  </label>
                </div>
              </div>
            </div>

            {errors.parameters && (
              <div className="alert alert-danger">{errors.parameters}</div>
            )}

            {hasParameters && (
              <>
                <ParameterInputForm onAddParameter={handleAddParameter} />
                <ParametersTable
                  parameters={parameters}
                  onDeleteParameter={handleDeleteParameter}
                />
              </>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button variant="outline-custom" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Atualizar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}; 