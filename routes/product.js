const app = require("express");
const path = require("path");
const router = app.Router();

const product = require("../controllers/productControllers");
var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.CLOUD_KEY, api_secret: process.env.CLOUD_SECRET, });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "sunilRupani/product", allowed_formats: ["jpg", "avif", "webp", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });
// console.log(upload);
router.post("/products", upload.array("image"), product.addproduct);
router.get("/getProduct", product.getProducts);
router.get("/products/:id", product.getProduct);
router.get("/getPopularProducts", product.getPopularProducts);
router.get("/recommended-products/:id", product.getRecommendedProducts);
router.put("/editProduct/:id", product.editProduct);
router.delete("/deleteProduct/:id", product.deleteProduct);

module.exports = router;
