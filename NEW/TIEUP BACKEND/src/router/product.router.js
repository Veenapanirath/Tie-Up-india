import { Router } from "express";
import  {authenticateUser}
from "../middleware/auth.middleware.js"
import  {isVendorOrAdmin}
from "../middleware/isVendorOrAdmin.middleware.js"
import {addProduct,
    createCategory,
    getAllCategories,
    getAllProduct,
    getAllVendorProduct,
    deleteProductById,
    createSubcategory,
    getVendorPhoneNumbers,
    updatedActiveProduct,
    updateProduct,
    updateProductImage,
    getNewArrivals,
    getBestSellers,
    getProductById,
    deleteCategory,
    deleteSubCategory,
    updateCategory,
    addNewProductImage,
    deleteProductImage,
    
} from "../controller/product.controller.js"
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.route('/add-product').post(authenticateUser ,isVendorOrAdmin ,
    upload.fields([
        {
            name: "productImage", 
            maxCount: 10  // Changed from 1 to 10 to support multiple images
        },
    ])
    ,addProduct)

router.route('/add-category').post(authenticateUser ,
    upload.fields([
        {
            name : "catImage",
            maxCount:1
        }
    ])
    ,createCategory )

router.route('/get-category').get( getAllCategories )

router.route( '/get-product').get(getAllProduct)
router.route('/get-product/:id').get(getProductById)
router.route( '/get-phoneno').get( authenticateUser,getVendorPhoneNumbers)

router.route('/get-vendor-all-product').get(authenticateUser , getAllVendorProduct)
router.route('/delete-product/:productId').delete(authenticateUser , isVendorOrAdmin , deleteProductById)


// ✅ delete single product image
router.delete("/delete-image/:id", authenticateUser, isVendorOrAdmin, deleteProductImage);
router.route('/:categoryId/add-subCategory').put(authenticateUser,isVendorOrAdmin , createSubcategory)


router.route('/updae-active/:productID').put(authenticateUser , updatedActiveProduct)

router.put("/update/:id", authenticateUser, updateProduct);


router.route('/update-image/:id').put(authenticateUser ,isVendorOrAdmin ,
    upload.fields([
        {
            name: "productImage", 
            maxCount: 10  // Changed from 1 to 10 to support multiple images
        },
    ])
    ,addNewProductImage)

router.route('/new-arrivals').get( getNewArrivals) 
router.route('/best-sellers').get( getBestSellers) 



//category
router.put(
    "/update-category/:id",
    authenticateUser,
    upload.fields([{ name: "catImage", maxCount: 1 }]),
    updateCategory
  );
  
  router.delete("/delete-category/:id", authenticateUser, deleteCategory);
  

  router.delete("/delete-subcategory/:id/:subId", authenticateUser, deleteSubCategory);


export default router;
