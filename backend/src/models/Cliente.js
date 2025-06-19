import { Model, DataTypes } from 'sequelize';

class Cliente extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      telefone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'clientes',
    });
  }

  static associate(models) {
    this.hasMany(models.Venda, { foreignKey: 'cliente_id', as: 'vendas' });
  }
}

export default Cliente; 