import express from "express";
import { adminController } from "../config/di";

const router = express.Router();

router.get("/users", adminController.fetchAllUsers.bind(adminController));


export default router;
