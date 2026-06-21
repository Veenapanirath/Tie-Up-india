import { Router } from "express";
import { addPlan, deletePlan, updatePlan ,setTrendingProduct ,getTrendingProducts , getVendorDetails , getVendorList,
    updateMySubscription,
    toggleTrendingCategory,
    getAdminDashboardStats,
    createAd,
    getAds,
    deleteAds
} from "../controller/admin.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { runManualCleanup } from "../utils/scheduler.js";
const router =  Router();


router.route("/add-plan").post(addPlan);
router.route("/:id/update-plan").put(updatePlan);
router.route("/:id/delete-plan").delete(deletePlan);
router.route("/vendor-list").get(getVendorList);//vendor detail
router.route("/:id/vendor-detail").get(getVendorDetails);//vendor detail
// PATCH /api/subscription/:id
router.patch("/:id", updateMySubscription)

// Admin Dashboard
router.route("/dashboard").get(getAdminDashboardStats);

router.put("/product/:id/set-trending", setTrendingProduct);  // mark as trending
router.get("/product/trending", getTrendingProducts);  // get trending products


router.patch("/toggle-trending/:id", toggleTrendingCategory);


//ADS
router.post(
    "/create-ad",
 // only admin should pass here
    upload.fields([{ name: "adImage", maxCount: 1 }]),
    createAd
  );
  
  // Public: Get Active Ads
  router.get("/ads", getAds);

  
  router.delete("/ads/:id", deleteAds);

// Cleanup routes
router.post("/cleanup-temp", (req, res) => {
  try {
    runManualCleanup();
    res.json({ 
      success: true, 
      message: "Manual cleanup initiated successfully" 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error running manual cleanup",
      error: error.message 
    });
  }
});

export default router