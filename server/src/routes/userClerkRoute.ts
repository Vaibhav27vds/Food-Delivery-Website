import Express from "express";
import registerUser from "../controllers/userClerkController.ts";

const router = Express.Router();

router.post("/register", registerUser);

export default router;

