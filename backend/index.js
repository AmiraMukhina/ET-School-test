import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5502",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));
app.use(express.json());

const PORT = process.env.PORT || 5502;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

import createQuizTable from './models/quizModel.js';
createQuizTable();

import quizRoutes from "./routes/quizRoutes.js";
app.use('/quizzes', quizRoutes);
