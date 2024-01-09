import CryptoJS from 'crypto-js';

import SignupEmail from '../../utils/send-email';
import User from '../../models/auth';

const secretKey = CryptoJS.enc.Utf8.parse(process.env.PRIVATE_KEY,);
const iv = CryptoJS.enc.Utf8.parse(process.env.INITIALIZATION_VECTOR);

export const Signup = async (req, res) => {
  try {
    const {
      name,
      mobile,
      email,
      password
    } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const decryptedPassword = CryptoJS.AES.decrypt(password, secretKey, { iv }).toString(CryptoJS.enc.Utf8);

    const newUser = new User({
      name,
      mobile,
      email,
      password: decryptedPassword,
      isVerififed: false
    });

    await newUser.save();
    const unique = await newUser.generateAuthToken();
    SignupEmail(email, unique, 'user-verifying');

    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during signup', error });
  }
};
