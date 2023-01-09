import * as mongoose from 'mongoose';
import * as validator from 'validator';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 127,
      required: [true, 'The name is empty'],
    },
    email: {
      type: String,
      lowercase: true,
      validate: validator.isEmail,
      maxlength: 255,
      minlength: 6,
      required: [true, 'The email is empty'],
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 1024,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
    },
    versionKey: false,
  },
);

UserSchema.index({ name: 1 });
UserSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { isActivate: true } },
);
export const UserTable = 'User';
export const userModel = mongoose.model(UserTable, UserSchema);
