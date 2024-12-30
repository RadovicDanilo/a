import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRouter';

import "reflect-metadata";
import { AppDataSource } from "./data-source";

const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

app.use('/auth', authRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Connected to database");

        app.listen(PORT, () => {
            console.log("Server started on http://localhost:3000");
        });
    })
    .catch((error) => {
        console.error("Error while connecting to the database", error);
    });

