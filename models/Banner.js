const { model, Schema } = require("mongoose");
const bannerSchema = new Schema(
  {
    desc: {
      type: String,
    },
    link: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = model("banner", bannerSchema);
