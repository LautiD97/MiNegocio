import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Nombre, email y contraseña son obligatorios"
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuarioExistente = await User.findOne({
      email: emailNormalizado
    });

    if (usuarioExistente) {
      return res.status(409).json({
        ok: false,
        mensaje: "El email ya está registrado"
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = await User.create({
      nombre: nombre.trim(),
      email: emailNormalizado,
      password: passwordHash,
      telefono: telefono?.trim() || ""
    });

    return res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        telefono: nuevoUsuario.telefono
      }
    });

  } catch (error) {
    console.error("❌ Error registrando usuario:", error);

    return res.status(500).json({
      ok: false,
      mensaje: "Error interno del servidor"
    });
  }
};