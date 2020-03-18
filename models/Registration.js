const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({
  login: {
    type: String,
    // trim: true,
    required: [true, "login is required"]
  },
  password: {
    type: String,
    required: [true, "password is required"]
  },
  name: {
    type: String,
    // trim: true,
    required: [true, "name is required"]
  },
  secondName: {
    type: String,
    // trim: true,
    required: [true, "secondName is required"]
  },
  dateOfBirth: {
    type: String,
    // trim: true,
    required: [true, "date is required"]
  },
  admin: {
    type: Boolean
    // trim: true,
  },
  token: {
    type: String
  }
});

module.exports = mongoose.model("Registration", RegistrationSchema);
