import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { verifyRefreshToken } from '../utils/jwt';
import User from '../models/user';

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email required' });
    await authService.generateAndStoreOtp(email);
    return res.json({ message: `OTP sent to ${email}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' });
    const ok = await authService.verifyStoredOtp(email, otp);
    if (!ok) return res.status(400).json({ message: 'Invalid or expired OTP' });
    return res.json({ message: 'OTP verified' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, password required' });
    const user = await authService.createUser(name, email, password);
    return res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email } });
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ message: err.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });
    const user = await authService.authenticateUser(email, password);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const tokens = await authService.issueTokensForUser(user);

    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'strict' });

    return res.json({ user: { id: user._id, name: user.name, email: user.email }, ...tokens });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const payload: any = verifyRefreshToken(refreshToken);
        await authService.invalidateUserRefreshToken(payload.id);
      } catch (_err) {
        // invalid token -> ignore
      }
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const home = async (req: Request, res: Response) => {
  const user = req.user;
  return res.json({ message: 'Authenticated', user });
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
  try {
    const token = req.body.refreshToken || req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'Refresh token required' });

    let payload: any;
    try {
      payload = verifyRefreshToken(token) as any;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== token) return res.status(401).json({ message: 'Invalid refresh token' });

    const tokens = await authService.rotateTokens(user._id);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, sameSite: 'strict' });

    return res.json(tokens);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
