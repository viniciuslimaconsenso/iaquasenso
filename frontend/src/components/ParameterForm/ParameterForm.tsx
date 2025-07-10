import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';
import './ParameterForm.css';

interface Parameter {
  nome: string;
  tipo: string;
  valor: string;
}

interface ParameterFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (parameters: Record<string, any>) => void;
  parameters: Parameter[];
}

export const ParameterForm: React.FC<ParameterFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parameters
}) => {
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    parameters.forEach(param => {
      if (!parameterValues[param.nome] || parameterValues[param.nome].trim() === '') {
        newErrors[param.nome] = 'Este campo é obrigatório';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(parameterValues);
    }
  };

  const handleInputChange = (paramName: string, value: string) => {
    setParameterValues(prev => ({
      ...prev,
      [paramName]: value
    }));

    // Limpa o erro quando o usuário começa a digitar
    if (errors[paramName]) {
      setErrors(prev => ({
        ...prev,
        [paramName]: ''
      }));
    }
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered className="parameter-form-modal">
      <Modal.Header closeButton>
        <Modal.Title>Preencha os parâmetros</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="parameter-form">
          {parameters.map((param, index) => (
            <div key={index} className="parameter-input">
              <Input
                label={param.nome}
                value={parameterValues[param.nome] || ''}
                onChange={(e) => handleInputChange(param.nome, e.target.value)}
                placeholder={`Digite o valor para ${param.nome}`}
                error={errors[param.nome]}
                type={param.tipo === 'number' ? 'number' : 'text'}
              />
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button variant="outline-custom" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Executar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}; 