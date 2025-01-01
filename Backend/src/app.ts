import express, { Application } from 'express';
import bodyParser from 'body-parser';

import authRoutes from './routes/authRouter';
import pictureRoutes from './routes/pictureRouter';

import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import "reflect-metadata";
import { AppDataSource } from "./data-source";

const app: Application = express();
const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());

app.use(
    cors({
        origin: "*", // TODO: Limit in production
    })
);

app.use('/auth', authRoutes);
app.use('/pictures', pictureRoutes);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", // TODO: Limit in production
    },
});

const canvasStates: Record<string, string[][]> = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', ({ pictureId, username, canvas }) => {
        socket.join(pictureId);
        console.log(`${username} joined room: ${pictureId}`);

        if (canvasStates[pictureId]) {
            socket.emit('canvas_state', { canvas: canvasStates[pictureId] });
        } else {
            if (canvas) {
                canvasStates[pictureId] = canvas;  
            } else {
                canvasStates[pictureId] = Array.from({ length: 24 }, () =>
                    Array.from({ length: 24 }, () => "#FFFFFF")
                );
            }
            socket.emit('canvas_state', { canvas: canvasStates[pictureId] });
        }
    });

    socket.on('draw', ({ row, col, color, pictureId }) => {
        if (canvasStates[pictureId]) {
            canvasStates[pictureId][row][col] = color;
        }
        socket.to(pictureId).emit('draw', { row, col, color });
    });

    socket.on('increase_size', (pictureId) => {
        if (canvasStates[pictureId]) {
            const newSize = canvasStates[pictureId].length + 1;
            if (newSize > 24) return;

            canvasStates[pictureId] = Array.from({ length: newSize }, (_, row) =>
                Array.from({ length: newSize }, (_, col) =>
                    canvasStates[pictureId][row]?.[col] || "#FFFFFF"
                )
            );
        }
        socket.to(pictureId).emit('increase_size');
    });

    socket.on('decrease_size', (pictureId) => {
        if (canvasStates[pictureId]) {
            const newSize = canvasStates[pictureId].length - 1;
            if (newSize < 1) return;

            canvasStates[pictureId] = canvasStates[pictureId]
                .slice(0, newSize)
                .map(row => row.slice(0, newSize));
        }
        socket.to(pictureId).emit('decrease_size');
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

AppDataSource.initialize()
    .then(() => {
        console.log("Connected to database");

        httpServer.listen(PORT, () => {
            console.log(`Server started on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error while connecting to the database", error);
    });
