const { application } = require("express");
const media = require("../controllers/media.controller");
const { isAuthenticated } = require("../controllers/auth.controller");

module.exports = (app) => {
    // app.post("/api/v1/admin/media", media.create);
    app.put("/api/v1/admin/media/:id", media.update);
    app.get("/api/v1/admin/media/:id", media.getById);
    app.get("/api/v1/admin/media", media.get);

    //users
    app.post("/api/v1/media", [isAuthenticated], media.create);
    app.put("/api/v1/media/:id", [isAuthenticated], media.update);
    app.get("/api/v1/media/:id", media.getById);
    app.get("/api/v1/media", media.get);
};
