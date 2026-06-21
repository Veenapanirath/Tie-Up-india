import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRes.js";
import { Vendor } from "../model/vendor.model.js";
import { uploadOnCloudinary , deleteFromCloudinaryByUrl } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { Product } from "../model/product.model.js";
import { Order } from "../model/order.model.js";
import { Enquiry } from "../model/enquiry.model.js";
import { MySubscription } from "../model/mySub.model.js";
import { UserFavorites } from "../model/userFavorites.model.js";
import { Ad } from "../model/ad.model.js";
import { User } from "../model/user.model.js";

// Update vendor details
export const updateVendorDetails = asyncHandler(async (req, res) => {
  // const vendorId = req.user.id;
  const { vendorId } = req.params; 
  const updateData = req.body;

  console.log(vendorId);
  

  // const user = await User.findById(vendorId);
  // console.log(user);
  
  // Remove userId from update data to prevent unauthorized changes
  delete updateData.userId;

  // Check if vendor exists
  const vendor = await Vendor.findOne({ userId: vendorId });
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // Update vendor details
  const updatedVendor = await Vendor.findByIdAndUpdate(
    vendor._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedVendor) {
    throw new ApiError(500, "Error updating vendor details");
  }

  return res.status(200).json(
    new ApiResponse(200, { vendor: updatedVendor }, "Vendor details updated successfully")
  );
});



// ... existing code ...

// Update vendor company documents
// ... existing code ...

// Update vendor company documents
export const updateVendorDocuments = asyncHandler(async (req, res) => {
  // const vendorId = req.user.id;
  
  const { vendorId } = req.params; 
  // Check if vendor exists
  const vendor = await Vendor.findOne({ userId: vendorId });
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // Handle document upload
  const documentFile = req.files?.companyDocument;
  
  if (!documentFile || documentFile.length === 0) {
    throw new ApiError(400, "Company document file is required");
  }

  // Upload document to cloudinary
  const uploadedDocument = await uploadOnCloudinary(documentFile[0].path);
  
  if (!uploadedDocument) {
    throw new ApiError(500, "Failed to upload document to cloudinary");
  }

  const deletedDocument = await deleteFromCloudinaryByUrl(vendor.companyDocuments);
  if (deletedDocument) {
    console.log("Deleted document from cloudinary");
  }

  // Update company documents with cloudinary URL
  const updatedVendor = await Vendor.findByIdAndUpdate(
    vendor._id,
    { $set: { companyDocuments: uploadedDocument.url } },
    { new: true, runValidators: true }
  );

  if (!updatedVendor) {
    throw new ApiError(500, "Error updating vendor documents");
  }

  return res.status(200).json(
    new ApiResponse(200, { 
      vendor: updatedVendor,
      documentUrl: uploadedDocument.url 
    }, "Vendor documents updated successfully")
  );
});



// ... existing code ...

// Delete everything related to a vendor (COMPLETE VENDOR CLEANUP)
export const deleteVendorAndAllData = asyncHandler(async (req, res) => {
  // const vendorId = req.user.id;
  const { vendorId } = req.params; 

  // Check if vendor exists
  const vendor = await Vendor.findOne({ userId: vendorId });
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Delete all products by this vendor
    const products = await Product.find({ vendor: vendor._id });
    if (products.length > 0) {
      // Delete product images from cloudinary first
      for (const product of products) {
        if (product.images && product.images.length > 0) {
          for (const imageUrl of product.images) {
            await deleteFromCloudinaryByUrl(imageUrl);
          }
        }
      }
      // Delete products
      await Product.deleteMany({ vendor: vendor._id }, { session });
    }

    // 2. Delete all orders related to this vendor's products
    const productIds = products.map(p => p._id);
    if (productIds.length > 0) {
      await Order.deleteMany({ product: { $in: productIds } }, { session });
    }

    // 3. Delete all enquiries for this vendor's products
    if (productIds.length > 0) {
      await Enquiry.deleteMany({ product: { $in: productIds } }, { session });
    }

    // 4. Delete vendor phone details
   

    // 5. Delete vendor subscriptions

    await MySubscription.deleteMany({ vendor: vendor._id }, { session });

    // 6. Delete vendor favorites
    await UserFavorites.deleteMany({ vendor: vendor._id }, { session });

    // 7. Delete vendor ads (if any)
    await Ad.deleteMany({ vendor: vendor._id }, { session });

    // 8. Finally, delete the vendor itself
    await Vendor.findByIdAndDelete(vendor._id, { session });

    // 9. Update user role back to regular user (optional)
    await User.findByIdAndUpdate(
      vendorId,
      { role: "user" },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    return res.status(200).json(
      new ApiResponse(200, {
        deletedProducts: products.length,
        deletedOrders: productIds.length > 0 ? "All related orders deleted" : "No orders to delete",
        deletedEnquiries: productIds.length > 0 ? "All related enquiries deleted" : "No enquiries to delete",
        message: "Vendor and all related data deleted successfully"
      }, "Vendor completely removed from system")
    );

  } catch (error) {
    // If anything fails, rollback all changes
    await session.abortTransaction();
    throw new ApiError(500, `Failed to delete vendor data: ${error.message}`);
  } finally {
    // End the session
    session.endSession();
  }
});