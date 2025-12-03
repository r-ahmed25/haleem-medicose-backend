import Coupon from '../models/Coupon.js';
export  const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({userID: req.user._id, isActive: true });  
        res.json(coupon || null);
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).send("Server error");
    }       
}

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon 
            .findOne({ code: code, isActive: true, userID: req.user._id, expiryDate: { $gt: new Date() } });
        if (!coupon) {
            return res.status(404).json({ message: "Invalid or expired coupon" });
        }

        res.status(200).json(coupon);
    } catch (error) {
        console.error("Error validating coupon:", error);
        res.status(500).send("Server error");
    }
}