import dotenv from "dotenv";

dotenv.config();

const requiredEnv = ["PORT", "MONGODB_URI", "NODE_ENV"];

requiredEnv.forEach((env) => {
  if (!process.env[env]) {
    throw new Error(`❌ Falta la variable de entorno: ${env}`);
  }
});

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV
};

export default config;