// import { text } from 'express';
import mysql from 'mysql2';

// const db = mysql.createConnection({
    // host: 'localhost',
    // port: 3307,
    // user: 'root',
    // password: 'root',
    // database: 'quiz_test',
// });

const db = mysql.createPool({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'quiz_test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    })

// db.connect((err) => {
//     if (err) {
//         console.error("MySQL connection error:", err);
//         return;
//     }
//     console.log("MySQL connected!");
// });

export default db;
