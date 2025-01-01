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

const userConnections: Record<string, { pictureId: string; username: string }> = {};
const roomUsers: Record<string, Set<string>> = {};
const canvasStates: Record<string, Array<Array<{ color: string }>>> = {};
const cursorState: Record<string, Record<string, { x: number, y: number }>> = {};
io.on('connection', (socket) => {
    socket.on('join', ({ pictureId, username, canvas }) => {
        console.log(`User ${username} is joining room: ${pictureId}`);

        userConnections[socket.id] = { pictureId, username };

        socket.join(pictureId);

        if (!roomUsers[pictureId]) {
            roomUsers[pictureId] = new Set();
            cursorState[pictureId] = {};
            canvasStates[pictureId] = canvas;
            console.log("SETTING CANVAS")
            console.log(canvas)
            console.log(`Room ${pictureId} created.`);
        }

        socket.emit('init', { canvas: canvasStates[pictureId], cursors: cursorState[pictureId] });

        roomUsers[pictureId].add(socket.id);
        cursorState[pictureId][username] = { x: 0, y: 0 };

        console.log(`${username} joined room: ${pictureId}`);
        socket.to(pictureId).emit('user_joined', { username });
    });

    socket.on('draw', ({ pictureId, row, col, color }) => {
        console.log(`User drew on picture ${pictureId} at row ${row}, col ${col} with color ${color}`);
        canvasStates[pictureId][row][col] = { color };
        socket.to(pictureId).emit('draw', { row, col, color });
    });

    socket.on('update_cursor', ({ pictureId, username, x, y }) => {
        cursorState[pictureId][username] = { x, y };
        socket.to(pictureId).emit('update_cursor', { username, x, y });
    });

    socket.on('increase_size', ({pictureId}) => {
        console.log(`Increasing canvas size for room ${pictureId}`);
        const currentSize = canvasStates[pictureId].length;
        const newSize = currentSize + 1;

        if (newSize > 24) return;

        canvasStates[pictureId] = Array.from({ length: newSize }, (_, row) =>
            Array.from({ length: newSize }, (_, col) =>
                canvasStates[pictureId][row]?.[col] || { color: "#FFFFFF" }
            )
        );

        socket.to(pictureId).emit('increase_size');
    });

    socket.on('decrease_size', ({pictureId}) => {
        console.log(`Decreasing canvas size for room ${pictureId}`);
        const currentSize = canvasStates[pictureId].length;
        const newSize = currentSize - 1;

        if (newSize < 1) return;

        canvasStates[pictureId] = canvasStates[pictureId]
            .slice(0, newSize)
            .map(row => row.slice(0, newSize));

        socket.to(pictureId).emit('decrease_size');
    });

    socket.on('disconnect', () => {
        const userInfo = userConnections[socket.id];
        if (!userInfo) return;
        const { pictureId, username } = userInfo;

        delete userConnections[socket.id];
        roomUsers[pictureId].delete(socket.id);
        delete cursorState[pictureId][username];

        console.log(`${username} left room: ${pictureId}`);
        socket.to(pictureId).emit('user_left', { username });

        if (roomUsers[pictureId].size === 0) {
            delete canvasStates[pictureId];
            delete roomUsers[pictureId];
            delete cursorState[pictureId];
            console.log(`Room ${pictureId} deleted.`);
        }
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
