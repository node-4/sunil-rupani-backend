const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        nickName: {
            type: String,
        },
        religion: {
            type: String,
        },
        created: {
            type: String,
            default: new Date().toISOString(),
        },
        gender: {
            type: String,
        },
        password: {
            type: String,
        },
        confirmpassword: {
            type: String,
        },
        address: {
            type: String,
            default: "",
        },
        address1: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            default: "",
        },
        mobile: {
            type: String,
            default: "",
        },
        profileImage: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            default: "User",
        },
        country: {
            type: String,
            default: "",
        },
        state: {
            type: String,
            default: "",
        },
        district: {
            type: String,
            default: "",
        },
        pincode: {
            type: String,
            default: "",
        },
        otp: {
            type: String,
            default: "",
        },
        language: {
            type: [String],
            default: [],
        },
        desc: {
            type: String,
            default: "",
        },
        rashi: {
            type: String,
            default: "",
        },
        skills: {
            type: [String],
            default: [],
        },
        birthDate: {
            type: String,
            default: "",
        },
        birthTime: {
            type: String,
            default: "",
        },
        birthCity: {
            type: String,
            default: "",
        },
        birthCountry: {
            type: String,
            default: "",
        },
        birthState: {
            type: String,
            default: "",
        },
        birthDistrict: {
            type: String,
            default: "",
        },
        birthPincode: {
            type: String,
            default: "",
        },
        birthLatitude: {
            type: String,
            default: "",
        },
        birthLongitude: {
            type: String,
            default: "",
        },
        birthTimezone: {
            type: String,
            default: "",
        },
        referCode: { type: String },
        refferUser: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        referStatus: {
            type: String,
            default: "unused",
            enum: ["used", "unused"],
        },
        ActiveNotification: { type: Boolean, default: false },
        completeProfile: { type: Boolean, default: false },
        following: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: "astrologer",
        },
    },

    { timestamps: false }
);

// userSchema.pre("save", function (next) {
//     const refer = generateOTP() + this.first_Name;
//     this.ReferCode = refer;
//     console.log("generated referal Code!");
//     next();
// });

module.exports = mongoose.model("User", userSchema);
