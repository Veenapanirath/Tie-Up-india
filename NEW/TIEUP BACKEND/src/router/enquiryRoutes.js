import express from "express";
import { createEnquiry, updateEnquiry, deleteEnquiry , AllEnquiry , getVendorEnquiry } from "../controller/enquiry.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js"; 
import {optionalAuth } from "../middleware/optionalAuth.middleware.js"
const router = express.Router();

// Route for creating enquiry (accessible to both authenticated and guest users)
router.post("/create-enq", optionalAuth ,createEnquiry);

// Route for updating enquiry (authenticated users or admins only)
router.put("/enquiry/:enquiryId", authenticateUser, updateEnquiry);

// Route for deleting enquiry (authenticated users or admins only)
router.delete("/enquiry/:enquiryId",  deleteEnquiry);
router.get("/AllEnquiry", authenticateUser, AllEnquiry);
router.get("/AllVendorEnquiry", authenticateUser, getVendorEnquiry);

export default router;