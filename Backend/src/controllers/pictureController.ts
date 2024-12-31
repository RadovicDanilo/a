import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Picture } from "../entities/Picture";
import { User } from "../entities/User";

const picturerepository = AppDataSource.getRepository(Picture);
const userRepository = AppDataSource.getRepository(User);

const getUserData = (req: Request): { userId: string; username: string } | null => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; username: string };
    } catch {
        return null;
    }
};

const PictureToDto = (picture: Picture) => ({
    name: picture.name,
    picture_data: picture.matrix,
    picture_id: picture.picture_id,
    author: {
        user_id: picture.author.id,
        username: picture.author.username,
    },
    created_at: picture.created_at.toISOString(),
    updated_at: picture.updated_at.toISOString(),
});

export const createPicture = async (req: Request, res: Response): Promise<void> => {
    const { name, picture_data } = req.body;
    const decoded = getUserData(req);

    const author = await userRepository.findOne({ where: { id: decoded.userId } });
    if (!author) {
        res.status(404).json({ failed: true, code: "NOT_AUTHENTICATED" });
        return;
    }

    try {
        const newPicture = picturerepository.create({
            name,
            author,
        });

        newPicture.matrix = picture_data;
        await picturerepository.save(newPicture);

        res.status(201).json({
            failed: false,
            picture_id: newPicture.picture_id,
        });
    } catch (error) {
        res.status(400).json({ failed: true, code: "INVALID_DATA", message: error.message });
    }
};

export const getPicturesList = async (req: Request, res: Response): Promise<void> => {
    const { limit = "10", page = "1", author, older_first = "true" } = req.query;
    const limitNumber = Number(limit);
    const pageNumber = Number(page);
    const offset = (pageNumber - 1) * limitNumber;

    const queryOptions: any = {
        take: limitNumber,
        skip: offset,
        order: {
            created_at: older_first === "true" ? "ASC" : "DESC",
        },
        relations: ["author"],
    };

    if (author) {
        queryOptions.where = { author: { id: author } };
    }

    const [pictures, total] = await picturerepository.findAndCount(queryOptions);
    const pictureDtos = pictures.map(PictureToDto);

    res.status(200).json({
        failed: false,
        pictures: pictureDtos,
        total,
    });
};

export const getPicture = async (req: Request, res: Response): Promise<void> => {
    const picture = await picturerepository.findOne({
        where: { picture_id: req.params.pictureId },
        relations: ["author"],
    });

    if (!picture) {
        res.status(404).json({ failed: true, code: "NO_SUCH_ENTITY" });
        return;
    }

    const pictureDto = PictureToDto(picture);
    res.status(200).json({
        failed: false,
        picture: pictureDto,
    });
};

export const updatePicture = async (req: Request, res: Response): Promise<void> => {
    const pictureId = req.params.pictureId;
    const jwtUserData = getUserData(req);

    const picture = await picturerepository.findOne({
        where: { picture_id: pictureId },
        relations: ["author"],
    });

    if (!picture) {
        res.status(404).json({ failed: true, code: "NO_SUCH_ENTITY" });
        return;
    }

    if (picture.author.id !== jwtUserData.userId) {
        res.status(403).json({ failed: true, code: "NOT_YOURS" });
        return;
    }

    const { name, picture_data } = req.body;

    try {
        if (name) picture.name = name;
        if (picture_data) picture.matrix = picture_data;

        await picturerepository.save(picture);

        res.status(200).json({ failed: false });
    } catch (error) {
        res.status(400).json({ failed: true, code: "INVALID_DATA", message: error.message });
    }
};

export const deletePicture = async (req: Request, res: Response): Promise<void> => {
    const pictureId = req.params.pictureId;
    const jwtUserData = getUserData(req);

    const picture = await picturerepository.findOne({
        where: { picture_id: pictureId },
        relations: ["author"],
    });

    if (!picture) {
        res.status(404).json({ failed: true, code: "NO_SUCH_ENTITY" });
        return;
    }

    if (picture.author.id !== jwtUserData.userId) {
        res.status(403).json({ failed: true, code: "NOT_YOURS" });
        return;
    }

    await picturerepository.delete(pictureId);

    res.status(200).json({ failed: false });
};
