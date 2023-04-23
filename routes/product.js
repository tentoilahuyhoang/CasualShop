import express from "express";
const router = express.Router();

import product from "../controllers/product.js";

router.route("/").get(product.getAll);
router.route("/:id").get(product.getById);

router.route("/:id/like").post(product.likeProduct);
router.route("/:id/unlike").post(product.unlikeProduct);

router.route("/:id/rating").post(product.rateProduct);
router.route("/:id/sold").put(product.soldProduct);

router.route("/category/:category").get(product.getProductByCategory);
router.route("/subcategory/:subcategory").get(product.getProductBySubCategory);

export default router;
