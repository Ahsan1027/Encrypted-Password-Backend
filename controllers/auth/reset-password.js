import CryptoJS from 'crypto-js';
import User from '../../models/auth';

const secretKey = CryptoJS.enc.Utf8.parse(process.env.PRIVATE_KEY,);
const iv = CryptoJS.enc.Utf8.parse(process.env.INITIALIZATION_VECTOR);

export const ResetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.headers['authorization'].split(' ')[1];

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const decryptedPassword = CryptoJS.AES.decrypt(password, secretKey, { iv }).toString(CryptoJS.enc.Utf8);

    if (user.isVisited === false) {
      user.password = decryptedPassword;
      user.isVisited = true;
      await user.save();

      return res.json({ message: 'Password updated successfully' });
    } else {
      return res.status(400).json({ message: 'Link Expired' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
};
