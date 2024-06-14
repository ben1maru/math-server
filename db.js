const mysql = require('mysql2');


// Створюємо URI з використанням змінних середовища
const uri = `mysql://root:ssrLeWCAXzRGFGPOOpNMHwNTabqtuRCE@monorail.proxy.rlwy.net:43440/railway`;
const connection = mysql.createConnection(uri);

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to database');
  }
});

module.exports = connection;
