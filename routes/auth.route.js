const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const { isAuthenticated } = require("../controllers/auth.controller");
var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        // console.log(file);
        cb(null, file.originalname);
    },
});

var upload = multer({ storage: storage });
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
router.put("/update-profile/:id", isAuthenticated, authController.updateUserProfile);
router.get("/view-user-profiles/:id", authController.GetUserProfiles);
module.exports = router;
