import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateSchema = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const isBadPictureDataError = error.errors.some((err) =>
                    err.message.includes("Picture data must be a square matrix") ||
                    err.message.includes("Invalid color format")
                );

                res.status(400).json({
                    failed: true,
                    code: isBadPictureDataError ? "BAD_PICTURE_DATA" : "INVALID_DATA",
                    extra: error.errors,
                });
            } else {
                res.status(500).json({
                    failed: true,
                    code: "INTERNAL_ERROR",
                });
            }
        }
    };
};
