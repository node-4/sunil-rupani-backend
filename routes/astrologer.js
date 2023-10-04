const router = require("express").Router();
const { isAuthenticated } = require("../controllers/auth.controller");
const astroControllers = require("../controllers/astrologerControllers");
const admin = require("../controllers/admin");
const product = require("../controllers/productControllers");
const terms = require("../controllers/terms.controller");
const productOrder = require("../controllers/astro-product-order");
const cart = require("../controllers/cart.controller");
var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.CLOUD_KEY, api_secret: process.env.CLOUD_SECRET, });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "sunilRupani/product", allowed_formats: ["jpg", "avif", "webp", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });//cart apis
router.get("/cart/:id", cart.getItemInCartOfUser);
router.post("/cart", isAuthenticated, cart.addToCart);
router.post("/addAddresstoCart", isAuthenticated, cart.addAddresstoCart);

//Blogs
router.get("/blogs/:id", admin.ViewDataBlogs);
router.get("/blogs", admin.GetBlogs);

//products
router.get("/products/:id", product.getProduct);
router.get("/products", product.getProducts);
router.get("/recommended-products/:id", product.getRecommendedProducts);
// product order
router.post("/product-order", productOrder.createCartProductOrder);
router.get("/product-order/:id", productOrder.getCartProductOrderById);
router.get("/product-order", productOrder.getCartProductOrders);
router.put("/product-order/:id", productOrder.updateCartProductOrder);
router.delete("/product-order/:id", productOrder.deleteCartProductOrder);

//profile
router.get("/profile/:id", astroControllers.getAstrolgerById);
router.put(
    "/profile-image/:id",
    upload.single("image"),
    astroControllers.updateProfile1
);
router.put(
    "/profile/:id",

    astroControllers.updateAstrologer
);

//astrologer
router.post("/register", astroControllers.register);
router.post("/verify/:id", astroControllers.verifyOTP);
router.put("/signup/:id", astroControllers.signUpUser);
router.put("/signup2/:id", upload.single('image'), astroControllers.signup2);
router.post("/login", astroControllers.login);
router.post("/loginwithmobile", astroControllers.loginWithMobile);
router.post("/verifymobileotp/:id", astroControllers.verifyMobileOtp);
router.get("/resend-otp/:id", astroControllers.resendOtp);
router.post("/forgotpassword", astroControllers.forgetPassword);
router.put("/resetpassword/:id", astroControllers.resetPassword);
router.get("/view/:id", astroControllers.ViewDataProfiles);
router.get(
    "/search/:key",

    astroControllers.SearchAstroNameLangSkills
);
router.get("/blog", astroControllers.getAllBlogs);
router.delete(
    "/removed/:id",
    isAuthenticated,
    astroControllers.deleteAstroName
);
router.delete(
    "/remove-language",
    isAuthenticated,
    astroControllers.deleteLanguages
);
router.get("/all", astroControllers.GetAllAstro);
router.put("/update/:id", isAuthenticated, astroControllers.updateAstro);
router.get("/:id", astroControllers.getastroById);

//Terms
router.get("/products/:id", product.getProduct);
router.get("/products", product.getProducts);

module.exports = router;
