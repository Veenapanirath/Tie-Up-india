import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { User } from "../model/user.model.js";
import { Vendor } from "../model/vendor.model.js";
import { UserFavorites } from "../model/userFavorites.model.js";
import { Product } from "../model/product.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { uploadOnCloudinary, uploadPDFOnCloudinary } from "../utils/cloudinary.js";
import { Enquiry } from "../model/enquiry.model.js";

const generateTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
          throw new ApiError(404, "User not found");
        }
                                   
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
    
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
    
        return { accessToken, refreshToken };
    
    } catch (error) {
        throw new ApiError(500, "Error generating authentication tokens");
    }
};


const options = { 
   httpOnly: true, 
   secure: true 
};

// USER REGISTER
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role = "user", phone, address } = req.body;

  // Validate required fields
  if (!name || !email || !password || !phone) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  } 
    
  // Create user object
  const userData = {
    name,
    email,
    password,
    phone,
    role,
  };
  
  if (address) {
    userData.address = address;
  } 
  
  // Create user
  const user = await User.create(userData);

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);
  
  // Get user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return response with cookies
  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(201, { user: createdUser, accessToken, refreshToken }, "User registered successfully"));
});

// VENDOR REGISTER
export const registerVendor = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    companyName,
    companyAddress ,
    firmType ,
    personDesignation ,
    personName ,
    personPhone ,
    category,
    products ,
    productNumber ,
    annualIncome ,
    gst ,
    website,
    teamSize 
  } = req.body;

  console.log(req.body);
  // Minimal required fields
  if (!name || !email || !password || !phone) {
    throw new ApiError(400, "Name, email, phone, and password are required");
  }

  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters long");
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }
// console.log(req.file?.path);

  // Handle document upload (PDF or image)
  let companyDocumentPath = req.file?.path;
  if (!companyDocumentPath) {
    throw new ApiError(400, "Company document is required");
  }
  console.log("companyDocumentPath", companyDocumentPath);

  // Check file type to determine upload method
  const fileExtension = req.file?.originalname?.split('.').pop()?.toLowerCase();
  const isPDF = fileExtension === 'pdf';
  
  let uploadedDoc;
  if (isPDF) {
    uploadedDoc = await uploadPDFOnCloudinary(companyDocumentPath);
  } else {
    uploadedDoc = await uploadOnCloudinary(companyDocumentPath);
  }
  
  console.log("uploadedDoc", uploadedDoc);
  if (!uploadedDoc) {
    throw new ApiError(500, "Document upload failed");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: "vendor",
  });

  if(!user) {
    throw ApiError(500 , "user creation   failed")
  }

  try {
    const vendor = await Vendor.create({
      userId: user._id,
      companyName,
      firmType,
      companyAddress,
      signupPerson: {
        designation: personDesignation,
        name: personName,
        phone: personPhone,
      },
      category : category || "",
      products,
      numberOfProducts: Number(productNumber),
      annualIncome: Number(annualIncome),
      companyDocuments: uploadedDoc.secure_url,
      gstNumber: gst || "",
      website : website || "",
      teamSize: Number(teamSize),
    });

    if(!user || !vendor){
      throw new ApiError(400 , "mongoo error");
    }



    const { accessToken, refreshToken } = await generateTokens(user._id);
    if(!accessToken || !refreshToken){
      throw new  ApiError(400 , "failed to  cretea  jwt");
    }
    const userDetails = await User.findById(user._id).select("-password -refreshToken");
   

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(201, {
        user: userDetails,
        vendor,
        accessToken,
        refreshToken
      }, "Vendor registered successfully"));
  } catch (err) {
    console.log("rollled back ")
    await User.findByIdAndDelete(user._id);
    throw new ApiError(500, "Vendor creation failed, user rolled back");
  }
});


// LOGIN (Common for All)
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("req");
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  // Get user without sensitive fields
  const userDetails = await User.findById(user._id).select("-password -refreshToken");

  // Return response with cookies
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: userDetails, accessToken, refreshToken }, "Login successful"));
});

// LOGOUT
export const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  user.refreshToken = "";
  await user.save();

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "Logged out successfully"));
});

// REFRESH TOKEN
export const refreshToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies?.refreshToken || req.body.refreshToken;
  
  if (!incomingToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    const decoded = jwt.verify(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.refreshToken !== incomingToken) {
      throw new ApiError(403, "Invalid or expired refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

// Get User Dashboard - All Enquiries
export const getUserDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Get all enquiries for the user from latest to oldest
    const enquiries = await Enquiry.find({ user: userId })
    .populate({
      path: "product",
      populate: [
        { path: "category", select: "name" },
        { path: "vendor" }
      ]
    })
    .sort({ createdAt: -1 });

    if (enquiries.length === 0) {
      return res.status(200).json(
        new ApiResponse(200, { enquiries: [], message: "No enquiries found" }, "User has no enquiries")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, { enquiries }, "User enquiries retrieved successfully")
    );

  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    throw new ApiError(500, "Error fetching user dashboard");
  }
});

// Update User Profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, email, phone, address, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError(409, "Email already exists");
      }
      user.email = email;
    }

    // Update basic fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Handle password change if requested
    if (newPassword) {
      if (!currentPassword) {
        throw new ApiError(400, "Current password is required to change password");
      }

      // Verify current password
      const isCurrentPasswordValid = await user.checkPassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new ApiError(400, "Current password is incorrect");
      }

      // Update password
      user.password = newPassword;
    }

    // Save updated user
    await user.save();

    // Get user without sensitive fields
    const updatedUser = await User.findById(userId).select("-password -refreshToken");

    return res.status(200).json(
      new ApiResponse(200, { user: updatedUser }, "Profile updated successfully")
    );

  } catch (error) {
    console.error("Error updating user profile:", error);
    throw new ApiError(500, "Error updating profile");
  }
});

// Add product to user favorites
export const addToFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  try {
    // Add to favorites
    const favorite = await UserFavorites.create({
      user: userId,
      product: productId
    });

    return res.status(201).json(
      new ApiResponse(201, { favorite }, "Product added to favorites successfully")
    );

  } catch (error) {
    if (error.code === 11000) { // Duplicate key error
      throw new ApiError(409, "Product is already in favorites");
    }
    throw new ApiError(500, "Error adding product to favorites");
  }
});

// Remove product from user favorites
export const removeFromFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  if (!productId) {
    throw new ApiError(400, "Product ID is required");
  }

  // Remove from favorites
  const deletedFavorite = await UserFavorites.findOneAndDelete({
    user: userId,
    product: productId
  });

  if (!deletedFavorite) {
    throw new ApiError(404, "Product not found in favorites");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Product removed from favorites successfully")
  );
});

// Get user favorites
export const getUserFavorites = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Get favorites with product details
  const favorites = await UserFavorites.find({ user: userId })
    .populate("product", "name images description price category")
    .populate("product.category", "name")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, { favorites }, "User favorites retrieved successfully")
  );
});