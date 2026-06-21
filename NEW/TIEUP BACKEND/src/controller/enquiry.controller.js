import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { Enquiry } from "../model/enquiry.model.js";
import { Product } from "../model/product.model.js";
import { Vendor } from "../model/vendor.model.js";

const createEnquiry = asyncHandler(async (req, res) => {
  const { productId, quantity, name, phoneNo, address } = req.body;


  console.log(req.body);
  // Validate required fields
  if (!productId || !quantity) {
    throw new ApiError(400, "Product ID and quantity are required");
  }

  // Check if product exists and has sufficient quantity
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
//   if (product.quantity < quantity) {
//     throw new ApiError(400, "Insufficient product quantity");
//   }

  const enquiryData = {
    product: productId,
    quantity,
    status: "waiting",
  };

  // For authenticated users
  if (req.user) {
    enquiryData.user = req.user._id;
  } else {
    // For guest users, validate additional fields
    if (!name || !phoneNo || !address) {
      throw new ApiError(400, "Name, phone number, and address are required for guest users");
    }
    enquiryData.name = name;
    enquiryData.phoneNo = phoneNo;
    enquiryData.address = address;
  }

  const enquiry = await Enquiry.create(enquiryData);

  if (!enquiry) {
    throw new ApiError(500, "Failed to create enquiry");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, enquiry, "Enquiry created successfully"));
});

const updateEnquiry = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;
  const { quantity, name, phoneNo, address, status } = req.body;

  console.log(req.body);
  
  // Find the enquiry
  const enquiry = await Enquiry.findById(enquiryId);
  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  // Authorization check
  // if (req.user && enquiry.user && enquiry.user.toString() !== req.user._id.toString()) {
  //   throw new ApiError(403, "Unauthorized to update this enquiry");
  // }

  // Validate updates
  if (quantity) {
    const product = await Product.findById(enquiry.product);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    if (product.quantity < quantity) {
      throw new ApiError(400, "Insufficient product quantity");
    }
    enquiry.quantity = quantity;
  }

  // For guest users or updating guest fields
  if (!req.user) {
    if (name) enquiry.name = name;
    if (phoneNo) enquiry.phoneNo = phoneNo;
    if (address) enquiry.address = address;
  }

  // Update status if provided (typically for admins)
  if (status && ["waiting", "in process", "done"].includes(status)) {
    enquiry.status = status;
  }

  const updatedEnquiry = await enquiry.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEnquiry, "Enquiry updated successfully"));
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const { enquiryId } = req.params;

  console.log("enquiry" , enquiryId) ;
  
  // Find the enquiry
  const enquiry = await Enquiry.findById(enquiryId);
  console.log(enquiry);
  
  if (!enquiry) {
    throw new ApiError(404, "Enquiry not found");
  }

  // Authorization check
  if (req.user && enquiry.user && enquiry.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this enquiry");
  }

  await enquiry.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Enquiry deleted successfully"));
});

const AllEnquiry = asyncHandler(async(req ,  res) => {

  const allenq =  await  Enquiry.find({}).populate({
    path :"product",
    populate:{
      path :"vendor",
    }
  })
  .populate("user")
  .sort({ createdAt: -1 });

  // console.log(allenq);
  if(!allenq)
  {
    throw new ApiError(500 , "No   enquirey   found")
  }

  return res.status(200).json(
    new ApiResponse(200 , allenq, "successfully")
  )
})

const getVendorEnquiry = asyncHandler(async(req, res) => {

  console.log("running");
  


const vendor = await   Vendor.findOne({ userId: req.user.id })
if (!vendor) throw new ApiError(404, "Vendor not found");
  
// console.log(vendor);
  const vProduct = await Product.find({
    vendor : vendor._id
  }).select("_id");
  //this  will select the  product of   vendor and  return  id

  

  const allid  = vProduct.map(product => product._id);
  
  console.log(vProduct);
  console.log(allid);


  const  enquiry =  await Enquiry.find({ 
    product: {$in : allid}
  }).populate("user").populate("product")

  return  res.status(200).json(
    new  ApiResponse(200 ,enquiry ,  "all the prodcu")
  )
})
export { createEnquiry, updateEnquiry, deleteEnquiry , AllEnquiry , getVendorEnquiry};