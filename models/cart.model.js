const mongoose = require("mongoose");
const cartProductsSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { _id: false })

const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    astrologer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "astrologer",
    },
    billTo: {
        type: String,
    },
    mobileNumber: {
        type: String,
    },
    pinCode: {
        type: String,
    },
    houseNumber: {
        type: String,
    },
    completeAddress: {
        type: String,
    },
    addressType: {
        type: String,
    },
    products: {
        type: [cartProductsSchema]
    },
}, {
    timestamps: true
})
module.exports = mongoose.model("Cart", CartSchema)

// const mongoose = require("mongoose");
// const cartSchema = new mongoose.Schema({
//     product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "product",
//         required: true,
//     },
//     quantity: {
//         type: Number,
//         required: true,
//         default: 1,
//     },
//     userId: {
//         type: String,
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//     },
//     astrologer: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "astrologer",
//     },
//     billTo: {
//         type: String,
//     },
//     mobileNumber: {
//         type: String,
//     },
//     pinCode: {
//         type: String,
//     },
//     houseNumber: {
//         type: String,
//     },
//     completeAddress: {
//         type: String,
//     },
//     addressType: {
//         type: String,
//     },
// });
// module.exports = mongoose.model("Cart", cartSchema);
