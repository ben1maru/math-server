require("dotenv").config();
const mysql = require('mysql2');

// Використовуємо змінні середовища
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbDatabase = process.env.DB_DATABASE;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

// Створюємо URI з використанням змінних середовища
const uri = `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbDatabase}`;
const connection = mysql.createConnection(uri);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

module.exports = connection;
