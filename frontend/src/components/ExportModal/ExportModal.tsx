import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from '../Button/Button';
import { AiFillFilePdf } from 'react-icons/ai';
import { BsFiletypeCsv, BsFileText } from 'react-icons/bs';
import './ExportModal.css';

interface ExportModalProps {
  show: boolean;
  onHide: () => void;
  onExport: (format: 'pdf' | 'csv' | 'txt') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  show,
  onHide,
  onExport
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv' | 'txt'>('pdf');

  const handleExport = () => {
    onExport(selectedFormat);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered className="export-modal">
      <Modal.Header closeButton>
        <Modal.Title>Exportar dados</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="export-format-selection">
          <p className="format-question">Qual o formato que deseja exportar o relatório?</p>
          <div className="radio-options">
            <label className={`radio-label ${selectedFormat === 'pdf' ? 'selected' : ''}`}>
              <div className="radio-content">
                <input
                  type="radio"
                  name="exportFormat"
                  value="pdf"
                  checked={selectedFormat === 'pdf'}
                  onChange={(e) => setSelectedFormat(e.target.value as 'pdf')}
                />
                <AiFillFilePdf className="format-icon" />
                <span>Arquivo PDF</span>
              </div>
            </label>
            <label className={`radio-label ${selectedFormat === 'csv' ? 'selected' : ''}`}>
              <div className="radio-content">
                <input
                  type="radio"
                  name="exportFormat"
                  value="csv"
                  checked={selectedFormat === 'csv'}
                  onChange={(e) => setSelectedFormat(e.target.value as 'csv')}
                />
                <BsFiletypeCsv className="format-icon" />
                <span>Arquivo CSV</span>
              </div>
            </label>
            <label className={`radio-label ${selectedFormat === 'txt' ? 'selected' : ''}`}>
              <div className="radio-content">
                <input
                  type="radio"
                  name="exportFormat"
                  value="txt"
                  checked={selectedFormat === 'txt'}
                  onChange={(e) => setSelectedFormat(e.target.value as 'txt')}
                />
                <BsFileText className="format-icon" />
                <span>Arquivo TXT</span>
              </div>
            </label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <Button variant="outline-custom" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleExport}>
            Exportar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}; 