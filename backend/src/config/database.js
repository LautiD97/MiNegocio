import mongoose from "mongoose";
import config from "./env.config.js";

const conectarDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);

    console.log("🍃 MongoDB conectado correctamente");
  } catch (error) {
    console.error("❌ Error al conectar con MongoDB:", error.message);
    process.exit(1);
  }
};

export default conectarDB;