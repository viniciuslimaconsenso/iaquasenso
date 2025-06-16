import { Model, DataTypes } from 'sequelize';

class Relatorio extends Model {
  static init(sequelize) {
    super.init({
      nome: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: 'relatorios',
    });
  }

  static associate(models) {
    this.belongsTo(models.TipoRelatorio, { foreignKey: 'tipo_relatorio_id', as: 'tipo' });
  }
}

export default Relatorio; 