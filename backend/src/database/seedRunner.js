const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seedDatabase = async () => {
  let connection;
  try {
    // Connect to the database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'telecom_complaints',
    });

    console.log('Connected to the database. Starting seed process...');

    // Truncate all tables in reverse dependency order
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE comments');
    await connection.query('TRUNCATE TABLE assignments');
    await connection.query('TRUNCATE TABLE complaints');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    
    console.log('Tables truncated successfully.');

    // Prepare users
    const saltRounds = 10;
    
    const adminPassword = await bcrypt.hash('Admin@123', saltRounds);
    const engineerPassword = await bcrypt.hash('Engineer@123', saltRounds);
    const customerPassword = await bcrypt.hash('Customer@123', saltRounds);

    const users = [
      ['Admin User', 'admin@telecom.com', adminPassword, 'ADMIN'],
      ['Engineer One', 'engineer1@telecom.com', engineerPassword, 'ENGINEER'],
      ['Engineer Two', 'engineer2@telecom.com', engineerPassword, 'ENGINEER'],
      ['Customer One', 'customer1@telecom.com', customerPassword, 'CUSTOMER'],
      ['Customer Two', 'customer2@telecom.com', customerPassword, 'CUSTOMER'],
    ];

    // Insert users
    const [userResult] = await connection.query(
      'INSERT INTO users (name, email, password, role) VALUES ?',
      [users]
    );

    console.log(`Successfully inserted ${userResult.affectedRows} users.`);

    // Fetch the inserted customer ID to associate complaints
    const [customerRows] = await connection.query(
      'SELECT id FROM users WHERE email = ?',
      ['customer1@telecom.com']
    );
    const customerId = customerRows[0].id;

    // Prepare complaints
    const complaints = [
      ['Internet Disconnection', 'My internet keeps disconnecting every 5 minutes since yesterday.', 'HIGH', 'OPEN', customerId],
      ['Slow Speed', 'I am getting very slow speeds compared to my subscribed plan.', 'MEDIUM', 'OPEN', customerId],
      ['Router Issue', 'The router provided is restarting automatically.', 'LOW', 'OPEN', customerId],
    ];

    // Insert complaints
    const [complaintResult] = await connection.query(
      'INSERT INTO complaints (title, description, priority, status, customer_id) VALUES ?',
      [complaints]
    );

    console.log(`Successfully inserted ${complaintResult.affectedRows} sample complaints.`);
    
    console.log('Database seeding completed successfully!');
    
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed.');
    }
    process.exit();
  }
};

seedDatabase();
