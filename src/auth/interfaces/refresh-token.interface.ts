import { Document } from 'mongoose';

export interface IRefreshToken extends Document {
  userId: string;
  refreshToken: string;
}
