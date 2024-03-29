const birthDetails = require("../models/birthDetails");
const Astrologer = require("../models/astrologer");
const User = require("../models/User");
const Notification = require("../models/notification");

exports.updateBirthDetails = async (req, res) => {
    try {
        const birthDetails = await User.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!birthDetails) {
            return res.status(400).json({ message: "Birth Details not found" });
        }
        const resObj = {
            firstName: birthDetails.firstName,
            lastName: birthDetails.lastName,
            email: birthDetails.email,
            gender: birthDetails.gender,
            birthDate: birthDetails.birthDate,
            birthTime: birthDetails.birthTime,
            birthCountry: birthDetails.birthCountry,
            birthCity: birthDetails.birthCity,
        };

        return res.status(200).json({
            message: "Birth Details Updated",
            data: resObj,
        });
        // res.status(201).json({ message: birthDetails });
    } catch (error) {
        return res.status(400).json({ message: error.message, status: false });
    }
};

exports.getBirthDetails = async (req, res) => {
    try {
        const birthDetails = await User.findById(req.params.id).lean().select({
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            gender: 1,
            birthDate: 1,
            birthTime: 1,
            birthCountry: 1,
            birthCity: 1,
        });
        if (!birthDetails) {
            return res.status(404).json({ message: "Birth Details not found" });
        }
        return res.status(200).json({
            data: birthDetails,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};
exports.getReferCodeOfUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .lean()
            .select({ referCode: 1 });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({
            data: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};

exports.getReferCodeOfAstrologer = async (req, res) => {
    try {
        const user = await Astrologer.findById(req.params.id)
            .lean()
            .select({ referCode: 1 });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        return res.status(200).json({
            data: user,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};
