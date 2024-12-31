import express from "express";
import { login, register } from "../controllers/authController";
import { validateSchema } from "../middleware/validateSchema";
import { authSchema } from "../schemas/authSchemas";

const authRouter = express.Router();

authRouter.post("/login", validateSchema(authSchema), login);
authRouter.post("/register", validateSchema(authSchema), register);

export default authRouter;
