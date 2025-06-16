import { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  label?: string;
}

export const Select = ({ 
  options, 
  label,
  className = '',
  ...props 
}: SelectProps) => {
  return (
    <div className="select-container">
      {label && <label className="form-label">{label}</label>}
      <select 
        className={`form-select ${className}`}
        {...props}
      >
        <option value="">Selecione uma opção</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 