import { Model, DataTypes } from 'sequelize';

class TipoRelatorio extends Model {
  static init(sequelize) {
    super.init({
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    }, {
      sequelize,
      tableName: 'tipos_relatorio',
    });
  }

  static associate(models) {
    this.hasOne(models.Relatorio, { foreignKey: 'tipo_relatorio_id', as: 'relatorio' });
  }
}

export default TipoRelatorio; 