import express from 'express';
const router = express.Router();
import { getCoupon, validateCoupon} from '../controllers/couponController.js';
import { protectedRoute, adminRoute } from '../middleware/productMiddleware.js';        

router.get('/', protectedRoute, getCoupon);

router.get('/validate', protectedRoute, validateCoupon);


export default router;