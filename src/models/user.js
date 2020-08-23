const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: {
    type: Number,
    default: 0,
    // custom validation
    validate(value) {
      if (value < 0) return { message: "Age must be positive number" };
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value))
        throw new Error("Email must be a valid email address");
    },
  },
  // add timestamp to docu,ent
  time: { type: Date, default: Date.now },
  // password
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password"))
        throw new Error("You can't use word 'password' in password");
    },
  },
});

// custom validation function for find user and compare password
userSchema.statics.findByCredentials = async (email,password) => {
  const user = await User.findOne({ email: email });
  if (!user) throw new Error("Unable to login");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Unable to login");
  return user;
};

// schema for hashing passwords
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
