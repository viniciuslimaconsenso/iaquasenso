import { Model, DataTypes } from 'sequelize';

class Produto extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      preco: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      estoque: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize,
      tableName: 'produtos',
    });
  }

  static associate(models) {
    this.hasMany(models.VendaItem, { foreignKey: 'produto_id', as: 'vendas_items' });
  }
}

export default Produto; 