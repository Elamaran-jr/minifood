const mysql = require('mysql2/promise');

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '1234',
    });
    console.log('Connected to MySQL!');
    await connection.query('CREATE DATABASE IF NOT EXISTS minifood');
    console.log('Database "minifood" ensured.');
    await connection.end();
  } catch (err) {
    console.error('MySQL Connection Error:', err.message);
    process.exit(1);
  }
}

test();
