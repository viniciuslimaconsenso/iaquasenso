import React, { useState } from 'react';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';
import { Button } from '../Button/Button';
import './ParameterForm.css';

interface Parameter {
  nome: string;
  tipo: string;
  tamanho: string;
  label: string;
}

interface ParameterInputFormProps {
  onAddParameter: (parameter: Parameter) => void;
}

const parameterTypes = [
  { value: 'string', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'boolean', label: 'Booleano' }
];

export const ParameterInputForm: React.FC<ParameterInputFormProps> = ({ onAddParameter }) => {
  const [parameter, setParameter] = useState<Parameter>({
    nome: '',
    tipo: '',
    tamanho: '',
    label: ''
  });

  const [errors, setErrors] = useState({
    nome: '',
    tipo: '',
    tamanho: '',
    label: ''
  });

  const validateForm = () => {
    const newErrors = {
      nome: parameter.nome.trim() === '' ? 'Nome é obrigatório' : '',
      tipo: parameter.tipo === '' ? 'Tipo é obrigatório' : '',
      tamanho: parameter.tamanho.trim() === '' ? 'Tamanho é obrigatório' : '',
      label: parameter.label.trim() === '' ? 'Label é obrigatório' : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddParameter(parameter);
      setParameter({
        nome: '',
        tipo: '',
        tamanho: '',
        label: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="parameter-input-form">
      <div className="form-row">
        <Input
          label="Nome do Parâmetro"
          value={parameter.nome}
          onChange={(e) => setParameter({ ...parameter, nome: e.target.value })}
          placeholder="Ex: data_inicio"
          error={errors.nome}
        />
        <Select
          label="Tipo do Parâmetro"
          value={parameter.tipo}
          onChange={(e) => setParameter({ ...parameter, tipo: e.target.value })}
          options={parameterTypes}
          error={errors.tipo}
        />
      </div>
      <div className="form-row">
        <Input
          label="Tamanho"
          value={parameter.tamanho}
          onChange={(e) => setParameter({ ...parameter, tamanho: e.target.value })}
          placeholder="Ex: 10"
          error={errors.tamanho}
        />
        <Input
          label="Label"
          value={parameter.label}
          onChange={(e) => setParameter({ ...parameter, label: e.target.value })}
          placeholder="Ex: Data Inicial"
          error={errors.label}
        />
      </div>
      <div className="form-actions">
        <Button type="button" variant="primary" onClick={handleSubmit}>
          Adicionar Parâmetro
        </Button>
      </div>
    </form>
  );
}; 