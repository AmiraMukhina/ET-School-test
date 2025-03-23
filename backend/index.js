import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5502",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));
app.use(express.json());

const __dirname = new URL('.', import.meta.url).pathname;
const frontendPath = path.join(__dirname, '../frontend');
console.log('Frontend path:', frontendPath);

app.use(express.static(frontendPath));

app.get("/", (req, res) => {
    console.log('Sending file:', path.join(frontendPath, 'index.html'));
    res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5502;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

import createQuizTable from './models/quizModel.js';
createQuizTable();

import quizRoutes from "./routes/quizRoutes.js";
app.use('/quizzes', quizRoutes);
