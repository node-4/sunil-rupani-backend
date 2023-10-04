const productOrder = require("../models/productOrder.model");
const Cart = require('../models/cart.model');
exports.checkoutForProduct = async (req, res) => {
        try {
                if ((req.user.role == "astrologer") == true) {
                        let findOrder = await productOrder.find({ astrologer: req.user._id, orderStatus: "unconfirmed" });
                        if (findOrder.length > 0) {
                                for (let i = 0; i < findOrder.length; i++) {
                                        console.log("-----------");
                                        await productOrder.findByIdAndDelete({ _id: findOrder[i]._id });
                                }
                                let findCart = await Cart.findOne({ astrologer: req.user._id }).populate({ path: "products.productId", select: { reviews: 0 } });
                                if (findCart) {
                                        let discount = 0, shipping = 10, total = 0, subTotal = 0;
                                        const cartResponse = findCart.toObject();
                                        cartResponse.products.forEach((cartProduct) => {
                                                cartProduct.subTotal = cartProduct.productId.price * cartProduct.quantity;
                                                cartProduct.discount = 0;
                                                subTotal += cartProduct.subTotal;
                                                discount += cartProduct.discount;
                                                total += cartProduct.total;
                                        });
                                        cartResponse.discount = discount;
                                        cartResponse.subTotal = subTotal;
                                        cartResponse.astroId = req.user._id;
                                        cartResponse.shipping = shipping;
                                        cartResponse.total = subTotal + shipping;
                                        cartResponse.orderId = await reffralCode();
                                        let saveOrder = await productOrder.create(cartResponse);
                                        return res.status(200).json({ msg: "product added to cart", data: saveOrder });
                                }
                        } else {
                                let findCart = await Cart.findOne({ astrologer: req.user._id }).populate({ path: "products.productId", select: { reviews: 0 } });
                                if (findCart) {
                                        let discount = 0, shipping = 10, total = 0, subTotal = 0;
                                        const cartResponse = findCart.toObject();
                                        cartResponse.products.forEach((cartProduct) => {
                                                cartProduct.subTotal = cartProduct.productId.price * cartProduct.quantity;
                                                cartProduct.discount = 0;
                                                subTotal += cartProduct.subTotal;
                                                discount += cartProduct.discount;
                                                total += cartProduct.total;
                                        });
                                        cartResponse.discount = discount;
                                        cartResponse.subTotal = subTotal;
                                        cartResponse.astroId = req.user._id;
                                        cartResponse.shipping = shipping;
                                        cartResponse.total = subTotal + shipping;
                                        cartResponse.orderId = await reffralCode();
                                        let saveOrder = await productOrder.create(cartResponse);
                                        return res.status(200).json({ msg: "product added to cart", data: saveOrder });
                                }
                        }
                }
                if ((req.user.role == "user") == true) {
                        let findOrder = await productOrder.find({ astrologer: req.user._id, orderStatus: "unconfirmed" });
                        if (findOrder.length > 0) {
                                for (let i = 0; i < findOrder.length; i++) {
                                        console.log("-----------");
                                        await productOrder.findByIdAndDelete({ _id: findOrder[i]._id });
                                }
                                let findCart = await Cart.findOne({ user: req.user._id }).populate({ path: "products.productId", select: { reviews: 0 } });
                                if (findCart) {
                                        let discount = 0, shipping = 10, total = 0, subTotal = 0;
                                        const cartResponse = findCart.toObject();
                                        cartResponse.products.forEach((cartProduct) => {
                                                cartProduct.subTotal = cartProduct.productId.price * cartProduct.quantity;
                                                cartProduct.discount = 0;
                                                subTotal += cartProduct.subTotal;
                                                discount += cartProduct.discount;
                                                total += cartProduct.total;
                                        });
                                        cartResponse.discount = discount;
                                        cartResponse.coupan = coupan;
                                        cartResponse.subTotal = subTotal;
                                        cartResponse.userId = req.user._id;
                                        cartResponse.shipping = shipping;
                                        cartResponse.total = subTotal - coupan + shipping;
                                        cartResponse.orderId = await reffralCode();
                                        let saveOrder = await productOrder.create(cartResponse);
                                        return res.status(200).json({ msg: "product added to cart", data: saveOrder });
                                }
                        } else {
                                let findCart = await Cart.findOne({ user: req.user._id }).populate({ path: "products.productId", select: { reviews: 0 } });
                                if (findCart) {
                                        let discount = 0, shipping = 10, total = 0, subTotal = 0;
                                        const cartResponse = findCart.toObject();
                                        cartResponse.products.forEach((cartProduct) => {
                                                cartProduct.subTotal = cartProduct.productId.price * cartProduct.quantity;
                                                cartProduct.discount = 0;
                                                subTotal += cartProduct.subTotal;
                                                discount += cartProduct.discount;
                                                total += cartProduct.total;
                                        });
                                        cartResponse.discount = discount;
                                        cartResponse.coupan = coupan;
                                        cartResponse.subTotal = subTotal;
                                        cartResponse.userId = req.user._id;
                                        cartResponse.shipping = shipping;
                                        cartResponse.total = subTotal - coupan + shipping;
                                        cartResponse.orderId = await reffralCode();
                                        let saveOrder = await productOrder.create(cartResponse);
                                        return res.status(200).json({ msg: "product added to cart", data: saveOrder });
                                }
                        }
                }

        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.cancelOrderForProduct = async (req, res) => {
        try {
                let findUserOrder = await productOrder.findOne({ orderId: req.params.orderId });
                if (findUserOrder) {
                        return res.status(201).json({ message: "Payment failed.", status: 201, orderId: req.params.orderId });
                } else {
                        return res.status(404).json({ message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.successOrderForProduct = async (req, res) => {
        try {
                let findUserOrder = await productOrder.findOne({ orderId: req.params.orderId });
                if (findUserOrder) {
                        let update = await productOrder.findByIdAndUpdate({ _id: findUserOrder._id }, { $set: { orderStatus: "confirmed", paymentStatus: "paid" } }, { new: true });
                        let deleteCart = await Cart.findOneAndDelete({ user: findUserOrder.user });
                        if (deleteCart) {
                                return res.status(200).json({ message: "Payment success.", status: 200, data: update });
                        }
                } else {
                        return res.status(404).json({ message: "No data found", data: {} });
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};

exports.getProductOrders = async (req, res, next) => {
        try {
                if ((req.user.role == "astrologer") == true) {
                        let findOrder = await productOrder.find({ astroId: req.user._id, orderStatus: "confirmed" }).populate([{ path: "products.productId", select: { reviews: 0 } }]);
                        if (findOrder.length == 0) {
                                return res.status(404).json({ status: 404, message: "Orders not found", data: {} });
                        }
                        return res.status(200).json({ status: 200, msg: "orders of user", data: findOrder })
                }
                if ((req.user.role == "user") == true) {
                        let findOrder = await productOrder.find({ userId: req.user._id, orderStatus: "confirmed" }).populate([{ path: "products.productId", select: { reviews: 0 } }]);
                        if (findOrder.length == 0) {
                                return res.status(404).json({ status: 404, message: "Orders not found", data: {} });
                        }
                        return res.status(200).json({ status: 200, msg: "orders of user", data: findOrder })
                }
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
exports.getProductOrderbyId = async (req, res, next) => {
        try {
                const orders = await productOrder.findById({ _id: req.params.id }).populate([{ path: "products.productId", select: { reviews: 0 } },]);
                if (!orders) {
                        return res.status(404).json({ status: 404, message: "Orders not found", data: {} });
                }
                return res.status(200).json({ status: 200, msg: "orders of user", data: orders })
        } catch (error) {
                console.log(error);
                return res.status(501).send({ status: 501, message: "server error.", data: {}, });
        }
};
const reffralCode = async () => {
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let OTP = '';
        for (let i = 0; i < 9; i++) {
                OTP += digits[Math.floor(Math.random() * 36)];
        }
        return OTP;
}
