import Sequelize from 'sequelize';
import dbConfig from '../config/database.js';
import Relatorio from '../models/Relatorio.js';
import TipoRelatorio from '../models/TipoRelatorio.js';

const connection = new Sequelize(dbConfig);

Relatorio.init(connection);
TipoRelatorio.init(connection);

Relatorio.associate(connection.models);
TipoRelatorio.associate(connection.models);

export default connection; 