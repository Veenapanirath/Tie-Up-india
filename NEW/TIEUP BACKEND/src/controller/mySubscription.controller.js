import { MySubscription } from "../model/mySub.model.js";
import { Subscription } from "../model/sub.model.js";
import { Vendor } from "../model/vendor.model.js";
import Razorpay from "razorpay";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../model/user.model.js";
// Razorpay instance
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_ID,
//     key_secret: process.env.RAZORPAY_SECRET
// });

// const razorpay = new Razorpay({
//   key_id: "rzp_test_VITEd7OizAltKf",
//   key_secret: "RdoJpHFeHHm4I6dZWrhAq0HH",
// });


import  nodemailer  from "nodemailer";
import crypto from "crypto";

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS  // your app password
    }
});


const sendConfirmationEmail = async (vendorEmail, plan) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: vendorEmail,
    subject: 'Subscription Confirmation',
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your subscription has been activated.</p>
      <p><strong>Plan:</strong> ${plan.name}</p>
      <p><strong>Duration:</strong> ${plan.days} days</p>
      <p><strong>Amount Paid:</strong> ₹${plan.amount}</p>
      <p>You can now start using the platform as per your subscription.</p>
      <br />
      <p>Best regards,<br />Tieup India</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to', vendorEmail);
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
  }
};


const razorpay = new Razorpay({
  key_id: "rzp_live_RLUmRAnIlvcxAr",
  key_secret: "oGpk0UvUFoPTLPqMhKQ6rC7T",
});

// Buy subscription (Step 1: Create Razorpay order)
export const buySub = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  console.log("amount",amount);
  // convert rupees -> paise
  const amountPaise = Math.round(Number(amount) * 100);

  if (!Number.isFinite(amountPaise) || amountPaise < 100) {
    throw new ApiError(400, "Amount must be at least ₹1");
  }
  console.log("amountPaise",amountPaise);
  

  const options = {
    amount: amountPaise, // in paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  const order = await razorpay.orders.create(options);

  console.log( "order", order);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        orderId: order.id,
        amount: order.amount,  //amount: order.amount, // paise
        currency: order.currency,
      },
      "Order created"
    )
  );
});


// Step 2: Confirm payment with verification (NO WEBHOOK NEEDED)
export const confirmPayment = asyncHandler(async (req, res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, subId } = req.body;

  // ✅ ADD DEBUG LOGGING
  console.log("=== PAYMENT DEBUG ===");
  console.log("razorpayPaymentId:", razorpayPaymentId);
  console.log("razorpayOrderId:", razorpayOrderId);
  console.log("razorpaySignature:", razorpaySignature);
  console.log("subId:", subId);

  const vendor = await Vendor.findOne({ userId: req.user.id });
  if (!vendor) throw new ApiError(404, "Vendor not found");

  const plan = await Subscription.findById(subId);
  if (!plan) throw new ApiError(404, "Plan not found");

  // ✅ STEP 1: Verify payment signature (prevents fraud)
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac("sha256", "oGpk0UvUFoPTLPqMhKQ6rC7T")
    .update(body)
    .digest("hex");

  // ✅ ADD MORE DEBUG LOGGING
  console.log("Body for signature:", body);
  console.log("Expected signature:", expectedSignature);
  console.log("Received signature:", razorpaySignature);
  console.log("Signatures match:", razorpaySignature === expectedSignature);

  if (razorpaySignature !== expectedSignature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  // ✅ STEP 2: Verify payment status with Razorpay API
  try {
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    
    // Check if payment is actually captured
    if (payment.status !== 'captured') {
      throw new ApiError(400, `Payment not captured. Status: ${payment.status}`);
    }

    // Check if amount matches
    if (payment.amount !== plan.amount * 100) {
      throw new ApiError(400, "Payment amount mismatch");
    }

    console.log("Payment verified:", payment.id, payment.status);
  } catch (error) {
    console.error("Payment verification failed:", error);
    throw new ApiError(400, "Payment verification failed");
  }

  // ✅ STEP 3: Check if subscription already exists (prevents duplicates)
  const existingSubscription = await MySubscription.findOne({
    razorpayPaymentId: razorpayPaymentId
  });

  if (existingSubscription) {
    throw new ApiError(400, "Payment already processed");
  }

  // ✅ STEP 4: Create subscription only after verification
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + plan.days);

  const subscription = await MySubscription.create({
    sub: subId,
    vendor: vendor._id,
    startDate: now,
    endDate: end,
    remainingProductCount: plan.productlimit,
    amountPaid: plan.amount,
    paymentStatus: "success",
    razorpayOrderId,
    razorpayPaymentId,
  });

  const userEmail = await User.findById(req.user.id);
  try {
    await sendConfirmationEmail(userEmail.email, plan);
  } catch (err) {
    console.warn('Subscription confirmed, but email failed:', err.message);
  }

  res.status(200).json(
    new ApiResponse(200, subscription, "Subscription activated successfully")
  );
});

// Vendor fetching current plan
export const myPlan = asyncHandler(async (req, res) => {
  // const { vendorId } = req.params;

   const now = new Date()
  const vendorId = req.user._id;
  console.log("id", vendorId);
  const vendor = await Vendor.findOne({ userId: vendorId });
  if (!vendor) throw new ApiError(404, "No vendor found");

  const plan = await MySubscription.findOne({
    vendor: vendor._id,
    startDate: { $lte: now },
    endDate: { $gte: now },
    
  })
    .sort({ createdAt: -1 })
    .populate("sub");
  if (!plan) throw new ApiError(404, "No active subscription found");

  console.log(plan);

  res.status(200).json(new ApiResponse(200, plan, "Current plan fetched"));
});

// Admin editing subscription (product count & date)
export const updateMySub = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newProductCount, extendDays } = req.body;

  const sub = await MySubscription.findById(id);
  if (!sub) throw new ApiError(404, "Subscription not found");

  if (newProductCount !== undefined) {
    sub.remainingProductCount = newProductCount;
  }

  if (extendDays) {
    const newEndDate = new Date(sub.endDate);
    newEndDate.setDate(newEndDate.getDate() + extendDays);
    sub.endDate = newEndDate;
  }

  await sub.save();

  res
    .status(200)
    .json(new ApiResponse(200, sub, "Subscription updated by admin"));
});

//get all  plans
export const getallSub = asyncHandler(async (req, res) => {
  const plans = await Subscription.find({});
  if (!plans) {
    throw new ApiError(400, "no product");
  }

  return res.status(200).json(new ApiResponse(200, plans, "all plans"));
});

//for   transaction  --  to  get   all  the   user  with sub
export const getAllSubscriptions = asyncHandler(async (req, res) => {
  console.log("running  get ");
  const subscriptions = await MySubscription.find()
    .populate("sub") // Populate subscription plan details
    .populate("vendor")// Populate vendor details
    .sort({ createdAt: -1 }); // Sort by creation date descending
  if (!subscriptions || subscriptions.length === 0) {
    throw new ApiError(404, "No subscriptions found");
  }

  console.log("sub--", subscriptions);

  return res
    .status(200)
    .json(
      new ApiResponse(200, subscriptions, "All subscriptions with details")
    );
});
