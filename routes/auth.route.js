const router = require("express").Router();
require("dotenv").config();
const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../controllers/auth.controller");
var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.CLOUD_KEY, api_secret: process.env.CLOUD_SECRET, });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "sunilRupani/product", allowed_formats: ["jpg", "avif", "webp", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });
router.post("/register", authController.register);
router.post("/verify/:id", authController.verifyOTP);
router.put("/signUp/:id", authController.signUpUser);
router.post("/login", authController.login);
router.post("/resend-otp/:id", authController.resendOtp);
router.post("/socialLogin", authController.socialLogin);
router.put("/signup2/:id", authController.signup2);
router.post("/loginwithmobile", authController.loginWithMobile);
router.post("/verifymobileotp/:id", authController.verifyMobileOtp);
router.post("/forgotpassword", authController.forgetPassword);
router.patch("/resetpassword/:id", authController.resetPassword);
router.put("/update-profile/:id", upload.single('image'), authController.updateUserProfile);
router.get("/view-user-profiles/:id", authController.GetUserProfiles);
module.exports = router;
