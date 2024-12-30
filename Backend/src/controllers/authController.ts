import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = req.body;
        const existingUser = await userRepository.findOne({
            where: { username: validatedData.username },
        });

        if (existingUser) {
            res.status(400).json({
                failed: true,
                code: "DUPLICATE_USERNAME",
            });
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        const newUser = userRepository.create({
            username: validatedData.username,
            password: hashedPassword,
        });
        await userRepository.save(newUser);

        res.status(201).json({
            failed: false,
            user_id: newUser.id,
        });
    } catch (error) {
        console.error("Error during registration:", error);  
        res.status(500).json({
            failed: true,
            code: "INTERNAL_ERROR",
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const validatedData = req.body;
        const user = await userRepository.findOne({
            where: { username: validatedData.username },
        });

        if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
            res.status(401).json({
                failed: true,
                code: "INCORRECT_CREDENTIALS",
            });
        }

        const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        res.status(200).json({
            failed: false,
            token: token,
            user_id: user.id,
            username: user.username,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            failed: true,
            code: "INTERNAL_ERROR",
        });
    }
};
