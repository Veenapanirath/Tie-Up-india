// routes/order.routes.js
import express from "express";
import {
  createOrder,
  getAllOrder,
  getAllUserOrder,
  updateOrderStatus,
  getAllOrderVendor,
} from "../controller/order.controller.js";
import  {authenticateUser}
from "../middleware/auth.middleware.js"
import  {isVendorOrAdmin}
from "../middleware/isVendorOrAdmin.middleware.js"

import { Router } from "express";

const router = Router();

// user: create inquiry
router.route('/create').post( authenticateUser, createOrder);

// user: get own inquiries
router.route('/my').get( authenticateUser, getAllUserOrder);


// admin: get all inquiries
router.route('/all').get(   getAllOrder);


// admin: update inquiry status
router.route('/:orderId/status').put( updateOrderStatus)

router.route('/vendor/inquiry').get(authenticateUser, isVendorOrAdmin, getAllOrderVendor)


export default router;
