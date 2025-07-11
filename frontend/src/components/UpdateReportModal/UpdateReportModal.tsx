import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { TextArea } from '../TextArea/TextArea';
import { Button } from '../Button/Button';
import { api } from '../../services/api';
import Swal from 'sweetalert2';
import './UpdateReportModal.css';

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
  const [errors, setErrors] = useState({
    nome: '',
    descricao: '',
    tipo: '',
    query: ''
  });

  useEffect(() => {
    if (report) {
      setNome(report.nome || '');
      setDescricao(report.descricao || '');
      setTipo(report.tipoRelatorio?.tipo || '');
      setQuery(report.query?.query || '');
    }
  }, [report]);

  const validateForm = () => {
    const newErrors = {
      nome: nome.trim() === '' ? 'Nome é obrigatório' : '',
      descricao: descricao.trim() === '' ? 'Descrição é obrigatória' : '',
      tipo: tipo === '' ? 'Tipo é obrigatório' : '',
      query: query.trim() === '' ? 'Query é obrigatória' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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
        query_id: report.queryId
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
    <Modal show={isOpen} onHide={onClose} centered className="update-report-modal">
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