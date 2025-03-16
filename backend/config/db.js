import { text } from 'express';
import mysql from 'mysql2';

const db = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'root',
    password: 'root',
    database: 'quiz_test',
});

// const sampleQuizzes = [
//     { 
//         name: "Sample Quiz",
//         description: "This is a sample quiz for testing.",
//         question_count: 2,
//         completions: 0, 
//         questions: [
//             {
//                 text: "What is your favorite color?",
//                 type: "text",
//                 options: []
//             },
//             {
//                 text: "Which is your favorite animal?",
//                 type: "single",
//                 options: ["Cat", "Dog", "Rabbit"]
//             }
//         ]
//     },
//     { 
//         name: 'Sample Quiz 2', 
//         description: 'Test quiz 2', 
//         question_count: 1, 
//         completions: 2, 
//         questions: [
//             { text: 'What is the color of the sky?' }
//         ]
//     },
// ];


db.connect((err) => {
    if (err) {
        console.error("MySQL connection error:", err);
        return;
    }
    console.log("MySQL connected!");

    // sampleQuizzes.forEach(quiz => {
    //     const sqlInsertQuiz = 'INSERT INTO quizzes (name, description, question_count, completions) VALUES (?, ?, ?, ?)';
    //     db.query(sqlInsertQuiz, [quiz.name, quiz.description, quiz.question_count, quiz.completions], (err, result) => {
    //         if (err) {
    //             console.error('Error while adding a quiz:', err);
    //             return;
    //         }

    //         const quizId = result.insertId; 

    //         quiz.questions.forEach(question => {
    //             const sqlInsertQuestion = 'INSERT INTO questions (quiz_id, text, type) VALUES (?, ?, ?)';
    //             db.query(sqlInsertQuestion, [quizId, question.text, 'text'], (err) => {
    //                 if (err) {
    //                     console.error('Error while adding a question:', err);
    //                 }
    //             });
    //         });
    //     });
    // });
});

export default db;
