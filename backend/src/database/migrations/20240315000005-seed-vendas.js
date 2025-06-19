'use strict';

const migration = {
  up: async (queryInterface, Sequelize) => {
    // Inserir Clientes
    const clientes = await queryInterface.bulkInsert('clientes', [
      {
        nome: 'Maria Silva',
        email: 'maria.silva@email.com',
        telefone: '(11) 98765-4321',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: 'João Santos',
        email: 'joao.santos@email.com',
        telefone: '(11) 91234-5678',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: 'Ana Oliveira',
        email: 'ana.oliveira@email.com',
        telefone: '(21) 98888-7777',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: 'Carlos Ferreira',
        email: 'carlos.ferreira@email.com',
        telefone: '(31) 97777-6666',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: 'Patricia Lima',
        email: 'patricia.lima@email.com',
        telefone: '(41) 96666-5555',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { returning: true });

    // Inserir Produtos
    const produtos = await queryInterface.bulkInsert('produtos', [
      {
        nome: 'Sensor de Temperatura Industrial',
        preco: 299.99,
        estoque: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: 'Medidor de pH Digital',
        preco: 459.99,
        estoque: 30,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: 'Kit Análise de Água Completo',
        preco: 899.99,
        estoque: 20,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: 'Sensor de Condutividade',
        preco: 349.99,
        estoque: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        nome: 'Filtro Industrial 100L',
        preco: 1299.99,
        estoque: 15,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { returning: true });

    // Inserir Vendas
    const dataBase = new Date();
    const vendas = await queryInterface.bulkInsert('vendas', [
      {
        cliente_id: 1,
        data_venda: new Date(dataBase.setDate(dataBase.getDate() - 4)),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cliente_id: 2,
        data_venda: new Date(dataBase.setDate(dataBase.getDate() + 1)),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cliente_id: 3,
        data_venda: new Date(dataBase.setDate(dataBase.getDate() + 1)),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cliente_id: 4,
        data_venda: new Date(dataBase.setDate(dataBase.getDate() + 1)),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        cliente_id: 5,
        data_venda: new Date(dataBase.setDate(dataBase.getDate() + 1)),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], { returning: true });

    // Inserir Itens das Vendas
    await queryInterface.bulkInsert('venda_itens', [
      // Venda 1: Maria Silva
      {
        venda_id: 1,
        produto_id: 1,
        quantidade: 2,
        preco_unitario: 299.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        venda_id: 1,
        produto_id: 2,
        quantidade: 1,
        preco_unitario: 459.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Venda 2: João Santos
      {
        venda_id: 2,
        produto_id: 3,
        quantidade: 1,
        preco_unitario: 899.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        venda_id: 2,
        produto_id: 5,
        quantidade: 1,
        preco_unitario: 1299.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Venda 3: Ana Oliveira
      {
        venda_id: 3,
        produto_id: 1,
        quantidade: 3,
        preco_unitario: 299.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        venda_id: 3,
        produto_id: 4,
        quantidade: 2,
        preco_unitario: 349.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Venda 4: Carlos Ferreira
      {
        venda_id: 4,
        produto_id: 3,
        quantidade: 2,
        preco_unitario: 899.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      // Venda 5: Patricia Lima
      {
        venda_id: 5,
        produto_id: 2,
        quantidade: 2,
        preco_unitario: 459.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        venda_id: 5,
        produto_id: 4,
        quantidade: 1,
        preco_unitario: 349.99,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('venda_itens', null, {});
    await queryInterface.bulkDelete('vendas', null, {});
    await queryInterface.bulkDelete('produtos', null, {});
    await queryInterface.bulkDelete('clientes', null, {});
  }
};

export default migration; 