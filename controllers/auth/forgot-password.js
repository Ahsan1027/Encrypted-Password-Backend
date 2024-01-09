import SendEmail from '../../utils/send-email';
import User from '../../models/auth';

export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const unique = await user.generateAuthToken();
    await User.updateOne({
      email
    }, {
      $set:
      {
        token: unique,
        isVisited: false
      }
    });
    SendEmail(email, unique, 'new-password');

    res.json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error checking email', error });
  }
};
