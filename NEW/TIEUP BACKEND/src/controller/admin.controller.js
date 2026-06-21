import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { User } from "../model/user.model.js";
import { Product } from "../model/product.model.js";
import { Vendor } from "../model/vendor.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {  Subscription } from "../model/sub.model.js"
import { Enquiry } from "../model/enquiry.model.js";
import { ProductDetail } from "../model/phone.model.js";
import { MySubscription } from "../model/mySub.model.js";
import mongoose from "mongoose";
import { Category } from "../model/category.model.js";
import { Order } from "../model/order.model.js";
import { Ad } from "../model/ad.model.js";

export const addPlan =  asyncHandler(async(req ,  res) => {

    const {name ,  description , days , amount , productlimit}  = req.body;

    console.log(req.body);
    if(!name || !description || !days || !amount  || !productlimit)
    {
        throw new ApiError(400 , "all   field are  req")
    }
   
    const plan =   await Subscription.create({
     name,
     description,
     days,
     amount,
     productlimit
    }) 

    return  res.status(200).json( new ApiResponse(200 , plan , "plan created sucessfully"))
})


export const updatePlan =  asyncHandler(async(req, res) => {

    const {id} =  req.params;
    console.log("Request Body: ", req.body); 

    console.log("id" ,id);
    
    
    const allowedFiles = ["name",
     "description",
     "days",
     "amount",
     "productlimit"
    ]

    const updatedata = {};


    for (const key of allowedFiles)
    {

        // console.log(key);
        //  console.log(req.body[key]);
        if(req.body[key] != undefined)

        {
            // console.log("key",updatedata[key]);
            
            updatedata[key] = req.body[key];
            // updateData["name"] = "Gold Plan"
        }
    }
    console.log("updated  data -->",updatedata);

    if(Object.keys(updatedata).length <= 0)
    {
        throw new ApiError(410 , "No valid fields provided for update")
    }
    
    const sub = await Subscription.findByIdAndUpdate(  
        id,
        { $set : updatedata},
        {new : true}
    )

    return res.status(200).json( new ApiResponse(200 ,sub , "updated sub" ))

})

// Delete Plan function
export const deletePlan = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid plan ID format");
    }

    console.log(`Attempting to delete plan with ID: ${id}`);

    // Find and delete the plan by ID
    const deletedPlan = await Subscription.findByIdAndDelete(id);

    // If no plan is found with the provided ID, throw an error
    if (!deletedPlan) {
        throw new ApiError(404, "Plan not found");
    }

    console.log("Plan deleted successfully: ", deletedPlan);

    // Return a successful response
    return res.status(200).json(
        new ApiResponse(200, {}, "Plan deleted successfully")
    );
});


// ✅ Admin marks product as trending or not
export const setTrendingProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isTrending } = req.body;

  if (typeof isTrending !== "boolean") {
    throw new ApiError(400, "isTrending must be a boolean");
  }

  const product = await Product.findByIdAndUpdate(
    id,
    { isTrending },
    { new: true }
  );

  if (!product) throw new ApiError(404, "Product not found");

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Trending status updated"));
});

// ✅ Public endpoint to fetch trending products
export const getTrendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isTrending: true }).populate("category").populate("vendor");

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Trending products fetched"));
});


export const getVendorDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id,"sd");

    // Step 1: Validate the vendor ID
    if (!id) {
      return res.status(400).json({ message: "Vendor ID is required in query params." });
    }

    const userInfo = await User.findById(id);
    if (!userInfo) {
      return res.status(404).json({ message: "userInfo." });
    }

    // Step 2: Fetch vendor info
    const vendorInfo = await Vendor.findOne({userId : id});
    if (!vendorInfo) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    console.log(vendorInfo);
    const vendor =  vendorInfo._id;
    
    // Step 3: Fetch all products uploaded by this vendor
    const products = await Product.find({ vendor });

    // Extract all product IDs to fetch enquiries later
    const productIds = products.map(product => product._id);

    // Step 4: Fetch all enquiries related to vendor's products
    const enquiries = await Enquiry.find({ product: { $in: productIds } })
      .populate("user")     // Populate user info (optional)
      .populate("product"); // Populate product info (optional)

    // Step 5: Fetch vendor subscription detail

    const now = new Date();
    
    // const subscription = await Subscription.findOne({ vendor });
    let subscription = null;
     subscription = await MySubscription.findOne({
       vendor: vendor,
       endDate: { $gte: now } // Active subscription only
      
      }).populate("sub").sort({ createdAt: -1 });
        // if (!subscription) subscription = null;

    // Step 6 (Optional): Fetch vendor's product phone numbers from ProductDetail
    const productDetail = await ProductDetail.findOne({ vendor });

    // Step 7: Combine and return all information
    return res.status(200).json({
      vendorInfo,
      products,
      productDetail,     // optional: can omit if not needed
      subscription,
      enquiries
    });

  } catch (error) {
    console.error("Error fetching vendor details:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getVendorList  = asyncHandler(async(req , res) => {

    const   vendorList =  await Vendor.find({});

    if(!vendorList)
    {
        throw new ApiError(400 , "no  vendor  found");
    }

    return res.status(200).json( new ApiResponse(200 , vendorList , "all the  vendor"))
})


export const updateMySubscription = async (req, res) => {
  try {
    const { id } = req.params; // MySubscription _id
    console.log(id);
    
    const updates = req.body;


    // Step 1: Find subscription entry
    const subscription = await MySubscription.findById(id);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    // Step 2: Validate and assign fields (only those present in body)
    if (updates.sub) {
      const plan = await Subscription.findById(updates.sub);
      if (!plan) return res.status(400).json({ message: "Invalid subscription plan ID." });
      subscription.sub = updates.sub;
    }

    if (updates.startDate) subscription.startDate = new Date(updates.startDate);
    if (updates.endDate) subscription.endDate = new Date(updates.endDate);
    if (updates.remainingProductCount !== undefined)
      subscription.remainingProductCount = updates.remainingProductCount;
    if (updates.amountPaid !== undefined) subscription.amountPaid = updates.amountPaid;


    // Step 3: Save the updated subscription
    await subscription.save();

    return res.status(200).json({ message: "Subscription updated successfully.", subscription });

  } catch (error) {
    console.error("Error updating subscription:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


export const toggleTrendingCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, "Category not found");

  category.isTrending = !category.isTrending;
  await category.save();

  return res
    .status(200)
    .json(new ApiResponse(200, category, `Category marked as ${category.isTrending ? "Trending" : "Not Trending"}`));
});

// Admin Dashboard Statistics
export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const { timeFilter = "all" } = req.query; // all, 1day, 1month, 1year
  
  let startDate = null;
  const currentDate = new Date();
  
  // Calculate start date based on filter
  switch (timeFilter) {
    case "1day":
      startDate = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));
      break;
    case "1month":
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
      break;
    case "1year":
      startDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
      break;
    default:
      startDate = null; // all time
  }

  try {
    // Build date filter
    const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

    // Get total revenue from orders
    const revenuePipeline = [
      { $match: dateFilter },
      { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
    ];
    const revenueResult = await Order.aggregate(revenuePipeline);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Get active vendors count
    const activeVendorsCount = await Vendor.countDocuments({ isVerified: true });

    // Get products with limited quantity (less than 10)
    const productionLimitedCount = await Product.countDocuments({ 
      ...dateFilter,
      quantity: { $lt: 10 } 
    });

    // Get total enquiries
    const totalEnquiries = await Enquiry.countDocuments(dateFilter);

    // Get new enquiries (waiting status)
    const newEnquiries = await Enquiry.countDocuments({ 
      ...dateFilter,
      status: "waiting" 
    });

    // Get in-process enquiries
    const inProcessEnquiries = await Enquiry.countDocuments({ 
      ...dateFilter,
      status: "in process" 
    });

    // Get completed enquiries
    const completedEnquiries = await Enquiry.countDocuments({ 
      ...dateFilter,
      status: "done" 
    });

    const dashboardStats = {
      totalRevenue,
      activeVendors: activeVendorsCount,
      productionLimited: productionLimitedCount,
      totalEnquiries,
      enquiryBreakdown: {
        new: newEnquiries,
        inProcess: inProcessEnquiries,
        completed: completedEnquiries
      },
      timeFilter,
      period: startDate ? `${startDate.toLocaleDateString()} to ${currentDate.toLocaleDateString()}` : "All Time"
    };

    return res.status(200).json(
      new ApiResponse(200, dashboardStats, "Admin dashboard statistics retrieved successfully")
    );

  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    throw new ApiError(500, "Error fetching dashboard statistics");
  }
});


export const createAd = asyncHandler(async (req, res) => {
  const { title, subtitle, description, ctaText, ctaLink, backgroundColor } = req.body;

  if (!title) throw new ApiError(400, "Ad title is required");

  let adImagePath;
  if (req.files?.adImage?.[0]) {
    adImagePath = req.files.adImage[0].path;
  }

  let imageUrl = "";
  if (adImagePath) {
    const uploadedImage = await uploadOnCloudinary(adImagePath);
    imageUrl = uploadedImage?.url;
  }

  if (!imageUrl) throw new ApiError(400, "Ad image is required");

  const ad = await Ad.create({
    title : title || "",
    subtitle  : subtitle || "",
    description : description || "",
    ctaText : ctaText || "",
    ctaLink : ctaLink || "",
    backgroundColor : backgroundColor || "",
    image: imageUrl,
  });

  return res.status(201).json(new ApiResponse(201, ad, "Ad created successfully"));
});


export const getAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({ isActive: true }).sort({ createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, ads, "Active ads fetched successfully"));
});


export const deleteAds = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log( "id" ,id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json(new ApiResponse(400, {}, "invalid ad id"));
  }

  const ads = await Ad.findByIdAndDelete(id);

  if (!ads) {
    return res.status(404).json(new ApiResponse(404, {}, "ad not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, ads, "ad deleted successfully"));
});