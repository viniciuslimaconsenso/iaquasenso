import React from 'react';
import './TableTags.css';

interface TableInfo {
  name: string;
  label: string;
  defaultQuery: string;
}

interface TableTagsProps {
  onSelectTable: (query: string) => void;
}

const availableTables: TableInfo[] = [
  {
    name: 'clientes',
    label: 'Clientes',
    defaultQuery: 'SELECT id, nome, email, telefone FROM clientes'
  },
  {
    name: 'produtos',
    label: 'Produtos',
    defaultQuery: 'SELECT id, nome, descricao, preco, estoque FROM produtos'
  },
  {
    name: 'vendas',
    label: 'Vendas',
    defaultQuery: 'SELECT id, cliente_id, data_venda, valor_total FROM vendas'
  },
  {
    name: 'venda_itens',
    label: 'Itens de Venda',
    defaultQuery: 'SELECT id, venda_id, produto_id, quantidade, valor_unitario, valor_total FROM venda_itens'
  }
];

export const TableTags: React.FC<TableTagsProps> = ({ onSelectTable }) => {
  return (
    <div className="table-tags-container">
      <div className="table-tags-header">
        Tabelas disponíveis para consulta:
      </div>
      <div className="table-tags">
        {availableTables.map((table) => (
          <button
            key={table.name}
            className="table-tag"
            type="button"
            onClick={() => onSelectTable(table.defaultQuery)}
            title={`Clique para inserir uma query padrão para ${table.label}`}
          >
            {table.label}
          </button>
        ))}
      </div>
    </div>
  );
}; 