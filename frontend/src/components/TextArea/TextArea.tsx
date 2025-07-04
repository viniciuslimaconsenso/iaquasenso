import React from 'react';
import type { ReactNode } from 'react';
import './TextArea.css';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelExtra?: ReactNode;
  error?: string;
  maxLength?: number;
  showCounter?: boolean;
}

export const TextArea: React.FC<TextAreaProps> = ({ 
  label,
  labelExtra,
  error, 
  maxLength,
  showCounter = false,
  value = '',
  ...props 
}) => {
  return (
    <div className="form-group">
      <label>
        {label}
        {labelExtra}
      </label>
      <div className="textarea-wrapper">
        <textarea
          className={`form-control ${error ? 'is-invalid' : ''}`}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        {showCounter && maxLength && (
          <div className="character-counter-below">
            {String(value).length}/{maxLength}
          </div>
        )}
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}; 