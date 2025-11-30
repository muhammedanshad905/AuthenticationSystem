import bcrypt from 'bcrypt';
import User, { IUserDocument } from '../models/user';
import Otp from '../models/otp';
import { sendOtpEmail } from '../utils/otpMailer';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { Types } from 'mongoose';

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);

export const generateAndStoreOtp = async (email: string): Promise<string> => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await Otp.findOneAndUpdate(
    { email },
    { email, otp, expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  try {
    await sendOtpEmail(email, otp);
  } catch (err) {
    console.error('Error sending OTP email:', err);
    // continue — still return otp (dev watchers) but do not expose to client in prod
  }

  return otp;
};

export const verifyStoredOtp = async (email: string, otp: string): Promise<boolean> => {
  const record = await Otp.findOne({ email });
  if (!record) return false;
  if (record.otp !== otp) return false;
  await Otp.deleteOne({ _id: record._id });
  return true;
};

export const createUser = async (name: string, email: string, password: string): Promise<IUserDocument> => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({ name, email, passwordHash });
  await user.save();
  return user;
};

export const authenticateUser = async (email: string, password: string): Promise<IUserDocument | null> => {
  const user = await User.findOne({ email });
  if (!user) return null;
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return null;
  return user;
};

export const issueTokensForUser = async (user: IUserDocument) => {
  const accessToken = signAccessToken({ id: user._id.toString(), email: user.email, name: user.name });
  const refreshToken = signRefreshToken({ id: user._id.toString() });
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

export const invalidateUserRefreshToken = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
};

export const rotateTokens = async (userId: Types.ObjectId | string) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  const accessToken = signAccessToken({ id: user._id.toString(), email: user.email, name: user.name });
  const refreshToken = signRefreshToken({ id: user._id.toString() });
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};
