// controllers/order.controller.js
import { Order } from "../model/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { Vendor } from "../model/vendor.model.js";
import { Product } from "../model/product.model.js";

// Create Inquiry (Order)
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    throw new ApiError(400, "No products in inquiry");
  }

  if (!totalPrice) {
    throw new ApiError(400, "Total price is required");
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    totalPrice,
  });

  return res.status(201).json(new ApiResponse(201, order, "Inquiry created successfully"));
});

// Get all inquiries of logged-in user
export const getAllUserOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("orderItems.product");

  return res.status(200).json(new ApiResponse(200, orders, "All inquiries of user"));
});

// Get all inquiries (admin only)
export const getAllOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("user", "name email")
    .populate("orderItems.product");

  return res.status(200).json(new ApiResponse(200, orders, "All inquiries"));
});

// Update inquiry status (admin only)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["new", "in-progress", "resolved", "closed"];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(404, "Inquiry not found");
  }

  order.status = status;
  await order.save();

  return res.status(200).json(new ApiResponse(200, order, "Inquiry status updated"));
});


export const getAllOrderVendor = asyncHandler(async(req , res) => {

    const user = req.user;

    if (user.role !== "vendor") {
      throw new ApiError(403, "You are not a vendor");
    }
  
    // 1. Get all product IDs of the vendor
    const vendorProducts = await Product.find({ vendor: user._id }).select("_id");
  
    const productIds = vendorProducts.map((p) => p._id);
  
    if (!productIds.length) {
      throw new ApiError(404, "No products found for this vendor");
    }
  
    // 2. Find all orders that include those products
    const orders = await Order.find({
      "orderItems.product": { $in: productIds }
    })
      .populate("user", "name email")
      .populate("orderItems.product");
  
    return res
      .status(200)
      .json(new ApiResponse(200, orders, "All inquiries for this vendor's products"));
})