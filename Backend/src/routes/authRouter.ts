import express from "express";
import { login, register } from "../controllers/authController";
import { validateSchema } from "../middleware/validateSchema";
import { loginSchema, registerSchema } from "../schemas/authSchemas";

const authRouter = express.Router();

authRouter.post("/login", validateSchema(loginSchema), login);
authRouter.post("/register", validateSchema(registerSchema), register);

export default authRouter;
