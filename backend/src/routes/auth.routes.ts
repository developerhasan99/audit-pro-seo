import { Router, Request, Response } from 'express';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { AppError, asyncHandler } from '../middleware/error.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';

const router = Router();

// Sign up
router.post('/signup', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  // Create user
  const hashedPassword = await hashPassword(password);
  const [newUser] = await db.insert(users).values({
    email,
    password: hashedPassword,
  }).returning();

  // Generate token
  const token = generateToken({ id: newUser.id, email: newUser.email });

  res.status(201).json({
    message: 'User created successfully',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
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
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate token
  const token = generateToken({ id: user.id, email: user.email });

  res.json({
    message: 'Signed in successfully',
    token,
    user: {
      id: user.id,
      email: user.email,
      lang: user.lang,
      theme: user.theme,
    },
  });
}));

// Sign out
router.post('/signout', authMiddleware, asyncHandler(async (_req: Request, res: Response) => {
  res.json({ message: 'Signed out successfully' });
}));

// Get current user
router.get('/me', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user!.id),
    columns: {
      id: true,
      email: true,
      lang: true,
      theme: true,
      created: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ user });
}));

// Update user profile
router.put('/profile', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { email, lang, theme } = req.body;
  
  const [updatedUser] = await db.update(users)
    .set({
      ...(email && { email }),
      ...(lang && { lang }),
      ...(theme && { theme }),
    })
    .where(eq(users.id, req.user!.id))
    .returning();

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      lang: updatedUser.lang,
      theme: updatedUser.theme,
    },
  });
}));

// Change password
router.put('/password', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, req.user!.id),
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  const hashedPassword = await hashPassword(newPassword);
  await db.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, req.user!.id));

  res.json({ message: 'Password changed successfully' });
}));

// Delete account
router.delete('/account', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  // Mark user as deleting (soft delete)
  const [user] = await db.update(users)
    .set({ deleting: true })
    .where(eq(users.id, req.user!.id))
    .returning();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ message: 'Account deletion initiated' });
}));

export default router;
