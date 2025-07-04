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
      query: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      has_parameters: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      sequelize,
      tableName: 'relatorios',
    });
  }

  static associate(models) {
    this.belongsTo(models.TipoRelatorio, { foreignKey: 'tipo_relatorio_id', as: 'tipo' });
    this.hasMany(models.Parametro, { foreignKey: 'relatorio_id', as: 'parametros' });
  }
}

export default Relatorio; 