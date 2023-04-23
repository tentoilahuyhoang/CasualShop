import express from "express";
const router = express.Router();
import discount from "../controllers/discount.js";

router.route("/").get(discount.getAll);

router.route("/:id").get(discount.getById);

export default router;
