import express from "express";
import category from "../controllers/category.js";
const router = express.Router();

router.route("/").get(category.getAll);

export default router;
