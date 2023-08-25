const app = require("express");
const path = require("path");
const router = app.Router();
var multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: process.env.CLOUD_NAME, api_key: process.env.CLOUD_KEY, api_secret: process.env.CLOUD_SECRET, });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "sunilRupani/product", allowed_formats: ["jpg", "avif", "webp", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });

const {
  addBanner,
  getBanner,
  editBanner,
  deleteBanner,
} = require("../controllers/BannerController");

router.post("/addBanner", upload.single('image'), addBanner);
router.get("/getBanner", getBanner);
router.post("/editBanner/:id", editBanner);
router.delete("/deleteBanner/:id", deleteBanner);

module.exports = router;
