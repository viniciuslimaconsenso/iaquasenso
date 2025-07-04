import { Model, DataTypes } from 'sequelize';

class Parametro extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tamanho: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: 'parametros',
    });
  }

  static associate(models) {
    this.belongsTo(models.Relatorio, { foreignKey: 'relatorio_id', as: 'relatorio' });
  }
}

export default Parametro; 