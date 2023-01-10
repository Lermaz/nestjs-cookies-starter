import { Schema } from 'mongoose';

export const RefreshTokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: [true, 'The refreshToken is empty'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
    versionKey: false,
  },
);
