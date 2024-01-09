import express from 'express';

import {
  ForgotPassword,
  Login,
  Signup,
  ResetPassword,
  VerificationStatus
} from '../controllers/auth';

import passport from '../middlewares/passport';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/forgot-password', ForgotPassword);
router.put('/user-verifying', passport.authenticate('jwt', { session: false }), VerificationStatus);
router.post('/new-password', ResetPassword);

export default router;

