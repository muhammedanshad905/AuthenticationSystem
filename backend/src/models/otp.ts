import { Schema, model, Document } from 'mongoose';

export interface IOtp {
  email: string;
  otp: string;
  expiresAt: Date;
}

export interface IOtpDocument extends IOtp, Document {}

const otpSchema = new Schema<IOtpDocument>({
  email: { type: String, required: true, lowercase: true, index: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IOtpDocument>('Otp', otpSchema);
