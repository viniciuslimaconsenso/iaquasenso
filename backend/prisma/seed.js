import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  // Criar tipos de relatório
  const tiposRelatorio = await Promise.all([
    prisma.tipoRelatorio.create({
      data: {
        tipo: 'Gerencial',
      },
    }),
    prisma.tipoRelatorio.create({
      data: {
        tipo: 'Financeiro',
      },
    }),
    prisma.tipoRelatorio.create({
      data: {
        tipo: 'Operacional',
      },
    }),
  ]);

  // Queries para relatórios gerenciais
  const queriesGerenciais = [
    {
      nome: "Relatório de Vendas por Cliente",
      descricao: "Análise detalhada das vendas por cliente com total de compras",
      query: `
        SELECT 
          c.nome as cliente,
          COUNT(v.id) as total_vendas,
          SUM(vi.quantidade * vi.preco_unitario) as valor_total
        FROM clientes c
        LEFT JOIN vendas v ON v.cliente_id = c.id
        LEFT JOIN venda_itens vi ON vi.venda_id = v.id
        GROUP BY c.id, c.nome
        ORDER BY valor_total DESC
      `
    },
    {
      nome: "Desempenho de Produtos",
      descricao: "Análise de vendas e receita por produto",
      query: `
        SELECT 
          p.nome as produto,
          SUM(vi.quantidade) as quantidade_vendida,
          SUM(vi.quantidade * vi.preco_unitario) as receita_total,
          p.estoque as estoque_atual
        FROM produtos p
        LEFT JOIN venda_itens vi ON vi.produto_id = p.id
        GROUP BY p.id, p.nome, p.estoque
        ORDER BY quantidade_vendida DESC
      `
    },
    {
      nome: "Relatório de Vendas Mensal",
      descricao: "Total de vendas e receita por mês",
      query: `
        SELECT 
          DATE_TRUNC('month', v.data_venda) as mes,
          COUNT(DISTINCT v.id) as total_vendas,
          SUM(vi.quantidade * vi.preco_unitario) as receita_total
        FROM vendas v
        JOIN venda_itens vi ON vi.venda_id = v.id
        GROUP BY DATE_TRUNC('month', v.data_venda)
        ORDER BY mes DESC
      `
    }
  ];

  // Queries para relatórios financeiros
  const queriesFinanceiras = [
    {
      nome: "Faturamento por Período",
      descricao: "Análise do faturamento total por período",
      query: `
        SELECT 
          DATE_TRUNC('day', v.data_venda) as data,
          COUNT(DISTINCT v.id) as num_vendas,
          SUM(vi.quantidade * vi.preco_unitario) as faturamento
        FROM vendas v
        JOIN venda_itens vi ON vi.venda_id = v.id
        GROUP BY DATE_TRUNC('day', v.data_venda)
        ORDER BY data DESC
      `
    },
    {
      nome: "Ticket Médio por Cliente",
      descricao: "Valor médio de compra por cliente",
      query: `
        SELECT 
          c.nome as cliente,
          COUNT(DISTINCT v.id) as num_compras,
          ROUND(AVG(subquery.valor_venda), 2) as ticket_medio
        FROM clientes c
        LEFT JOIN vendas v ON v.cliente_id = c.id
        LEFT JOIN (
          SELECT 
            venda_id,
            SUM(quantidade * preco_unitario) as valor_venda
          FROM venda_itens
          GROUP BY venda_id
        ) subquery ON subquery.venda_id = v.id
        GROUP BY c.id, c.nome
        ORDER BY ticket_medio DESC
      `
    },
    {
      nome: "Margem de Lucro por Produto",
      descricao: "Análise da margem de lucro por produto vendido",
      query: `
        SELECT 
          p.nome as produto,
          p.preco as preco_atual,
          ROUND(AVG(vi.preco_unitario), 2) as preco_medio_vendido,
          SUM(vi.quantidade) as quantidade_vendida
        FROM produtos p
        LEFT JOIN venda_itens vi ON vi.produto_id = p.id
        GROUP BY p.id, p.nome, p.preco
        ORDER BY quantidade_vendida DESC
      `
    }
  ];

  // Queries para relatórios operacionais
  const queriesOperacionais = [
    {
      nome: "Controle de Estoque",
      descricao: "Status atual do estoque de produtos",
      query: `
        SELECT 
          p.nome as produto,
          p.estoque as quantidade_disponivel,
          COUNT(vi.id) as vezes_vendido,
          COALESCE(SUM(vi.quantidade), 0) as quantidade_vendida
        FROM produtos p
        LEFT JOIN venda_itens vi ON vi.produto_id = p.id
        GROUP BY p.id, p.nome, p.estoque
        ORDER BY p.estoque ASC
      `
    },
    {
      nome: "Frequência de Compras",
      descricao: "Análise da frequência de compras por cliente",
      query: `
        SELECT 
          c.nome as cliente,
          COUNT(v.id) as total_compras,
          MIN(v.data_venda) as primeira_compra,
          MAX(v.data_venda) as ultima_compra
        FROM clientes c
        LEFT JOIN vendas v ON v.cliente_id = c.id
        GROUP BY c.id, c.nome
        ORDER BY total_compras DESC
      `
    },
    {
      nome: "Produtos Mais Vendidos",
      descricao: "Ranking dos produtos mais vendidos",
      query: `
        SELECT 
          p.nome as produto,
          SUM(vi.quantidade) as quantidade_vendida,
          COUNT(DISTINCT v.cliente_id) as num_clientes_distintos,
          ROUND(AVG(vi.preco_unitario), 2) as preco_medio
        FROM produtos p
        JOIN venda_itens vi ON vi.produto_id = p.id
        JOIN vendas v ON v.id = vi.venda_id
        GROUP BY p.id, p.nome
        ORDER BY quantidade_vendida DESC
        LIMIT 10
      `
    }
  ];

  // Criar relatórios com as queries
  for (const query of queriesGerenciais) {
    await prisma.relatorio.create({
      data: {
        nome: query.nome,
        descricao: query.descricao,
        tipoRelatorioId: tiposRelatorio[0].id, // Gerencial
        query: query.query,
        hasParameters: false
      },
    });
  }

  for (const query of queriesFinanceiras) {
    await prisma.relatorio.create({
      data: {
        nome: query.nome,
        descricao: query.descricao,
        tipoRelatorioId: tiposRelatorio[1].id, // Financeiro
        query: query.query,
        hasParameters: false
      },
    });
  }

  for (const query of queriesOperacionais) {
    await prisma.relatorio.create({
      data: {
        nome: query.nome,
        descricao: query.descricao,
        tipoRelatorioId: tiposRelatorio[2].id, // Operacional
        query: query.query,
        hasParameters: false
      },
    });
  }

  // Criar clientes
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nome: 'Maria Silva',
        email: 'maria.silva@email.com',
        telefone: '(11) 98765-4321',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'João Santos',
        email: 'joao.santos@email.com',
        telefone: '(11) 91234-5678',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Ana Oliveira',
        email: 'ana.oliveira@email.com',
        telefone: '(21) 98888-7777',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Carlos Ferreira',
        email: 'carlos.ferreira@email.com',
        telefone: '(31) 97777-6666',
      },
    }),
    prisma.cliente.create({
      data: {
        nome: 'Patricia Lima',
        email: 'patricia.lima@email.com',
        telefone: '(41) 96666-5555',
      },
    }),
  ]);

  // Criar produtos
  const produtos = await Promise.all([
    prisma.produto.create({
      data: {
        nome: 'Sensor de Temperatura Industrial',
        preco: 299.99,
        estoque: 50,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Medidor de pH Digital',
        preco: 459.99,
        estoque: 30,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Kit Análise de Água Completo',
        preco: 899.99,
        estoque: 20,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Sensor de Condutividade',
        preco: 349.99,
        estoque: 40,
      },
    }),
    prisma.produto.create({
      data: {
        nome: 'Filtro Industrial 100L',
        preco: 1299.99,
        estoque: 15,
      },
    }),
  ]);

  // Criar vendas e itens de venda
  const dataBase = new Date();
  
  // Venda 1: Maria Silva
  const venda1 = await prisma.venda.create({
    data: {
      clienteId: clientes[0].id,
      dataVenda: new Date(dataBase.setDate(dataBase.getDate() - 4)),
      vendaItens: {
        create: [
          {
            produtoId: produtos[0].id,
            quantidade: 2,
            precoUnitario: 299.99,
          },
          {
            produtoId: produtos[1].id,
            quantidade: 1,
            precoUnitario: 459.99,
          },
        ],
      },
    },
  });

  // Venda 2: João Santos
  const venda2 = await prisma.venda.create({
    data: {
      clienteId: clientes[1].id,
      dataVenda: new Date(dataBase.setDate(dataBase.getDate() + 1)),
      vendaItens: {
        create: [
          {
            produtoId: produtos[2].id,
            quantidade: 1,
            precoUnitario: 899.99,
          },
          {
            produtoId: produtos[4].id,
            quantidade: 1,
            precoUnitario: 1299.99,
          },
        ],
      },
    },
  });

  // Venda 3: Ana Oliveira
  const venda3 = await prisma.venda.create({
    data: {
      clienteId: clientes[2].id,
      dataVenda: new Date(dataBase.setDate(dataBase.getDate() + 1)),
      vendaItens: {
        create: [
          {
            produtoId: produtos[0].id,
            quantidade: 3,
            precoUnitario: 299.99,
          },
          {
            produtoId: produtos[3].id,
            quantidade: 2,
            precoUnitario: 349.99,
          },
        ],
      },
    },
  });

  // Venda 4: Carlos Ferreira
  const venda4 = await prisma.venda.create({
    data: {
      clienteId: clientes[3].id,
      dataVenda: new Date(dataBase.setDate(dataBase.getDate() + 1)),
      vendaItens: {
        create: [
          {
            produtoId: produtos[2].id,
            quantidade: 2,
            precoUnitario: 899.99,
          },
        ],
      },
    },
  });

  // Venda 5: Patricia Lima
  const venda5 = await prisma.venda.create({
    data: {
      clienteId: clientes[4].id,
      dataVenda: new Date(dataBase.setDate(dataBase.getDate() + 1)),
      vendaItens: {
        create: [
          {
            produtoId: produtos[1].id,
            quantidade: 2,
            precoUnitario: 459.99,
          },
          {
            produtoId: produtos[3].id,
            quantidade: 1,
            precoUnitario: 349.99,
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 