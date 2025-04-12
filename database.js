const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Your MySQL username
    password: '12345678',  // Your MySQL password
    database: 'voting_system'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

module.exports = db;
