import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { Brand } from "../model/brand.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// CREATE BRAND
export const createBrand = asyncHandler(async (req, res) => {
  const { name, category } = req.body;

  // Validate required fields
  if (!name || !category) {
    throw new ApiError(400, "Name and category are required");
  }

  // Check if brand already exists
  const existingBrand = await Brand.findOne({ name });
  if (existingBrand) {
    throw new ApiError(409, "Brand with this name already exists");
  }

  // Handle image upload
  let imagePath = req.file?.path;
  if (!imagePath) {
    throw new ApiError(400, "Brand image is required");
  }

  const uploadedImage = await uploadOnCloudinary(imagePath);
  if (!uploadedImage) {
    throw new ApiError(500, "Image upload failed");
  }

  // Create brand
  const brand = await Brand.create({
    name,
    category,
    image: uploadedImage.secure_url,
  });

  if (!brand) {
    throw new ApiError(500, "Something went wrong while creating the brand");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { brand }, "Brand created successfully"));
});

// GET ALL BRANDS
export const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, { brands }, "Brands retrieved successfully"));
});

// GET BRAND BY ID
export const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { brand }, "Brand retrieved successfully"));
});

// UPDATE BRAND
export const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, category, isActive } = req.body;

  // Find brand
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  // Check if name is being changed and if it already exists
  if (name && name !== brand.name) {
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      throw new ApiError(409, "Brand with this name already exists");
    }
    brand.name = name;
  }

  // Update fields
  if (category) brand.category = category;
  if (typeof isActive === 'boolean') brand.isActive = isActive;

  // Handle image update if provided
  if (req.file?.path) {
    const uploadedImage = await uploadOnCloudinary(req.file.path);
    if (uploadedImage) {
      brand.image = uploadedImage.secure_url;
    }
  }

  // Save updated brand
  await brand.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { brand }, "Brand updated successfully"));
});

// DELETE BRAND
export const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  await Brand.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Brand deleted successfully"));
});

// TOGGLE BRAND STATUS
export const toggleBrandStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);
  if (!brand) {
    throw new ApiError(404, "Brand not found");
  }

  brand.isActive = !brand.isActive;
  await brand.save();

  return res
    .status(200)
    .json(new ApiResponse(200, { brand }, "Brand status toggled successfully"));
});
