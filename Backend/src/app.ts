import express, { Application } from 'express';
import bodyParser from 'body-parser';

import authRoutes from './routes/authRouter';
import pictureRoutes from './routes/pictureRouter';

import cors from 'cors';

import "reflect-metadata";
import { AppDataSource } from "./data-source";

const app: Application = express();
const PORT = 3000;
const APP_PORT = 5173;

app.use(express.json());
app.use(bodyParser.json());

app.use(
    cors({
        origin: "*",// TODO: remove if porduction
    })
);

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

