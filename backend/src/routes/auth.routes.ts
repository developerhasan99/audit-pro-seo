import { Router, Request, Response } from 'express';
import { User } from '../models';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Sign up
router.post('/signup', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Create user
  const user = await User.create({ email, password });

  // Set session
  (req.session as any).userId = user.id;
  (req.session as any).userEmail = user.email;

  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: user.id,
      email: user.email,
    },
  });
}));

// Sign in
router.post('/signin', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Set session
  (req.session as any).userId = user.id;
  (req.session as any).userEmail = user.email;

  res.json({
    message: 'Signed in successfully',
    user: {
      id: user.id,
      email: user.email,
      lang: user.lang,
      theme: user.theme,
    },
  });
}));

// Sign out
router.post('/signout', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      throw new AppError('Error signing out', 500);
    }
    res.json({ message: 'Signed out successfully' });
  });
}));

// Get current user
router.get('/me', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user!.id, {
    attributes: ['id', 'email', 'lang', 'theme', 'created'],
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ user });
}));

// Update user profile
router.put('/profile', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { email, lang, theme } = req.body;
  
  const user = await User.findByPk(req.user!.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (email) user.email = email;
  if (lang) user.lang = lang;
  if (theme) user.theme = theme;

  await user.save();

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user.id,
      email: user.email,
      lang: user.lang,
      theme: user.theme,
    },
  });
}));

// Change password
router.put('/password', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  const user = await User.findByPk(req.user!.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
}));

// Delete account
router.delete('/account', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByPk(req.user!.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Mark user as deleting (soft delete)
  user.deleting = true;
  await user.save();

  // Destroy session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
  });

  res.json({ message: 'Account deletion initiated' });
}));

export default router;
