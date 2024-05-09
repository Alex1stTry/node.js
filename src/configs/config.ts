import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: Number(process.env.PORT),
  MONGO_URL: process.env.MONGO_URL,

  PASSWORD_SALT_COUNT: Number(process.env.PASSWORD_SALT_COUNT),
  TOKEN_ACCESS_SECRET: process.env.TOKEN_ACCESS_SECRET,
  ACCESS_EXPIRES_IN: process.env.ACCESS_EXPIRES_IN,
  TOKEN_REFRESH_SECRET: process.env.TOKEN_REFRESH_SECRET,
  REFRESH_EXPIRES_IN: process.env.REFRESH_EXPIRES_IN,
};
