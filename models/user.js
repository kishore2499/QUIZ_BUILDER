const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,  // Ensure emails are stored in lowercase
  },
  password: {
    type: String,
    required: true,
  },
});

// Middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it's been modified or is new
  if (!this.isModified("password")) return next();

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);  // Increased salt rounds for stronger hashing
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if provided password matches the stored hashed password
userSchema.methods.verifyPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

