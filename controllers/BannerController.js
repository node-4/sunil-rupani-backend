const Banner = require("../models/Banner");
const ObjectId = require("mongodb").ObjectID;

//pos Banner--
module.exports.addBanner = async (req, res) => {
  try {
    let image;
    if (req.file) {
      image = req.file.path
    }
    const addBanner = await Banner.create({
      desc: req.body.desc,
      type: req.body.type,
      link: image
    });
    return res.status(200).json({
      msg: "Banner successfully added",
      data: addBanner,
      status: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: err.message
    })
  }
};

//Get Banner
module.exports.getBanner = async (req, res) => {
  try {
    const getBanner = await Banner.find();
    return res.status(200).json({ status: "success", data: getBanner });
  } catch (error) {
    console.log(error);
  }
};
module.exports.getBootomBanner = async (req, res) => {
  try {
    const getBanner = await Banner.find({ type: "Bottom" });
    return res.status(200).json({ status: "success", data: getBanner });
  } catch (error) {
    console.log(error);
  }
};
//Update Banner--
module.exports.editBanner = async (req, res) => {
  try {
    const b = await Banner.findById(req.params.id);

    const editBanner = await Banner.findByIdAndUpdate(req.params.id, {
      bannerImage: req.file.filename ? req.file.filename : b.bannerImage,
      link: `public/images/${req.file.filename}`,
    });
    res
      .status(200)
      .json({ msg: "Banner successfully Updated", data: editBanner });
  } catch (error) {
    console.log(error);
  }
};

//Delete Banner-----
module.exports.deleteBanner = async (req, res) => {
  try {
    const response = await Banner.findByIdAndDelete(req.params.id);
    return res.status(200).send({
      msg: "Banner deleted successfully",
      response: response,
      status: true,
    });
  } catch (error) {
    return res.send(500).json({
      status: "Failed",
      message: error.message,
    });
    console.log(error);
  }
};
