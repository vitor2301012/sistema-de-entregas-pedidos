const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Senha vazia como no phpMyAdmin
    database: 'sistema_entregas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection;