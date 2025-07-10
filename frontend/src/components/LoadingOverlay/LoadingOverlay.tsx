import React from 'react';
import { useLoading } from '../../contexts/LoadingContext';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  isLoading?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading: propIsLoading }) => {
  const { isLoading: contextIsLoading } = useLoading();
  const shouldShow = propIsLoading ?? contextIsLoading;

  if (!shouldShow) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );
}; 