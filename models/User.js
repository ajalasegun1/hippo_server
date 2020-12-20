const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  handle: {
    type: String,
    require: true,
    unique: true,
  },
  bio: String,
  created_at: String,
  location: String,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  profile_pic: String,
});

UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt
    .hash(this.password, 10)
    .then((hashedPassword) => {
      this.password = hashedPassword;
      next();
    })
    .catch((err) => next(err));
});

module.exports = model("user", UserSchema);
