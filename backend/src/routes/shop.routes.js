import { Router } from "express";
import { connectToDealer, myDealers } from "../controllers/shop.controller.js";
import { listDealerProductsForShop } from "../controllers/product.controller.js";
import {
  saveProduct,
  unsaveProduct,
  listSaved,
} from "../controllers/saved.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate, requireRole("shop"));

router.post("/connect", connectToDealer);
router.get("/dealers", myDealers);
router.get("/dealers/:dealerId/products", listDealerProductsForShop);

router.get("/saved", listSaved);
router.post("/saved/:productId", saveProduct);
router.delete("/saved/:productId", unsaveProduct);

export default router;