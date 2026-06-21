import express from "express";
import {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
} from "../controller/brand.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = express.Router();

// Brand routes
router.route("/").post(upload.single("image"), createBrand);
router.route("/").get(getAllBrands);
router.route("/:id").get(getBrandById);
router.route("/:id").put(upload.single("image"), updateBrand);
router.route("/:id").delete(deleteBrand);
router.route("/toggle/:id").patch(toggleBrandStatus);

export default router;



