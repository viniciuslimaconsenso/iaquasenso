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

interface ParameterFormProps {
  onAddParameter: (parameter: Parameter) => void;
}

const parameterTypes = [
  { value: 'string', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'date', label: 'Data' },
  { value: 'boolean', label: 'Booleano' },
];

export const ParameterForm: React.FC<ParameterFormProps> = ({ onAddParameter }) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [label, setLabel] = useState('');
  const [errors, setErrors] = useState({
    nome: '',
    tipo: '',
    tamanho: '',
    label: '',
  });

  const validateForm = () => {
    const newErrors = {
      nome: nome.trim() === '' ? 'Nome é obrigatório' : '',
      tipo: tipo === '' ? 'Tipo é obrigatório' : '',
      tamanho: tamanho.trim() === '' ? 'Tamanho é obrigatório' : '',
      label: label.trim() === '' ? 'Label é obrigatório' : '',
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAddParameter({
      nome,
      tipo,
      tamanho,
      label,
    });

    // Reset form
    setNome('');
    setTipo('');
    setTamanho('');
    setLabel('');
  };

  return (
    <div className="parameter-form">
      <div className="parameter-row">
        <div className="parameter-group">
          <Input
            label="Nome do parâmetro"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do parâmetro"
            error={errors.nome}
          />
        </div>
        <div className="parameter-group">
          <Select
            label="Tipo do parâmetro"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            options={parameterTypes}
            error={errors.tipo}
          />
        </div>
      </div>
      <div className="parameter-row">
        <div className="parameter-group">
          <Input
            label="Tamanho"
            value={tamanho}
            onChange={(e) => setTamanho(e.target.value)}
            placeholder="Informe o tamanho"
            error={errors.tamanho}
          />
        </div>
        <div className="parameter-group">
          <Input
            label="Nome da label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Informe o nome da label"
            error={errors.label}
          />
        </div>
      </div>
      <div className="parameter-actions">
        <Button 
          type="button" 
          variant="primary" 
          onClick={handleSubmit}
        >
          Inserir parâmetro
        </Button>
      </div>
    </div>
  );
}; 