import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        res.status(401).json({ failed: true, code: "NOT_AUTHENTICATED" });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch {
        res.status(401).json({ failed: true, code: "NOT_AUTHENTICATED" });
    }
};
