import express from "express";
import {
  SIGNUP,
  LOGIN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USERS_BY_ID,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
} from "../controllers/users.js";
import auth from "../middleware/auth.js";
const router = express.Router();

router.post("/signup", SIGNUP);
router.post("/login", LOGIN);
router.post("/getNewJwtToken", GET_NEW_JWT_TOKEN);
router.get("/getAllUsers", auth, GET_ALL_USERS);
router.get("/getUserById/:id", auth, GET_USERS_BY_ID);
router.get("/getAllUsersWithTickets", GET_ALL_USERS_WITH_TICKETS);
router.get("/getAllUsersWithTickets/:id", GET_USER_BY_ID_WITH_TICKETS);

export default router;
