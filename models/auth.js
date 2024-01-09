import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String
  },
  isVisited: {
    type: Boolean,
    default: false
  },
  isSameLink: {
    type: Boolean,
    default: false
  }
})

UserSchema.methods.generateAuthToken = async function (req, res) {
  try {
    const token = jwt.sign({ _id: this.id.toString() }, process.env.SECRET_KEY, { expiresIn: '1d' });
    return token;
  }
  catch (error) {
    res.send("the error is " + error);
  }
}

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

const User = new mongoose.model("Auth", UserSchema)
module.exports = User