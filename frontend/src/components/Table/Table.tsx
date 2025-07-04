import React, { useState } from 'react';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import './Table.css';

interface Column {
  key: string;
  header: string;
}

interface Action {
  icon: React.ReactNode;
  onClick: (row: any) => void;
  hoverColor?: string;
  title?: string;
}

interface TableProps {
  data: any[];
  columns: Column[];
  onRowClick?: (row: any) => void;
  itemsPerPageOptions?: number[];
  actions?: Action[];
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

// Função para acessar propriedades aninhadas com segurança
const getNestedValue = (obj: any, path: string): any => {
  const value = path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
  
  // Se o valor for um objeto vazio ou undefined/null, retorna uma string vazia
  if (value === null || value === undefined || (typeof value === 'object' && Object.keys(value).length === 0)) {
    return '';
  }
  
  return value;
};

export const Table: React.FC<TableProps> = ({ 
  data, 
  columns, 
  onRowClick,
  itemsPerPageOptions = [10, 25, 50, 100],
  actions
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: columns[0].key, direction: 'desc' });

  // Função de ordenação
  const sortData = (data: any[]) => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue, 'pt-BR', { sensitivity: 'base' });
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  };

  // Handler para clique no cabeçalho
  const handleSort = (key: string) => {
    setSortConfig(currentSort => {
      if (!currentSort || currentSort.key !== key) {
        return { key, direction: 'desc' };
      }
      if (currentSort.direction === 'desc') {
        return { key, direction: 'asc' };
      }
      return { key, direction: 'desc' };
    });
  };

  // Dados ordenados
  const sortedData = sortData(data);

  // Cálculo da paginação
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    buttons.push(
      <li key="prev" className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>
      </li>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    buttons.push(
      <li key="next" className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próximo
        </button>
      </li>
    );

    return buttons;
  };

  // Renderiza o ícone de ordenação
  const renderSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return null;
    }
    return sortConfig.direction === 'asc' ? <FiArrowUp className="sort-icon active" /> : <FiArrowDown className="sort-icon active" />;
  };

  return (
    <div className="table-content">
      <div className="table-header">
        <div className="table-length-select">
          <span>Mostrar</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>entradas</span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key}
                  className="sortable-header"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="header-content">
                    <span>{column.header}</span>
                    {renderSortIcon(column.key)}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="actions-header">&nbsp;</th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr 
                key={index} 
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest('.action-button')) {
                    e.stopPropagation();
                    return;
                  }
                  onRowClick && onRowClick(row);
                }}
                className={`${onRowClick ? 'clickable-row' : ''} table-row`}
              >
                {columns.map((column) => (
                  <td key={`${index}-${column.key}`}>
                    {getNestedValue(row, column.key)}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="actions-cell">
                    <div className="actions-wrapper">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(row);
                          }}
                          title={action.title}
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <div className="records-info">
          Mostrando {startIndex + 1} a {Math.min(endIndex, sortedData.length)} de {sortedData.length} entradas
        </div>
        <nav>
          <ul className="pagination">
            {renderPaginationButtons()}
          </ul>
        </nav>
      </div>
    </div>
  );
};