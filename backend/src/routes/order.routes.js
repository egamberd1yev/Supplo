import { Router } from "express";
import {
  createOrder,
  listOrders,
  getOrder,
  changeStatus,
} from "../controllers/order.controller.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);

router.post("/", requireRole("shop"), createOrder);
router.get("/", listOrders);
router.get("/:id", getOrder);
router.patch("/:id/status", changeStatus);

export default router;