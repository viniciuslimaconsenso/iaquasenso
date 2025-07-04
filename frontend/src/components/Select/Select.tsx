import type { SelectHTMLAttributes, ReactNode } from 'react';
import './Select.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
  labelExtra?: ReactNode;
  error?: string;
}

export const Select = ({ 
  options, 
  label,
  labelExtra,
  error,
  className = '',
  ...props 
}: SelectProps) => {
  return (
    <div className="select-container">
      {label && (
        <label className="form-label">
          {label}
          {labelExtra}
        </label>
      )}
      <select 
        className={`form-select ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      >
        <option value="">Selecione uma opção</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}; 