import { Router } from "express";
import{ registerUser , logoutUser ,registerVendor  ,loginUser , refreshToken, getUserDashboard, updateUserProfile, addToFavorites, removeFromFavorites, getUserFavorites} from "../controller/user.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import  {upload}  from "../middleware/multer.middleware.js";

const router = Router();

router.route('/register').post(registerUser);
router.route('/register-vendor').post(
    upload.single('companyDocuments')
    ,registerVendor);
router.route('/logout').post(authenticateUser , logoutUser);
router.route('/login').post(  loginUser);
router.route('/refresh-token').post(refreshToken)

// User dashboard and profile routes (require authentication)
router.route('/dashboard').get(authenticateUser, getUserDashboard);
router.route('/profile').put(authenticateUser, updateUserProfile);

// User favorites routes (require authentication)
router.route('/favorites')
  .post(authenticateUser, addToFavorites)
  .get(authenticateUser, getUserFavorites);

router.route('/favorites/:productId')
  .delete(authenticateUser, removeFromFavorites);

export default router;