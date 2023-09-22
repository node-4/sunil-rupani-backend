// const bookidgen = require("bookidgen");
var newOTP = require("otp-generators");
// const Banner = require('../models/Banner')
// const moment = require("moment");
// const product = require('../models/product')
const { encrypt, compare } = require("../services/crypto");
const verifySid = "VA84bc752a91abcf7df9f31c76832bafff";
const User = require("../models/User");
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const JWTkey = "rubi";
const bcrypt = require("bcryptjs");
const astrologer = require("../models/astrologer");
const AstrologerFee = require("../models/astrologerFee");
const review = require("../models/review");
const feedback = require("../models/feedback");
const Wallet = require("../models/wallet");

const sendSMS = async (to, otp) => {
    const from = "+19287568632";
    await client.messages
        .create({
            body: otp,
            from: from,
            to: to,
        })
        .then((message) => {
            console.log(message.sid);
            return message;
        });
};
exports.resendOtp = async (req, res) => {
    try {
        const otp = math.floor(1000 + Math.random() * 9000);
        const user = await astrologer.findById(
            req.params.id,
            { otp: otp },
            { new: true }
        );
        console.log(user);
        if (!user) {
            return res.status(401).json({
                message: "No User Found ",
            });
        } else {
            // const data = await sendSMS(user.mobile, otp);
            return res.status(200).json({
                message: "OTP is Send ",
                otp: otp,
                data: user,
            });
        }
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};
exports.register = async (req, res) => {
    try {
        const { mobile } = req.body;
        const mobileExists = await astrologer.findOne({ mobile: mobile });
        if (mobileExists) {
            const otpGenerated = Math.floor(100 + Math.random() * 9000);
            let user = await astrologer.findOneAndUpdate({ mobile: mobile }, { otp: otpGenerated }, { new: true });
            return res.status(200).send({ message: "OTP is Send ", data: user, otp: otpGenerated });
        } else {
            const otp = Math.floor(1000 + Math.random() * 9000);
            const referCode = newOTP.generate(16, { alphabets: true, upperCase: true, specialChar: false, });
            const user = await astrologer.create({ mobile, otp, referCode });
            console.log(user);
            return res.status(200).json({ message: "OTP is Send ", otp: otp, data: user });
        }
    } catch (err) {
        return res.status(400).json({ message: err.message, });
    }
};
exports.signUpUser = async (req, res) => {
    try {
        const { firstName, lastName, language, mobile, email, password, confirmpassword, address, address1, country, state, district, pincode, } = req.body;
        const emailRegistered = await astrologer.findOne({ _id: { $ne: req.params.id }, email });
        if (emailRegistered) {
            return res.status(402).send({ message: ` ${email}` + " already exists" });
        }
        const Existing = await astrologer.findOne({ _id: { $ne: req.params.id }, mobile: mobile });
        if (Existing) {
            return res.status(402).send({ message: ` ${mobile} already exists` });
        }
        if (password !== confirmpassword) {
            return res.status(401).json({ message: "Password is not match " });
        }
        encryptedPassword = await bcrypt.hash(password, 10);
        const referCode = newOTP.generate(10, { alphabets: true, upperCase: true, specialChar: false, });
        const hashedPassword = await encrypt(password);
        const confirmPasswords = await encrypt(confirmpassword);
        const otpGenerated = Math.floor(100 + Math.random() * 9000);
        const discountedFee = req.body.discountedFee ? req.body.discountedFee : fees;
        const newUser = await astrologer.findByIdAndUpdate(req.params.id, { $set: { completeProfile: true, firstName, lastName, language, mobile, email, password: hashedPassword, confirmpassword: confirmPasswords, address, address1, country, state, district, pincode, referCode: referCode } }, { new: true });
        if (req.body.referCode) {
            const astro = await astrologer.findOne({
                referCode: req.body.referCode,
            });
            let id = undefined;
            if (astro) {
                id = astro._id;
            }
            const user1 = await User.findOne({ referCode: req.body.referCode });
            if (user1) {
                id = user1._id;
            }
            if (id !== undefined) {
                const user = await wallet.findOne({ userId: id });
                user.balance += 200;
                user.transactions.push({
                    type: "credit",
                    transactionName: "refer",

                    amount: 200,
                    description: "Refer Bonus",
                });
                await user.save();
                // console.log(u);
            }
        }
        const walletObj = {
            userId: newUser._id.toString(),
            astrologer: newUser._id,
            balance: 0,
        };
        console.log(walletObj);
        const w = await Wallet.create(walletObj);
        console.log("Wallet created ", w);
        // sendSMS(`+91${mobile_Number}`, otpGenerated)
        newUser.wallet = w;
        await newUser.save();
        return res.status(200).send({
            message: "signed Up successfully",
            data: newUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};
exports.signup2 = async function (req, res) {
    const { id } = req.params;
    const { highestQualification, collegeOrInstitute, passingYear, experience, skills, } = req.body;
    try {
        let govDocument;
        if (req.file) {
            govDocument = req.file.path
        }
        const otpGenerated = Math.floor(100 + Math.random() * 9000);
        const user = await astrologer.findByIdAndUpdate(id, { highestQualification, collegeOrInstitute, passingYear, govDocument, experience, skills, otp: otpGenerated, }, { new: true });
        return res.status(200).json({ userId: user._id, otp: otpGenerated });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};
exports.verifyOTP = async (req, res) => {
    try {
        const { otp } = req.body;

        const data = await astrologer.findOne({ _id: req.params.id });
        if (!data) {
            return res.status(401).json({
                message: "Your Otp is Wrong",
            });
        }
        if (data.otp != req.body.otp) {
            return res.status(400).send({ message: "Invalid OTP" });
        }
        const accessToken = jwt.sign({ id: data._id }, JWTkey, (err, token) => {
            if (err) return res.status(400).send("Invalid Credentials");
            return res.status(200).send({ token, data });
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};
// SignIn
exports.loginWithMobile = async (req, res) => {
    try {
        const user = await astrologer.findOne({ mobile: req.body.mobile });
        if (!user) {
            return res.status(404).send({ message: "you are not registered" });
        }
        const otpGenerated = Math.floor(100 + Math.random() * 9000);
        await astrologer.findOneAndUpdate(
            { mobile: req.body.mobile },
            { otp: otpGenerated },
            { new: true }
        );
        return res.status(200).send({ userId: user._id, otp: otpGenerated });
    } catch (err) {
        console.log(err.message);
        return res.status(400).send({ message: err.message });
    }
};
exports.verifyMobileOtp = async (req, res) => {
    try {
        const user = await astrologer.findById(req.params.id);
        if (!user) {
            return res.status(404).send({ message: "you are not found" });
        }
        if (user.otp != req.body.otp) {
            return res.status(400).send({ message: "Invalid OTP" });
        }
        const accessToken = jwt.sign({ id: user._id }, JWTkey, (err, token) => {
            if (err) return res.status(400).send("Invalid Credentials");
            return res.status(200).send({ token, user });
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).send({ error: error.message });
    }
};
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        if (!(email && password)) {
            return res.status(400).send("email and password are required");
        }

        const user = await astrologer.findOne({ email: email });
        if (!user)
            return res.status(400).json({
                message: "email is not registered",
            });
        const isPassword = await compare(password, user.password);
        console.log(isPassword);
        if (isPassword) {
            jwt.sign({ id: user._id }, JWTkey, (err, token) => {
                if (err) return res.status(400).send({ message: "Invalid Credentials" });
                return res.status(200).send({ user, token });
            });
        } else {
            return res.status(400).send({ message: "Invalid Credentials" });
        }
    } catch (err) {
        console.log(err);
    }
};

exports.ViewDataProfiles = async (req, res) => {
    try {
        const getDetails = await astrologer.findById(req.params.id);
        if (!getDetails) {
            return res.status(400).json({
                message: "Enter the correct id",
                status: false,
            });
        } else {
            return res.status(200).json({
                message: "Astrologer Details retrieved Successfully",
                data: getDetails,
                status: true,
            });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message, status: false });
    }
};
const Product = require("../models/product");
exports.SearchAstroNameLangSkills = async (req, res) => {
    const search = req.params.key;
    try {
        const student = await astrologer.find({
            $or: [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { Skills: { $regex: search, $options: "i" } },
                { Language: { $regex: search, $options: "i" } },
            ],
        });
        const product = await Product.find({
            $or: [
                { productName: { $regex: search, $options: "i" } },
                { productCategory: { $regex: search, $options: "i" } },
            ],
        });
        if (student.length == 0 && product.length == 0) {
            return res.status(404).json({ message: "data  not Found", status: false });
        } else {
            return res.status(200).json({
                message: " Data  is found Successfully",
                astrologer: student,
                product: product,
                status: true,
            });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: error.message, status: false });
    }
};
exports.getAstrolgerById = async (req, res) => {
    try {
        const getDetails = await astrologer.findById(req.params.id).lean();
        // .select({ _id: 1, firstName: 1, lastName: 1, skills: 1, aboutMe: 1, language: 1, specification: 1 });
        if (!getDetails) {
            return res.status(400).json({
                message: "Enter the correct id",
                status: false,
            });
        }
        return res.status(200).json({
            data: getDetails,
            status: true,
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: error.message, status: false });
    }
};

exports.updateAstrologer = async (req, res) => {
    try {
        const {
            addLanguages,
            image,
            fixedSessionDiscountStatus,
            addSkills,
            discountedFee,
            addSpecification,
            removeLanguages,
            removeSkills,
            removeSpecification,
            fees,
            aboutMe,
            consultationMinutes,
        } = req.body;

        if (
            addLanguages ||
            addSkills ||
            discountedFee ||
            addSpecification ||
            fees ||
            aboutMe ||
            consultationMinutes
        ) {
            await astrologer.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $set: {
                        fees: req.body.fees,
                        aboutMe: req.body.aboutMe,
                        discountedFee: discountedFee,
                        consultationMinutes: consultationMinutes,
                        fixedSessionDiscountStatus: fixedSessionDiscountStatus,
                    },
                    $push: {
                        language: { $each: addLanguages.split()[0] },
                    },
                    $push: {
                        skills: { $each: req.body.addSkills.split()[0] },
                    },
                    $addToSet: { specification: addSpecification.split()[0] },
                },
                { new: true }
            );
            console.log("add");
        }
        if (removeLanguages || removeSkills || removeSpecification) {
            await astrologer.findOneAndUpdate(
                { _id: req.params.id },
                {
                    $pull: {
                        language: { $in: removeLanguages },
                        skills: { $in: removeSkills },
                    },
                },
                // {
                //   $pull: {
                //     language: { $in: removeLanguages },
                //     skills: { $in: removeSkills },
                //     specification: { $in: removeSpecification }
                //   },
                // },
                { new: true }
            );
            console.log("remove");
        }
        if (image) {
            await astrologer.findOneAndUpdate(
                { _id: req.params.id },
                { profileImage: { url: req.file.location, key: req.file.key } },
                { new: true }
            );
        }
        return res.status(200).json({
            message: "profile updated successfully",
            status: true,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send(err.message);
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().lean();
        if (blogs.length === 0) {
            return res.status(404).send({ message: "No blogs found" });
        }
        return res.status(200).json({
            status: "success",
            data: blogs,
        });
    } catch (err) {
        return res.status(400).json({
            status: "failure",
            message: err.message,
        });
    }
};

//Delete User--
exports.deleteAstroName = async (req, res) => {
    try {
        const DeleteUser = await astrologer.findByIdAndDelete({
            _id: req.params.id,
        });
        if (!DeleteUser) {
            return res.json({ message: "Enter the corret User  Name", status: false });
        } else {
            return res.status(200).json({
                message: "User removed successfully",
                status: true,
            });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message, status: false });
    }
};

exports.deleteLanguages = async (req, res) => {
    try {
        const DeleteUser = await astrologer.findOneAndDelete({
            $or: [{ Languages: { $regex: search, $options: "i" } }],
        });
        if (!DeleteUser) {
            return res.json({
                message: "Enter the corret User Languages",
                status: false,
            });
        } else {
            return res.status(200).json({
                message: "Languages removed successfully",
                status: true,
            });
        }
    } catch (error) {
        return res.status(400).json({ message: error.message, status: false });
    }
};

exports.GetAllAstro = async (req, res) => {
    try {
        // const users = await astrologer.find();
        const astro = await astrologer.find();
        if (!astro || astro.length === 0) {
            return res.status(400).json({ message: "astrologer not found" });
        }

        return res.status(200).json({
            status: "success",
            data: astro,
        });
    } catch (err) {
        return res.status(400).json({
            status: "failure",
            message: err.message,
        });
    }
};

exports.getastroById = async (req, res) => {
    try {
        // const users = await astrologer.find();
        const astro = await astrologer.findById(req.params.id).lean();
        if (!astro) {
            return res.status(400).json({ message: "astrologer not found" });
        }

        return res.status(200).json({
            status: "success",
            data: astro,
        });
    } catch (err) {
        return res.status(400).json({
            status: "failure",
            message: err.message,
        });
    }
};

exports.updateAstro = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            password,
            confirmpassword,
            address,
            email,
            mobile,
            country,
            state,
            district,
            pincode,
            highestQualification,
            collegeOrInstitute,
            passingYear,
            govDocument,
            language,
            rashi,
            desc,
            skills,
            specification,
            profileImage,
            fixedSessionDiscountStatus,
            discountPercentage,
            rating,
            link,
            aboutMe,
            gender,
            dailyhoures,
            experience,
        } = req.body;
        const astro = await astrologer.findByIdAndUpdate(
            { _id: req.params.id },
            {
                firstName,
                lastName,
                password,
                confirmpassword,
                address,
                email,
                mobile,
                country,
                state,
                district,
                pincode,
                highestQualification,
                collegeOrInstitute,
                passingYear,
                govDocument,
                language,
                rashi,
                desc,
                skills,
                specification,
                fees,
                rating,

                aboutMe,
                gender,

                experience,
            },
            { new: true }
        );
        if (discountPercentage && astro.fixedSessionDiscountStatus) {
            await AstrologerFee.findOneAndUpdate(
                {
                    astrologerId: astro._id,
                },
                { discountPercentage: discountPercentage },
                { new: true }
            );
        }

        return res.status(200).json({
            message: "Updated",
        });
    } catch (err) {
        console.log(err);
        res.state(400).json({
            err: err.message,
        });
    }
};

exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await astrologer.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        user.otp = otp;
        await user.save();
        return res.status(200).json({
            userId: user._id,
            message: "OTP sent to your registered mobile number",
            otp: otp,
        });
    } catch (err) {
        return res.status(400).json({
            message: err.message,
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, confirmpassword } = req.body;
        // console.log(password, confirmpassword);
        if (password !== confirmpassword) {
            return res.status(400).json({ message: "Password not matched" });
        }
        const user = await astrologer.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        user.password = bcrypt.hashSync(password, 8);
        user.confirmpassword = bcrypt.hashSync(confirmpassword, 8);
        await user.save();
        return res.status(200).json({
            message: "Password reset successfully",
        });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: err.message,
        });
    }
};
exports.getAstro = async (req, res) => {
    try {
        const astro = await astrologer.findById().lean();
        if (!astro) {
            return res.status(400).json({ message: "astrologer not found" });
        }
        return res.status(200).json({ message: "success", data: astro });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: "something went wrong ",
        });
    }
};
exports.updateProfile1 = async (req, res) => {
    try {
        let profile;
        if (req.file) {
            profile = { url: req.file.path, key: req.file.fileName };
        }
        const astro = await astrologer.findByIdAndUpdate(
            req.params.id,
            { profileImage: profile },
            { new: true }
        );
        return res.status(200).json({ message: "success", data: astro });
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({
            message: "something went wrong ",
        });
    }
};
