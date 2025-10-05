// src/configs/db.config.js
require('dotenv').config();

module.exports = {
    development: {
        username: process.env.DB_USER || 'wms',
        password: process.env.DB_PASS || 'wms',
        database: process.env.DB_NAME || 'wms',
        host: process.env.DB_HOST || '127.0.0.1',
        dialect: 'mysql',
    },
};
