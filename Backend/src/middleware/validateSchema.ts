import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { ZodError } from "zod";

export const validateSchema = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    failed: true,
                    code: "INVALID_DATA",
                    extra: error.errors,
                });
            }
            res.status(500).json({
                failed: true,
                code: "INTERNAL_ERROR",
            });
        }
    };
};
