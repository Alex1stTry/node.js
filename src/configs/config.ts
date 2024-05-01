import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: Number(process.env.PORT),
  MONGO_URL: process.env.MONGO_URL,
};
