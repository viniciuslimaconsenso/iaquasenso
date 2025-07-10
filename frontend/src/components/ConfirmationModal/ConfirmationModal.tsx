import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmButtonText?: string;
  confirmButtonVariant?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmButtonText = 'Confirmar',
  confirmButtonVariant = 'primary'
}) => {
  if (!isOpen) return null;

  const getButtonStyle = () => {
    switch (confirmButtonVariant) {
      case 'danger':
        return { backgroundColor: '#dc3545', color: 'white' };
      case 'primary':
      default:
        return { backgroundColor: 'var(--primary)', color: 'white' };
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button 
            className="btn btn-outline-custom d-flex align-items-center justify-content-center"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="btn d-flex align-items-center justify-content-center"
            style={getButtonStyle()}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}; 