import express from "express";
import { signup, login } from "../controllers/auth.controller.js";
import {me} from "../controllers/profile.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { changePassword } from "../controllers/profile.controller.js";

const router = express.Router();
console.log("Auth routes loaded")
;
router.post("/signup", signup);
router.post("/login", login);
router.get("/me",verifyToken,me);
router.put("/change-password", verifyToken, changePassword);
export default router;
