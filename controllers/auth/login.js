import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

import User from '../../models/auth';

const secretKey = CryptoJS.enc.Utf8.parse(process.env.PRIVATE_KEY,);
const iv = CryptoJS.enc.Utf8.parse(process.env.INITIALIZATION_VECTOR);

export const Login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    const decryptedPassword = CryptoJS.AES.decrypt(password, secretKey, { iv }).toString(CryptoJS.enc.Utf8);

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first on your Email !' });
    }

    const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const loggedInToken = await user.generateAuthToken();
    const {
      _id: userId,
      name: username,
    } = user;

    res.json({
      token: loggedInToken,
      id: userId,
      username,
      email,
      message: 'Login Successful'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};