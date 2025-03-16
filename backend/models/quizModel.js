import db from '../config/db.js';

export default function createQuizTable() {
    const sql = `CREATE TABLE IF NOT EXISTS quizzes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        question_count INT DEFAULT 0,
        completions INT DEFAULT 0
    )`;
    db.query(sql, (err) => {
        if (err) 
            console.error("Error while creating table:", err);
        else 
            console.log("Table quizzes is ready");
        }
    );

    const questionSql = `CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    text TEXT NOT NULL,
    type ENUM('text', 'single', 'multiple') NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
)`;

    db.query(questionSql, (err) => {
        if (err) 
            console.error("Error while creating table questions:", err);
        else 
            console.log("Table questions is ready");
        }
    );


    const answerSql = `CREATE TABLE IF NOT EXISTS answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    answer_text TEXT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
)`;

    db.query(answerSql, (err) => {
        if (err) 
            console.error("Error while creating table answers:", err);
        else 
            console.log("Table answers is ready");
        }
    );
};