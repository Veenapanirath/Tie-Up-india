// controllers/product.controller.js
import { Product } from "../model/product.model.js";
import { Category } from "../model/category.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { uploadOnCloudinary ,deleteFromCloudinaryByUrl} from "../utils/cloudinary.js";
import { upload } from "../middleware/multer.middleware.js";
import { User } from "../model/user.model.js";
import { Vendor } from "../model/vendor.model.js";
import { ProductDetail } from "../model/phone.model.js";
import { MySubscription } from "../model/mySub.model.js";
import {Enquiry} from "../model/enquiry.model.js"
import mongoose from "mongoose";
 
export const addProduct = asyncHandler(async (req, res) => {
  const { name, description, quantity, price, category, subCategory, phoneno, unit } =
    req.body;

    let { highlight } = req.body;
if (typeof highlight === "string") {
  try {
    highlight = JSON.parse(highlight);
  } catch {
    highlight = [highlight];
  }
}
if (!Array.isArray(highlight)) {
  highlight = [];
}

  console.log("running------", req.body);
  if (!name || !quantity || !price || !category || !phoneno) {
    throw new ApiError(400, "Required fields are missing");
  }
  // Validate unit (optional; default to pcs)
  // const allowedUnits = ["pcs", "kg", "g", "mg", "lb", "oz", "l", "ml", "m", "cm", "mm", "ft", "in"];
  // let normalizedUnit = "pcs";
  // if (unit !== undefined && unit !== null && String(unit).trim() !== "") {
  //   const u = String(unit).toLowerCase();
  //   if (!allowedUnits.includes(u)) {
  //     throw new ApiError(400, "Invalid unit. Allowed: " + allowedUnits.join(", "));
  //   }
  //   normalizedUnit = u;
  // }

  console.log("phone", phoneno);

  // Optional: Check if category exists
  const categoryExists = await Category.findById(category);

  console.log("categoryExists", categoryExists);
  // const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    throw new ApiError(404, "Category not found");
  }

  // If subCategory is provided → validate it
  if (subCategory) {
    const isValidSubCategory = categoryExists.sub_category.some(
      (sub) => sub._id?.toString() === subCategory
    );
    if (!isValidSubCategory) {
      throw new ApiError(400, "Invalid subcategory for selected category");
    }
  }

  // Handle multiple images
  const productImages = req.files?.productImage;
  
  if (!productImages || productImages.length === 0) {
    throw new ApiError(400, "No product images uploaded");
  }

  // Upload all images to cloudinary
  const uploadedImages = [];
  for (const imageFile of productImages) {
    const uploadedImage = await uploadOnCloudinary(imageFile.path);
    if (uploadedImage) {
      uploadedImages.push(uploadedImage.url);
    }
  }

  if (uploadedImages.length === 0) {
    throw new ApiError(500, "Failed to upload any images");
  }

  const vendor = await Vendor.findOne({ userId: req.user.id });
  if (!vendor) throw new ApiError(404, "Vendor not found");

  //check  for  the phone  no
  //find  the  vendor --->  yes (check no  if  --> yes ()/ no (add the  no))
  //if no  then  add the vendor and phone  no
  const vendorDetail = await ProductDetail.findOne({ vendor: vendor._id });
  console.log("vednor", vendorDetail);

  if (vendorDetail) {
    if (!vendorDetail.phonenos.includes(Number(phoneno))) {
      vendorDetail.phonenos.push(Number(phoneno));
      await vendorDetail.save();
    }
  } else {
    const newVendorDetail = await ProductDetail.create({
      vendor: vendor._id,
      phonenos: [Number(phoneno)],
    });
  }

  const product = await Product.create({
    name,
    description,
    quantity: Number(quantity),
    unit: unit || "",
    price: Number(price),
    category: categoryExists._id,
    images: uploadedImages, // Changed from image to images array
    vendor: vendor._id,
    subCategory: subCategory || undefined,
    phoneno: Number(phoneno), //added phone no
    highlight: highlight,
  });

  // if(subCategory) product.subCategory = subCategory

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
});

// Create category
export const createCategory = asyncHandler(async (req, res) => {
  const user = req.user;
  //  console.log(user.role);
  // if(user.role != 'admin'){
  //   throw new ApiError(400 , "not  authorized ,  you  are  not  admin")
  // }
  const { name } = req.body;
  console.log(name);
  if (!name) {
    throw new ApiError(400, "Category name is required");
  }

  // if (!req.files || !req.files.catImage || !req.files.catImage[0]) {
  //   throw new ApiError(400, "No category image was uploaded");
  // }

  let categoryImageLocalPath;

  if (req.files || req.files.catImage || req.files.catImage[0]) {
    // throw new ApiError(400, "No category image was uploaded");
    categoryImageLocalPath = req.files?.catImage[0]?.path;
  }

  let Image; // console.log(categoryImageLocalPath);
  if (categoryImageLocalPath) {
    // throw new ApiError(400 , "no  category  image  is  uploaded")
    Image = await uploadOnCloudinary(categoryImageLocalPath);
  }

  // if(!Image){
  //   throw new ApiError(408 , "failed  to  upload  image to  cloud ")
  // }

  const existing = await Category.findOne({ name });
  if (existing) {
    throw new ApiError(409, "Category already exists");
  }

  console.log(name, Image?.url);
  const category = await Category.create({
    name,
    image: Image?.url || "no  Image   found",
  });
  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created"));
});

// Get all categories
export const getAllCategories = asyncHandler(async (req, res) => {
  console.log("running");
  const categories = await Category.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "All categories"));
});

// export const getAllProduct = asyncHandler(async(req , res) => {

//     const product = await Product.find({}).populate("category").populate("vendor");
//     return res
//     .status(200)
//     .json( new ApiResponse (200 , product , "all  the product"));
//   }
// )

export const getAllProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate("category")
    .populate("vendor");

  // Transform subCategory ID → name
  const transformedProducts = products.map((product) => {
    const subCatId = product.subCategory;

    // Check if subCategory exists inside category
    if (
      subCatId &&
      product.category &&
      Array.isArray(product.category.sub_category)
    ) {
      const foundSubCat = product.category.sub_category.find(
        (sub) => sub._id.toString() === subCatId
      );

      // Replace subCategory ID with name if found
      if (foundSubCat) {
        // Shallow copy to avoid mutating Mongoose object
        return {
          ...product.toObject(),
          subCategory: foundSubCat.name,
        };
      }
    }

    return product;
  });

  return res
    .status(200)
    .json(new ApiResponse(200, transformedProducts, "All the products"));
});

export const getAllVendorProduct = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id);

  const vendor = await Vendor.findOne({ userId: req.user?._id });

  // Check if user exists and is a vendor
  // if (!user || user.role !== "vendor") {
  //   throw new ApiError(403, "Access denied. You are not a vendor.");
  // }

  // Fetch products created by this vendor
  const products = await Product.find({ vendor: vendor._id }).populate(
    "category"
  );

  if (!products || products.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No products found for this vendor."));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully."));
});

export const deleteProductById = asyncHandler(async (req, res) => {
  const user = req.user; // assuming you attached user info via auth middleware
  const { productId } = req.params;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if user is allowed to delete
  const isVendorOwner =
    user.role === "vendor" && product.vendor.toString() === user._id.toString();
  const isAdmin = user.role === "admin";

  if (!isVendorOwner && !isAdmin) {
    throw new ApiError(403, "You are not authorized to delete this product");
  }

  // Delete the product
  await product.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

// Create Subcategory
export const createSubcategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const categoryId = req.params.categoryId;

  // const user = req.user
  // const isAdmin = user.role === "admin";

  // if ( !isAdmin) {
  //   throw new ApiError(403, "You are not authorized (only  admin)");
  // }

  if (!name) {
    throw new ApiError(400, "Subcategory name is required");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check for duplicate subcategory
  const isDuplicate = category.sub_category.some(
    (sub) => sub.name.toLowerCase() === name.toLowerCase()
  );
  if (isDuplicate) {
    throw new ApiError(409, "Subcategory already exists");
  }

  category.sub_category.push({ name });
  await category.save();

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Subcategory added successfully"));
});

export const getVendorPhoneNumbers = asyncHandler(async (req, res) => {
  console.log("hadjkfakj");
  const vendor = await Vendor.findOne({ userId: req.user.id });
  console.log(vendor);

  if (!vendor) throw new ApiError(404, "Vendor not found");

  const detail = await ProductDetail.findOne({ vendor: vendor._id });

  console.log(detail, detail.phonenos);

  const phonenos = detail?.phonenos || [];

  return res
    .status(200)
    .json(new ApiResponse(200, phonenos, "Vendor phone numbers"));
});

export const updatedActiveProduct = asyncHandler(async (req, res) => {
  //get  id of  product
  //get  this  plan and  product limit
  //then   in product  find   how many product of  vendor is   active
  //make  active if  less than   product limit

  const userId = req.user._id;

  const vendor = await Vendor.findOne({ userId: userId });

  const { isActive } = req.body;
  const productID = req.params.productID; //now   addind  .productID  gives   {productID : 'some  id'}
  //but  adding  that give   just  string

  console.log(userId , "vendor" , vendor ,"\n" , productID) ;
  

  if (isActive == true) {

    const now = new Date();
    const plan = await MySubscription.findOne({
      vendor: vendor._id,
      startDate: { $lte: now },
      endDate: { $gte: now },
      paymentStatus: "success",
    })
      .sort({ createdAt: -1 })
      .populate("sub");
    if (!plan) throw new ApiError(404, "No active subscription found");

    const productimit = plan.remainingProductCount;

    //get  all   the  product
    const products = await Product.find({ vendor: vendor._id });

    if (!products || products.length === 0) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No products found for this vendor."));
    }

    //now  to  find the   the   current  active  product ittrate   through products  chekc active   and  make  cnt++

    let cnt = 0;
    // const activeProductCount = products.filter(p => p.isActive === true).length;

    products.forEach((ele) => {
      if (ele.isActive == true) {
        cnt++;
      }
    });

    if (cnt >= plan.remainingProductCount) {
      return res.status(200).json(new ApiError(400, "max    limit  reached"));
    }

    const newProduct = await Product.findById(productID);
    newProduct.isActive = true;

    await newProduct.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Updated  the product"));
  } else {
    //for  making  false  no   chnges  to  check  req;

    const newProduct = await Product.findById(productID);
    newProduct.isActive = false;

    await newProduct.save();

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Updated  the product"));
  }
});



export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Destructure only the allowed fields from req.body
  const {
    name,
    images,
    description,
    quantity,
    unit,
    price,
    category,
    subCategory,
    vendor,
    phoneno,
    highlight,   // <-- add this
  } = req.body;

  // Find the product by ID
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Update only allowed fields
  if (name !== undefined) product.name = name;
  if (images !== undefined) product.images = images;
  if (description !== undefined) product.description = description;
  if (quantity !== undefined) product.quantity = quantity;


  if (unit !== undefined) product.unit = unit; // ✅ removed validation
  if (price !== undefined) product.price = price;
  if (category !== undefined) product.category = category;
  if (subCategory !== undefined) product.subCategory = subCategory;
  if (vendor !== undefined) product.vendor = vendor;
  if (phoneno !== undefined) product.phoneno = phoneno;
  if (highlight !== undefined) product.highlight = highlight; // <-- new line

  // 🚫 Do NOT update isActive or isTrending here

  // Save updated product
  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});


export const updateProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const files = req.files?.productImage;
  if (!files || files.length === 0) throw new ApiError(400, "No product image files uploaded");

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Delete old images
  if (product.images && product.images.length > 0) {
    for (const oldImageUrl of product.images) {
      await deleteFromCloudinaryByUrl(oldImageUrl);
    }
  }

  // Upload new images
  const uploadedImages = [];
  for (const imageFile of files) {
    const uploadedImage = await uploadOnCloudinary(imageFile.path);
    if (uploadedImage) {
      uploadedImages.push(uploadedImage.url);
    }
  }

  if (uploadedImages.length === 0) throw new ApiError(500, "Failed to upload any images");

  product.images = uploadedImages;
  await product.save();

  res.status(200).json(new ApiResponse(200, product, "Product images updated successfully"));
});


export const addNewProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const files = req.files?.productImage;
  if (!files || files.length === 0) {
    throw new ApiError(400, "No product image files uploaded");
  }

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // ✅ Upload new images (without deleting old ones)
  const uploadedImages = [];
  for (const imageFile of files) {
    const uploadedImage = await uploadOnCloudinary(imageFile.path);
    if (uploadedImage) {
      uploadedImages.push(uploadedImage.url);
    }
  }

  if (uploadedImages.length === 0) {
    throw new ApiError(500, "Failed to upload any images");
  }

  // ✅ Append new images instead of replacing
  product.images.push(...uploadedImages);

  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product images updated successfully"));
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const { id } = req.params;          // product ID
  const { imageUrl } = req.body;      // image to delete

  if (!imageUrl) throw new ApiError(400, "Image URL is required");

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");

  // Check if the image exists in product
  if (!product.images.includes(imageUrl)) {
    throw new ApiError(404, "Image not found in product");
  }

  // Delete from Cloudinary
  await deleteFromCloudinaryByUrl(imageUrl);

  // Remove from product.images
  product.images = product.images.filter((img) => img !== imageUrl);

  await product.save();

  res
    .status(200)
    .json(new ApiResponse(200, product, "Product image deleted successfully"));
});


// 1. New Arrivals
export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort({ createdAt: -1 }) // newest first
    .limit(10) // limit to latest 10, adjust as needed
    .populate("category")
    .populate("vendor");

  res.status(200).json(new ApiResponse(200, products, "New arrivals fetched"));
});

// 2. Best Sellers
export const getBestSellers = asyncHandler(async (req, res) => {
  const enquiryCounts = await Enquiry.aggregate([
    {
      $group: {
        _id: "$product",
        enquiryCount: { $sum: 1 },
      },
    },
    {
      $sort: { enquiryCount: -1 },
    },
    {
      $limit: 10, // top 10 best sellers
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $replaceRoot: { newRoot: "$product" },
    },
  ]);

  res.status(200).json(new ApiResponse(200, enquiryCounts, "Best sellers fetched"));
});


export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid product ID format.");
  }

  console.log("[INFO] Fetching product with ID:", id);

  const product = await Product.findById(id)
    .populate("category") // optional: select only necessary fields
    .populate("vendor");

  if (!product) {
    throw new ApiError(404, "Product not found.");
  }

  return res.status(200).json(
    new ApiResponse(200, product, "Product fetched successfully.")
  );
});



//category update
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // optional image update
  let categoryImageLocalPath;
  if (req.files?.catImage?.[0]) {
    categoryImageLocalPath = req.files.catImage[0].path;
    const Image = await uploadOnCloudinary(categoryImageLocalPath);
    category.image = Image?.url || category.image;
  }

  if (name) category.name = name;

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});


export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category deleted successfully"));
});


export const deleteSubCategory = asyncHandler(async (req, res) => {
  const { id, subId } = req.params;

  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  category.sub_category = category.sub_category.filter(
    (sub) => sub._id.toString() !== subId
  );

  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Subcategory deleted successfully"));
});
