import React from 'react';
import { FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import './ParametersTable.css';

interface Parameter {
  nome: string;
  tipo: string;
  tamanho: string;
  label: string;
}

interface ParametersTableProps {
  parameters: Parameter[];
  onDeleteParameter: (index: number) => void;
}

export const ParametersTable: React.FC<ParametersTableProps> = ({
  parameters,
  onDeleteParameter,
}) => {
  const handleDelete = async (index: number) => {
    const result = await Swal.fire({
      title: 'Confirmar exclusão',
      text: 'Deseja realmente excluir este parâmetro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: 'var(--primary)',
      cancelButtonColor: '#dc3545',
      customClass: {
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
        actions: 'swal2-actions'
      }
    });

    if (result.isConfirmed) {
      onDeleteParameter(index);
      Swal.fire({
        title: 'Excluído!',
        text: 'Parâmetro excluído com sucesso.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
    }
  };

  if (parameters.length === 0) {
    return (
      <div className="parameters-empty">
        <div className="empty-icon">!</div>
        <div className="empty-text">Sem nenhum dado</div>
      </div>
    );
  }

  return (
    <div className="parameters-table-container">
      <table className="parameters-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Tamanho</th>
            <th>Label</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {parameters.map((param, index) => (
            <tr key={index}>
              <td>{param.nome}</td>
              <td>{param.tipo}</td>
              <td>{param.tamanho}</td>
              <td>{param.label}</td>
              <td>
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(index)}
                  title="Excluir parâmetro"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="table-footer">
        <span>Mostrar</span>
        <select className="entries-select" defaultValue="10">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <span>entradas</span>
      </div>
    </div>
  );
}; 