import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRouter';
import pictureRoutes from './routes/pictureRouter';

import "reflect-metadata";
import { AppDataSource } from "./data-source";

const app: Application = express();
const PORT = 3000;
const APP_PORT = 5174;

app.use(express.json());
app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:" + APP_PORT,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

app.use('/auth', authRoutes);
app.use('/pictures', pictureRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log("Connected to database");

        app.listen(PORT, () => {
            console.log("Server started on http://localhost:" + PORT);
        });
    })
    .catch((error) => {
        console.error("Error while connecting to the database", error);
    });

