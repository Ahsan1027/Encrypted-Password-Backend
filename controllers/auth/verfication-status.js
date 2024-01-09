import User from '../../models/auth';

export const VerificationStatus = async (req, res) => {
  try {
    const { 
      _id, 
      isVerified 
    } = req.user;

    if (isVerified) {
      return res.status(200).json({ message: 'User already verified' });
    }

    await User.updateOne({
      _id
    }, {
      $set: {
        isVerified: true
      }
    });

    res.status(200).json({ message: 'User Verified' });
  } catch (error) {
    res.status(500).json({ message: 'Error Verifying User' });
  }
}