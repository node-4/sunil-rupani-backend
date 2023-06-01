const router = require("express").Router();

const notification = require("../controllers/NotificationController");
// console.log(notification)
const { isAuthenticated } = require("../controllers/auth.controller");

router.post("/notifications", notification.addNotification);
router.get("/notifications", notification.getAllNotifications);
router.get("/notifications/:id", notification.getNotificationById);

module.exports = router;
