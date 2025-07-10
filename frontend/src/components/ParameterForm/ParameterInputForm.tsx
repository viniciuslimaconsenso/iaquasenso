import React, { useState } from 'react';
import { Input } from '../Input/Input';
import './ParameterForm.css';

interface Parameter {
  nome: string;
  tipo: string;
  tamanho: string;
  label: string;
}

interface ParameterInputFormProps {
  parameters: Parameter[];
  onSubmit: (parameters: Record<string, any>) => void;
  onClose: () => void;
}

export const ParameterInputForm: React.FC<ParameterInputFormProps> = ({
  parameters,
  onSubmit,
  onClose
}) => {
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    parameters.forEach(param => {
      if (!values[param.nome] && values[param.nome] !== 0) {
        newErrors[param.nome] = `${param.label} é obrigatório`;
        isValid = false;
      }

      // Validação específica por tipo
      if (values[param.nome]) {
        if (param.tipo === 'number' && isNaN(Number(values[param.nome]))) {
          newErrors[param.nome] = `${param.label} deve ser um número`;
          isValid = false;
        } else if (param.tipo === 'date' && !values[param.nome].match(/^\d{4}-\d{2}-\d{2}$/)) {
          newErrors[param.nome] = `${param.label} deve estar no formato YYYY-MM-DD`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Converter valores de acordo com o tipo
    const processedValues = parameters.reduce((acc, param) => {
      let value = values[param.nome];

      // Converter valor de acordo com o tipo
      if (param.tipo === 'number') {
        value = Number(value);
      } else if (param.tipo === 'date') {
        // Manter o formato YYYY-MM-DD para datas
        if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          value = new Date(value).toISOString().split('T')[0];
        }
      } else if (param.tipo === 'boolean') {
        value = Boolean(value);
      }

      return {
        ...acc,
        [param.nome]: value
      };
    }, {});

    console.log('Submitting parameters:', {
      original: values,
      processed: processedValues
    });

    onSubmit(processedValues);
  };

  const handleInputChange = (paramName: string, value: string) => {
    setValues(prev => ({
      ...prev,
      [paramName]: value
    }));

    // Clear error when user types
    if (errors[paramName]) {
      setErrors(prev => ({
        ...prev,
        [paramName]: ''
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Preencha os parâmetros</h2>
        <form onSubmit={handleSubmit}>
          {parameters.map(param => (
            <div key={param.nome} className="parameter-group">
              <Input
                label={param.label}
                type={param.tipo === 'number' ? 'number' : param.tipo === 'date' ? 'date' : 'text'}
                value={values[param.nome] || ''}
                onChange={(e) => handleInputChange(param.nome, e.target.value)}
                error={errors[param.nome]}
              />
            </div>
          ))}
          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-outline-custom d-flex align-items-center justify-content-center"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary d-flex align-items-center justify-content-center"
            >
              Executar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 