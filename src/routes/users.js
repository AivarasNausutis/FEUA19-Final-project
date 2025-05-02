import express from "express";
import { SIGNUP, LOGIN, GET_NEW_JWT_TOKEN } from "../controllers/users.js";

const router = express.Router();

router.post("/signup", SIGNUP);
router.post("/login", LOGIN);
router.post("/getNewJwtToken", GET_NEW_JWT_TOKEN);

export default router;
