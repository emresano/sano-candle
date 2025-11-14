import { Router } from "express";
import authRoutes from "./authRoutes";
import catalogRoutes from "./catalogRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import marketingRoutes from "./marketingRoutes";
import settingsRoutes from "./settingsRoutes";
import checkoutRoutes from "./checkoutRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/catalog", catalogRoutes);
router.use("/cart", cartRoutes);
router.use("/orders", orderRoutes);
router.use("/marketing", marketingRoutes);
router.use("/settings", settingsRoutes);
router.use("/checkout", checkoutRoutes);

export default router;

