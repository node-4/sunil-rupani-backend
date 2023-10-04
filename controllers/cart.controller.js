const Cart = require('../models/cart.model');
exports.getItemInCartOfUser = async (req, res, next) => {
    try {
        const cart = await Cart.findOne({ $or: [{ user: req.params.id }, { astrologer: req.params.id }] });
        if (!cart) {
            return res.status(200).json({ success: false, msg: "cart", cart: {} });
        } else {
            console.log(cart);
            const cartResponse = await getCartResponse(cart, req.params.id);
            return res.status(200).json({ success: true, msg: "cart", cart: cartResponse });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
};
exports.updateItemInCartOfUser = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await Cart.findById(req.params.id);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }
        if (quantity > 1) {
            cartItem.quantity -= 1;
            let updatedCartItem = await cartItem.save();
        } else if (quantity == 1) {
            let updatedCartItem = await cartItem.remove();
        } else {
            return res.status(400).json({ message: "Product not found" });
        }

        return res.status(200).json({
            message: "Cart item updated",
            data: updatedCartItem,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.addToCart = async (req, res, next) => {
    try {
        console.log("000000000000", req.user);
        const productId = req.body.productId;
        if ((req.user.role == "astrologer") == true) {
            let cart = await Cart.findOne({ astrologer: req.user._id });
            if (!cart) {
                let products = [];
                let obj = { productId: productId, quantity: req.body.quantity };
                products.push(obj);
                cart = await Cart.create({ astrologer: req.user._id, products: products });
                return res.status(200).json({ msg: "Product added to cart", data: cart });
            } else {
                const productIndex = cart.products.findIndex((cartProduct) => {
                    return cartProduct.productId.toString() == productId;
                });
                if (productIndex < 0) {
                    cart.products.push({ productId });
                } else {
                    cart.products[productIndex].quantity = req.body.quantity; // Fix: Use assignment operator (=) here
                }
                await cart.save();
                return res.status(200).json({ msg: "Product added to cart", data: cart });
            }
        }
        if ((req.user.role == "user") == true) {
            let cart = await Cart.findOne({ user: req.user._id });
            if (!cart) {
                let products = [];
                let obj = { productId: productId, quantity: req.body.quantity };
                products.push(obj);
                cart = await Cart.create({ user: req.user._id, products: products });
                return res.status(200).json({ msg: "Product added to cart", data: cart });
            } else {
                const productIndex = cart.products.findIndex((cartProduct) => {
                    return cartProduct.productId.toString() == productId;
                });
                if (productIndex < 0) {
                    cart.products.push({ productId });
                } else {
                    cart.products[productIndex].quantity = req.body.quantity; // Fix: Use assignment operator (=) here
                }
                await cart.save();
                return res.status(200).json({ msg: "Product added to cart", data: cart });
            }
        }
    } catch (error) {
        next(error);
    }
};
const getCartResponse = async (cart, userId) => {
    try {
        await cart.populate({ path: "products.productId", select: { reviews: 0 } });
        let discount = 0, shipping = 10;
        const cartResponse = cart.toObject();
        console.log(cartResponse);
        let total = 0, subTotal = 0;
        cartResponse.products.forEach((cartProduct) => {
            cartProduct.subTotal = cartProduct.productId.price * cartProduct.quantity;
            cartProduct.discount = 0;
            subTotal += cartProduct.subTotal;
            discount += cartProduct.discount;
        });
        cartResponse.discount = discount;
        cartResponse.subTotal = subTotal;
        cartResponse.shipping = shipping;
        total = subTotal + shipping;
        cartResponse.total = total;
        return cartResponse;
    } catch (error) {
        throw error;
    }
};
exports.addAddresstoCart = async (req, res) => {
    try {
        let findCart;
        if ((req.user.role == "astrologer") == true) {
            findCart = await Cart.findOne({ astrologer: req.user._id });
        }
        if ((req.user.role == "user") == true) {
            findCart = await Cart.findOne({ user: req.user._id });
        }
        if (findCart) {
            let update1 = await Cart.findByIdAndUpdate({ _id: findCart._id }, { $set: req.body }, { new: true });
            return res.status(200).json({ status: 200, message: "Address add to cart Successfully.", data: update1 })
        } else {
            return res.status(404).json({ status: 404, message: "Cart is empty.", data: {} });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: 500, message: "Server error" + error.message });
    }
};