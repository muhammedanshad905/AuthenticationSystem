import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import User from '../models/user';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from Authorization header or cookie
    const authHeader = req.headers.authorization;
  
    
    const tokenFromHeader =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    const token = tokenFromHeader || req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // 2. Verify token
    let payload: any;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 3. Validate user existence
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // 4. Attach user to request object
    req.user = user;

    // 5. Continue
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default authMiddleware;
