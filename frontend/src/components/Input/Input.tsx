import type { InputHTMLAttributes, ReactNode } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelExtra?: ReactNode;
  error?: string;
}

export const Input = ({ 
  label,
  labelExtra,
  error,
  className = '',
  ...props 
}: InputProps) => {
  return (
    <div className="input-container">
      <label className="form-label">
        {label}
        {labelExtra}
      </label>
      <input
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}; 