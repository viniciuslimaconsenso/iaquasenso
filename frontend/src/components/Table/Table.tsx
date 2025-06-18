import { useEffect } from 'react';
import { useState } from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import './Table.css';

interface Column {
  key: string;
  header: string;
  subheader?: string;
}

interface TableProps {
  data: any[];
  columns: Column[];
  itemsPerPageOptions?: number[];
}

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: string;
  direction: SortDirection;
}

export const Table = ({ 
  data, 
  columns,
  itemsPerPageOptions = [10, 25, 50, 100]
}: TableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'asc' });
  const [sortedData, setSortedData] = useState([...data]);

  useEffect(() => {
    const sorted = [...data].sort((a, b) => {
      if (sortConfig.direction === null) {
        return 0;
      }

      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Tratamento especial para campos aninhados (como tipo.tipo)
      if (sortConfig.key === 'tipo') {
        aValue = a.tipo.tipo;
        bValue = b.tipo.tipo;
      }

      // Converter para minúsculas se for string
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setSortedData(sorted);
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
    let direction: SortDirection = 'desc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'desc') {
        direction = 'asc';
      } else if (sortConfig.direction === 'asc') {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="sort-icon" />;
    }
    
    if (sortConfig.direction === 'asc') {
      return <FaSortUp className="sort-icon active" />;
    }
    
    if (sortConfig.direction === 'desc') {
      return <FaSortDown className="sort-icon active" />;
    }

    return <FaSort className="sort-icon" />;
  };

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <li key="first" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(1)}>
            {'<<'}
          </button>
        </li>
      );
    }

    if (currentPage > 1) {
      buttons.push(
        <li key="prev" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
            {'<'}
          </button>
        </li>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (currentPage < totalPages) {
      buttons.push(
        <li key="next" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
            {'>'}
          </button>
        </li>
      );
    }

    if (endPage < totalPages) {
      buttons.push(
        <li key="last" className="page-item">
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            {'>>'}
          </button>
        </li>
      );
    }

    return buttons;
  };

  if (data.length === 0) {
    return (
      <div className="empty-state">
        <p className="text-muted">Sem dados para visualizar</p>
      </div>
    );
  }

  return (
    <div className="table-content">
      <div className="table-header">
        <div className="items-per-page">
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

      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th 
                key={column.key}
                onClick={() => handleSort(column.key)}
                className="sortable-header"
              >
                <div className="header-content">
                  <span>{column.header}</span>
                  {column.subheader && <span className="subheader">{column.subheader}</span>}
                  {getSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={`${index}-${column.key}`}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

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