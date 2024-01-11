import { Router } from "express";
import UserController from "../controllers/UserController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = new Router()

router.post("/registration", UserController.registration);
router.get("/login", UserController.login);
router.get("/users", adminMiddleware(['user']),  UserController.getUsers);
router.get("/user/:id", UserController.getOneUser);
router.delete("/removal/:id", UserController.deleteUser);





export default router