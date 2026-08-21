import express from "express";
import cors from "cors";
import config from "./src/config/env.config.js";
import conectarDB from "./src/config/database.js";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    ok: true,
    mensaje: "🚀 MiNegocio Backend funcionando"
  });
});

const iniciarServidor = async () => {
  await conectarDB();

  app.listen(config.PORT, () => {
    console.log(
      `🚀 Servidor MiNegocio funcionando en http://localhost:${config.PORT}`
    );
  });
};

iniciarServidor();