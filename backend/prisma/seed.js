import prisma from '../src/lib/prisma.js';

async function main() {
  // Limpar os dados existentes
  await prisma.vendaItem.deleteMany();
  await prisma.venda.deleteMany();
  await prisma.produto.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.parametro.deleteMany();
  await prisma.relatorio.deleteMany();
  await prisma.query.deleteMany();
  await prisma.tipoRelatorio.deleteMany();

  // Criar os tipos de relatório
  const tipoGerencial = await prisma.tipoRelatorio.create({
    data: {
      tipo: 'Gerencial',
    },
  });

  const tipoFinanceiro = await prisma.tipoRelatorio.create({
    data: {
      tipo: 'Financeiro',
    },
  });

  const tipoOperacional = await prisma.tipoRelatorio.create({
    data: {
      tipo: 'Operacional',
    },
  });

  // Criar produtos
  const produtos = await Promise.all([
    prisma.produto.create({
      data: {
        nome: 'Sensor de Nível',
        preco: 299.99,
        estoque: 50
      }
    }),
    prisma.produto.create({
      data: {
        nome: 'Medidor de pH',
        preco: 399.99,
        estoque: 30
      }
    }),
    prisma.produto.create({
      data: {
        nome: 'Bomba d\'água',
        preco: 599.99,
        estoque: 20
      }
    }),
    prisma.produto.create({
      data: {
        nome: 'Filtro Industrial',
        preco: 799.99,
        estoque: 15
      }
    }),
    prisma.produto.create({
      data: {
        nome: 'Kit Manutenção',
        preco: 149.99,
        estoque: 100
      }
    })
  ]);

  // Criar clientes
  const clientes = await Promise.all([
    prisma.cliente.create({
      data: {
        nome: 'Indústria ABC Ltda',
        email: 'contato@abc.com.br',
        telefone: '(11) 3333-4444'
      }
    }),
    prisma.cliente.create({
      data: {
        nome: 'Tratamento de Água XYZ',
        email: 'comercial@xyz.com.br',
        telefone: '(21) 4444-5555'
      }
    }),
    prisma.cliente.create({
      data: {
        nome: 'Saneamento Brasil S/A',
        email: 'compras@saneamentobrasil.com.br',
        telefone: '(31) 5555-6666'
      }
    }),
    prisma.cliente.create({
      data: {
        nome: 'Aqua Solutions ME',
        email: 'contato@aquasolutions.com.br',
        telefone: '(41) 6666-7777'
      }
    })
  ]);

  // Criar vendas e itens de venda
  const dataAtual = new Date();
  const umaSemanaAtras = new Date(dataAtual.getTime() - 7 * 24 * 60 * 60 * 1000);
  const umMesAtras = new Date(dataAtual.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Função para gerar data aleatória entre duas datas
  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  // Criar várias vendas para cada cliente
  for (const cliente of clientes) {
    // Criar 3 vendas para cada cliente
    for (let i = 0; i < 3; i++) {
      const venda = await prisma.venda.create({
        data: {
          clienteId: cliente.id,
          dataVenda: randomDate(umMesAtras, dataAtual),
          vendaItens: {
            create: [
              // 2-3 itens por venda
              {
                produtoId: produtos[Math.floor(Math.random() * produtos.length)].id,
                quantidade: Math.floor(Math.random() * 5) + 1,
                precoUnitario: produtos[Math.floor(Math.random() * produtos.length)].preco
              },
              {
                produtoId: produtos[Math.floor(Math.random() * produtos.length)].id,
                quantidade: Math.floor(Math.random() * 5) + 1,
                precoUnitario: produtos[Math.floor(Math.random() * produtos.length)].preco
              },
              {
                produtoId: produtos[Math.floor(Math.random() * produtos.length)].id,
                quantidade: Math.floor(Math.random() * 5) + 1,
                precoUnitario: produtos[Math.floor(Math.random() * produtos.length)].preco
              }
            ]
          }
        }
      });
    }
  }

  // Criar queries
  const queryVendasPorCliente = await prisma.query.create({
    data: {
      query: `SELECT 
        c.nome as cliente,
        COUNT(v.id) as total_vendas,
        SUM(vi.quantidade * vi.preco_unitario) as valor_total,
        MAX(v.data_venda) as ultima_compra
      FROM clientes c
      LEFT JOIN vendas v ON v.cliente_id = c.id
      LEFT JOIN venda_itens vi ON vi.venda_id = v.id
      GROUP BY c.id, c.nome
      ORDER BY valor_total DESC`
    }
  });

  const queryFaturamentoPorPeriodo = await prisma.query.create({
    data: {
      query: `SELECT 
        CAST(v.data_venda AS DATE) as data,
        COUNT(DISTINCT v.id) as num_vendas,
        SUM(vi.quantidade * vi.preco_unitario) as valor_total
      FROM vendas v
      JOIN venda_itens vi ON vi.venda_id = v.id
      GROUP BY CAST(v.data_venda AS DATE)
      ORDER BY data DESC`
    }
  });

  const queryControleEstoque = await prisma.query.create({
    data: {
      query: `SELECT 
        p.nome,
        p.estoque as estoque_atual,
        COALESCE(SUM(vi.quantidade), 0) as total_vendido,
        p.preco as preco_atual
      FROM produtos p
      LEFT JOIN venda_itens vi ON vi.produto_id = p.id
      GROUP BY p.id, p.nome, p.estoque, p.preco
      ORDER BY p.estoque ASC`
    }
  });

  // Criar relatórios
  await prisma.relatorio.create({
    data: {
      nome: 'Resumo de Vendas por Cliente',
      descricao: 'Análise gerencial detalhada das vendas por cliente',
      tipoRelatorioId: tipoGerencial.id,
      queryId: queryVendasPorCliente.id
    },
  });

  await prisma.relatorio.create({
    data: {
      nome: 'Faturamento por Período',
      descricao: 'Análise do faturamento por período',
      tipoRelatorioId: tipoFinanceiro.id,
      queryId: queryFaturamentoPorPeriodo.id
    },
  });

  await prisma.relatorio.create({
    data: {
      nome: 'Controle de Estoque',
      descricao: 'Relatório de controle de estoque e produtos',
      tipoRelatorioId: tipoOperacional.id,
      queryId: queryControleEstoque.id
    },
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 