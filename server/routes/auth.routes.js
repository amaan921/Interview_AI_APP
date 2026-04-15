import express from "express";
import {googleAuth} from "../controllers/auth.controller.js";
import { logOut } from "../config/token.js";


const authRouter = express.Router();

authRouter.post('/google', googleAuth);
authRouter.get('/logout', logOut);

export default authRouter;