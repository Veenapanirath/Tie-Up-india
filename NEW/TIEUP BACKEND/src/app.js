import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app =  express();
import { errorHandler } from "./middleware/error.middleware.js";
// app.use(cors({
//     origin:process.env.CORS_ORIGN,
//     credentials: true 
// }))

// Convert the comma-separated string to an array
// const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
const envcheck = process.env.CORS_ORIGN?.split(',') || [];

console.log("allow --",envcheck); // Log the allowed origins for debugging

// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));


// app.use(cors({ 
//   credentials: true,
//   allowedOrigins: ["https://v0.dev" , "http://localhost:3000"]
// }))

// app.use(cors({
//   origin: ["http://localhost:3000", "http://localhost:8080","https://tieupindia.com"],
//   credentials: true
// }));


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "https://tieupindia.com",
  "tieupindia.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ✅ respond to all OPTIONS requests with CORS headers
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));


app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true }))
app.use(express.static("public"))
app.use(cookieParser())


app.post('/submit', (req, res) => {
    const {name} = req.body;
    console.log(req.body); // Should now log the form data
    console.log(name); // Should now log the form data
    res.send('Data received');
});


//----------------

import userRouter from "./router/user.router.js";
import productRouter from "./router/product.router.js";
import orderRouter from "./router/order.routes.js"
import adminRouter from "./router/admin.route.js"
import mySubRoutes from "./router/mySubscription.routes.js";
import Enquiry from "./router/enquiryRoutes.js";
import vendorRouter from "./router/vendor.routes.js";
import brandRouter from "./router/brand.routes.js";
import sendMail from "./router/sendmail.js";

app.use("/api/v1/user" ,userRouter );
app.use("/api/v1/product" , productRouter)
app.use("/api/v1/order" , orderRouter)
app.use("/api/v1/admin" , adminRouter)
app.use("/api/v1/subscription", mySubRoutes);
app.use("/api/v1/enquiry", Enquiry);
app.use("/api/v1/vendor", vendorRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/contact", sendMail);

// Error handling middleware - MUST be after all routes
app.use(errorHandler);

export {app} ;