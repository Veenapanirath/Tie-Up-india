import { Router } from "express";
import { updateVendorDetails , updateVendorDocuments , deleteVendorAndAllData } from "../controller/vendor.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { isVendorOrAdmin } from "../middleware/isVendorOrAdmin.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

// All routes require authentication and vendor role
router.use(authenticateUser);
router.use(isVendorOrAdmin);

// Update vendor details
router.route("/profile/:vendorId")
  .put(updateVendorDetails);


  router.route("/documents/:vendorId")
  .put(upload.fields([
    {
      name: "companyDocument",
      maxCount: 1
    }
  ]), updateVendorDocuments);

  // DELETE EVERYTHING - Complete vendor cleanup
router.route("/delete-all/:vendorId")
.delete(deleteVendorAndAllData);

export default router;
