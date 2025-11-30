import jwt, { SignOptions } from "jsonwebtoken";

export interface AccessTokenPayload {
  id: string;
  email: string;
  name: string;
}

// -------------------- ACCESS TOKEN --------------------
export const signAccessToken = (payload: AccessTokenPayload): string => {
  const secret = process.env.JWT_ACCESS_SECRET as string;

  const options: SignOptions = {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || "15m") as any,
  };

  return jwt.sign(payload, secret, options);
};

// --------- REFRESH TOKEN --------------------
export const signRefreshToken = (payload: { id: string }): string => {
  const secret = process.env.JWT_REFRESH_SECRET as string;

  const options: SignOptions = {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || "7d") as any,
  };

  return jwt.sign(payload, secret, options);
};

// -------------------- VERIFY --------------------
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
};
