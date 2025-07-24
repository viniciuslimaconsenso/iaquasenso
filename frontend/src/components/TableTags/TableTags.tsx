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
    defaultQuery: `SELECT 
      v.id as venda_id, 
      c.nome as cliente,
      TO_CHAR(v.data_venda, 'DD/MM/YYYY') as data_venda,
      p.nome as produto,
      vi.quantidade,
      vi.preco_unitario,
      (vi.quantidade * vi.preco_unitario) as valor_item,
      COALESCE(SUM(vi.quantidade * vi.preco_unitario) OVER (PARTITION BY v.id), 0) as valor_total_venda
    FROM vendas v 
    LEFT JOIN venda_itens vi ON vi.venda_id = v.id 
    LEFT JOIN clientes c ON c.id = v.cliente_id
    LEFT JOIN produtos p ON p.id = vi.produto_id
    ORDER BY v.id DESC, p.nome`
  },
  {
    name: 'venda_itens',
    label: 'Itens de Venda',
    defaultQuery: 'SELECT id, venda_id, produto_id, quantidade, preco_unitario, (quantidade * preco_unitario) as valor_total FROM venda_itens'
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