import mongoose from "mongoose";

import { RoleEnum } from "../enums/role-enum";
import { IUser } from "../interfaces/user-interface";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: RoleEnum, default: RoleEnum.USER },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = mongoose.model<IUser>("users", userSchema);
