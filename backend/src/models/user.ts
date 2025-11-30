import { Schema, model, Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  refreshToken?: string | null;
  createdAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  refreshToken: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

export default model<IUserDocument>('User', userSchema);
