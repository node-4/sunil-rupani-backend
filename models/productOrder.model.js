const mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate");
const schema = mongoose.Schema;
const cartProductsSchema = new schema({
    productId: {
        type: schema.Types.ObjectId,
        ref: "product"
    },
    quantity: {
        type: Number,
        default: 1
    }
}, { _id: false })
const DocumentSchema = schema({
    orderId: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userId",
    },
    astroId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "astrologer",
    },
    products: {
        type: [cartProductsSchema]
    },
    total: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    subTotal: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
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
    orderStatus: {
        type: String,
        enum: ["unconfirmed", "confirmed"],
        default: "unconfirmed",
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
}, { timestamps: true });
DocumentSchema.plugin(mongoosePaginate);
DocumentSchema.plugin(mongooseAggregatePaginate);
module.exports = mongoose.model("productOrder", DocumentSchema);