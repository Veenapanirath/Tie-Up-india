// src/middleware/error.middleware.js
import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error caught by middleware:", err);
  
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errors = err.errors || [];
  
  // Check if error is an instance of our ApiError
  if (err instanceof ApiError) {
    // Already using ApiError values, nothing needed here
  } else if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    statusCode = 400;
    message = "Validation Error";
    errors = Object.values(err.errors).map(e => e.message);
  } else if (err.name === 'CastError') {
    // Handle Mongoose cast errors (e.g., invalid ObjectId)
    statusCode = 400;
    message = "Invalid ID format";
  } else if (err.code === 11000) {
    // Handle MongoDB duplicate key errors
    statusCode = 409;
    message = "Duplicate key error";
  } else if (err.name === 'TypeError') {
    // Better handling of type errors (like the one you encountered)
    statusCode = 400;
    if (err.message.includes("Cannot read properties of undefined")) {
      message = "Missing required data in the request";
    }
  } else if (err.name === 'MulterError') {
    // Handle file upload errors from Multer
    statusCode = 400;
    message = `File upload error: ${err.message}`;
  }

  // Return error response
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length ? errors : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

export { errorHandler };