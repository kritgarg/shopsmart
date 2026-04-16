import { createClerkClient, verifyToken } from '@clerk/backend';
import { env } from '../config/env.js';
import * as userService from '../modules/user/user.service.js';

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY });

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = header.split(' ')[1];
    
    let clerkUserId;
    if (process.env.NODE_ENV === 'test' && req.headers['x-test-user-id']) {
        clerkUserId = req.headers['x-test-user-id'];
    } else {
        const decoded = await verifyToken(token, {
            secretKey: env.CLERK_SECRET_KEY,
        });
        clerkUserId = decoded.sub;
    }

    if (!clerkUserId) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Sync with DB
    let user = await userService.findUserById(clerkUserId);

    if (!user) {
      const email = `user_${clerkUserId}@example.com`;
      const role = (process.env.NODE_ENV === 'test' && req.headers['x-test-role']) || 'USER';

      user = await userService.createUser(clerkUserId, email, role);
    } else if (process.env.NODE_ENV === 'test' && req.headers['x-test-role']) {
        // Force role update for test consistency
        user = await userService.updateUserRole(clerkUserId, req.headers['x-test-role']);
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ message: 'Unauthorized: Authentication failed' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};
