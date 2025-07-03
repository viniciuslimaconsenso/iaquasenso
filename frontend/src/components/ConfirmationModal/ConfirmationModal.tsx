import React from 'react';
import './ConfirmationModal.css';
import { Button } from '../Button/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  confirmButtonVariant = 'primary'
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <Button
            variant="outline-secondary"
            onClick={onClose}
          >
            {cancelButtonText}
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={onConfirm}
          >
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}; 