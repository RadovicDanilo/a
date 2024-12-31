import { z } from "zod";

export const basePictureSchema = z.object({
    name: z
        .string()
        .min(1, "Name must have at least 1 character")
        .max(40, "Name cannot exceed 40 characters"),
    picture_data: z
        .array(
            z.array(
                z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid color format (#rgb or #rrggbb expected)")
            )
        )
        .refine(
            (matrix) =>
                matrix.length >= 1 &&
                matrix.length <= 24 &&
                matrix.every((row) => row.length === matrix.length),
            {
                message: "Picture data must be a square matrix between 1x1 and 24x24",
            }
        ),
});

export const updatePictureSchema = basePictureSchema.partial();

export const pictureQuerySchema = z.object({
    limit: z
        .string()
        .optional()
        .refine((value) => !value || (Number(value) >= 1 && Number(value) <= 25), {
            message: "Limit must be between 1 and 25",
        }),
    page: z
        .string()
        .optional()
        .refine((value) => !value || Number(value) >= 1, {
            message: "Page must be at least 1",
        }),
    author: z.string().uuid().optional(),
    older_first: z
        .string()
        .optional()
        .refine((value) => value === "true" || value === "false" || !value, {
            message: "Older first must be 'true' or 'false'",
        }),
});
