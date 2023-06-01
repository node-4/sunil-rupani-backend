const user = require("../controllers/userController");
const router = require("express").Router();

router.put("/profiles/:id", user.updateUserProfile);
router.get("/profiles/:id", user.getProfile);
module.exports = router;
