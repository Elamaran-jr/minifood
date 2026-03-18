const mysql = require('mysql2/promise');

async function fix() {
  try {
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '1234',
      database: 'minifood'
    });
    console.log('Connected to MySQL!');

    // Check if table exists and fix the enum
    const [rows] = await connection.query("SHOW TABLES LIKE 'Order'");
    if (rows.length > 0) {
      console.log('Fixing "Order" table status column...');
      await connection.query("ALTER TABLE `Order` MODIFY COLUMN `status` ENUM('PLACED', 'CONFIRMED', 'PROCESSING', 'DELIVERED', 'CANCELLED') DEFAULT 'PLACED'");
      console.log('Status column fixed!');
    } else {
      console.log('Table "Order" not found. Running full schema create...');
      // If table doesn't exist, we might need a more comprehensive fix, 
      // but let's assume it exists given the error from Prisma.
    }

    await connection.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

fix();
