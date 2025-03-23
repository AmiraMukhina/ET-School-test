import express from 'express';
import db from '../config/db.js';

const router = express.Router();

router.get('/all', (req, res) => {
    const sql = 'SELECT * FROM quizzes';

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error while retrieving quizzes:", err);
            return res.status(500).json({ error: 'Error while retrieving quizzes' });
        }
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const sql = `SELECT * FROM questions WHERE quiz_id = ${req.params.id}`;
    // const sql = `SELECT * FROM questions WHERE quiz_id = ?`;


    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error while retrieving questions:", err);
            return res.status(500).json({ error: 'Error while retrieving questions' });
        }
        res.json(results);
    });
});

const sampleQuestions = [
    {
        text: "What is your favorite color?",
        type: "text",
        options: []
    },
    {
        text: "Which is your favorite animal?",
        type: "single",
        options: ["Cat", "Dog", "Rabbit"]
    }
];

router.post('/', (req, res) => {
    const { name, description, question_count, completions, questions=sampleQuestions } = req.body;
    console.log('Received quiz data:', req.body); 

    const sql = 'INSERT INTO quizzes (name, description, question_count, completions) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [name, description, question_count, completions], (err, result) => {
        if (err) {
            console.error("Error while adding a quiz:", err);
            return res.status(500).json({ error: 'Error while adding a quiz' });
        }
        console.log('Quiz added with ID:', result.insertId); 
        const quizId = result.insertId; 

        const questionSql = 'INSERT INTO questions (quiz_id, text, type, options) VALUES (?, ?, ?, ?)';
        questions.forEach(question => {
            db.query(questionSql, [quizId, question.text, question.type, JSON.stringify(question.options)], (err) => {
                if (err) {
                    console.error("Error while adding a question:", err);
                }
            });
        });
        res.status(201).json({ message: 'The quiz successfully created', quizId: result.insertId });
    });
});

router.put('/:id', (req, res) => {
    const { name, description } = req.body;
    db.query(
        'UPDATE quizzes SET name = ?, description = ? WHERE id = ?',
        [name, description, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Quiz updated' });
        }
    );
});

router.post('/submit', (req, res) => {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    const answerSql = 'INSERT INTO answers (question_id, answer_text) VALUES (?, ?)';
    
    answers.forEach(({ question_id, answer_text }) => {
        db.query(answerSql, [question_id, answer_text], (err) => {
            if (err) {
                console.error("Error while saving user answer:", err);
            }
        });
    });

    res.status(201).json({ message: 'Answers successfully submitted' });
    console.log('Answers successfully submitted');
});


router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM quizzes WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error while deleting the quiz:", err);
            return res.status(500).json({ error: 'Error while deleting the quiz' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz successfully deleted' });
    });
});

router.get('/:id/count', (req, res) => {
    const sql = 'SELECT COUNT(*) AS questionCount FROM questions WHERE quiz_id = ?';

    db.query(sql, [req.params.id], (err, results) => {
        if (err) {
            console.error("Error while retrieving question count:", err);
            return res.status(500).json({ error: 'Error while retrieving question count' });
        }
        res.json({ count: results[0].questionCount });
    });
});


export default router;
