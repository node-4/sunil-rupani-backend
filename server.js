const express = require("express");
const cors = require("cors");
const app = express();
const compression = require("compression");
const mongoose = require("mongoose");
// const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./controllers/errorController");
require("dotenv").config();
const path = require("path");
const serverless = require("serverless-http");
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// app.use(cookieParser());
app.use(cors());
app.use(compression());
const PORT = process.env.PORT || 3002;
const DB_URI = process.env.DB_URI;
app.get("/home", (req, res) => {
    res.send("Hello World!");
});

app.use("/", require("./routes/router"));
// const term = require("./routes/terms.route");
// console.log(term);

require("./routes/media.route")(app);
require("./routes/payment.route")(app);

require("./routes/productReview.route")(app);

app.all("*", (req, res, next) => {
    res.send("This Route is not registered!! ❗");
});

app.use(globalErrorHandler);

const Main = async () => {
    try {
        mongoose
            .connect(DB_URI)
            .then(() => {
                console.log("Db conneted succesfully", DB_URI);
            })
            .catch((err) => {
                console.log(err);
            });
        app.listen(PORT, async () => {
            console.log(`server started ON ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = { handler: serverless(app) };
// //file upload

// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/public/uploads');
//   },9

//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// });
// const upload1 = multer({ storage: storage }).single("user_file");
// app.post("/upload", (req, res) => {
//   console.log(req.data)
//   upload1(req, res, (err) => {
//     if (err) {
//       res.status(400).send("Something went wrong!");
//     }
//     res.send(req.file);
//   });
// });

Main();
