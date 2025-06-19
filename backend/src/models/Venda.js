import { Model, DataTypes } from 'sequelize';

class Venda extends Model {
  static init(sequelize) {
    super.init({
      cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'id' },
        onDelete: 'CASCADE',
      },
      data_venda: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize,
      tableName: 'vendas',
    });
  }

  static associate(models) {
    this.belongsTo(models.Cliente, { foreignKey: 'cliente_id', as: 'cliente' });
    this.hasMany(models.VendaItem, { foreignKey: 'venda_id', as: 'itens' });
  }
}

export default Venda; 