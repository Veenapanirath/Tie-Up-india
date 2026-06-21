import express from "express";
import {
    buySub,
    confirmPayment,
    myPlan,
    updateMySub,
    getallSub,
    getAllSubscriptions
} from "../controller/mySubscription.controller.js";
import {authenticateUser } from "../middleware/auth.middleware.js"

const router = express.Router();

// Vendor routes
router.post("/buy", buySub); // Step 1: create Razorpay order
router.post("/confirm",authenticateUser ,confirmPayment); // Step 2: confirm and store plan
router.get("/current-plan", authenticateUser , myPlan); // get vendor plan
router.get("/get-plans", getallSub); 
router.get("/all-sub-vendor" ,getAllSubscriptions); 

// Admin route
router.put("/admin/edit/:id", updateMySub); // admin edit sub

export default router;
