import { Model, DataTypes } from 'sequelize';

class VendaItem extends Model {
  static init(sequelize) {
    super.init({
      venda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'vendas', key: 'id' },
        onDelete: 'CASCADE',
      },
      produto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'produtos', key: 'id' },
        onDelete: 'CASCADE',
      },
      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      preco_unitario: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'venda_itens',
    });
  }

  static associate(models) {
    this.belongsTo(models.Venda, { foreignKey: 'venda_id', as: 'venda' });
    this.belongsTo(models.Produto, { foreignKey: 'produto_id', as: 'produto' });
  }
}

export default VendaItem; 