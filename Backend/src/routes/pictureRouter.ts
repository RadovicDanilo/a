import express from "express";
import { validateSchema } from "../middleware/validateSchema";
import { basePictureSchema, pictureQuerySchema, updatePictureSchema, } from "../schemas/pictureSchemas";
import { createPicture, deletePicture, getPicture, getPicturesList, updatePicture } from "../controllers/pictureController";
import { authenticate } from "../middleware/authenticate";

const pictureRouter = express.Router();

pictureRouter.post("/", authenticate, validateSchema(basePictureSchema), createPicture);
pictureRouter.get("/", validateSchema(pictureQuerySchema), getPicturesList);
pictureRouter.get("/:pictureId", getPicture);
pictureRouter.patch("/:pictureId", authenticate, validateSchema(updatePictureSchema), updatePicture);
pictureRouter.delete("/:pictureId", authenticate, deletePicture);

export default pictureRouter;

