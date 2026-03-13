const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
    });
    console.log('Successfully connected to MySQL with empty password.');
    
    // Check if minifood database exists, create if not
    await connection.query('CREATE DATABASE IF NOT EXISTS minifood;');
    console.log('Database minifood ensured.');
    
    await connection.end();
  } catch (err) {
    console.error('Connection failed with empty password:', err.message);
    
    try {
      const connection2 = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
      });
      console.log('Successfully connected to MySQL with "password" password.');
      await connection2.query('CREATE DATABASE IF NOT EXISTS minifood;');
      console.log('Database minifood ensured.');
      await connection2.end();
    } catch (err2) {
      console.error('Connection failed with "password" password:', err2.message);
    }
  }
}

testConnection();
