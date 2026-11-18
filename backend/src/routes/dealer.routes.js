import { Router } from "express";
import { myShops, removeShop } from "../controllers/dealer.controller.js";
import {
  createProduct,
  listMyProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.js";
import { uploadProductImage } from "../middlewares/upload.js";

const router = Router();

router.use(authenticate, requireRole("dealer"));

router.get("/shops", myShops);
router.patch("/shops/:id/remove", removeShop);

router.post("/products", uploadProductImage, createProduct);
router.get("/products", listMyProducts);
router.patch("/products/:id", uploadProductImage, updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;