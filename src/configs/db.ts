import { Sequelize } from 'sequelize';
import { configVariables } from '.';

const { db } = configVariables

export const sequelize = new Sequelize({
    dialect: 'mysql',
    host: db.host,
    port: db.port,
    username: db.username,
    password: db.password,
    database: db.database,
    logging: false,
});
