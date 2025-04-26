// file: server.js
import express from 'express'
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import generoRoutes from './routes/generoRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

import descargasRoutes from './Routes/descargas.js';
import pagosRoutes from './Routes/pagos.js';
import rolesRoutes from './Routes/roles.js';
import suscripcionesRoutes from './Routes/suscripciones.js';
import contactoRoutes from './Routes/contacto.js';

dotenv.config();
const app = express()

const SECRET_KEY = "Meschina_my_Love"; // Usa una clave segura

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ['GET', 'POST', 'PUT', "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
}))

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 1️⃣ Ruta para generar un token (cuando el usuario compra/accede a un video)
app.get("/generate-video-token/:filename", (req, res) => {
    const { filename } = req.params;
    const token = jwt.sign({ filename }, SECRET_KEY, { expiresIn: "30m" }); // Token expira en 10 minutos
    res.json({ token });
});

// 📌 2️⃣ Ruta protegida para servir el video
app.get("/stream-video/:token", (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, SECRET_KEY);
        const filePath = path.join(__dirname, "public", "Images", decoded.filename);

        console.log('token: ', token)
        console.log('decoded: ', decoded)
        console.log('filePath: ', filePath)

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Archivo no encontrado" });
        }

        // 🔹 Servir el archivo de forma segura
        res.sendFile(filePath);
    } catch (error) {
        return res.status(403).json({ error: "Acceso no autorizado" });
    }
});

// Servir archivos estáticos desde /Public
app.use('/public', express.static(path.join(__dirname, 'Public')));

app.use(express.json())
app.use(cookieParser())

app.use('/api/descargas', descargasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/suscripciones', suscripcionesRoutes);
app.use('/api/contacto', contactoRoutes);

app.use('/auth', adminRouter)

app.use('/api', generoRoutes);

app.get("/download/:token", (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, SECRET_KEY);
        const filePath = path.join(__dirname, "public", "Images", decoded.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Archivo no encontrado" });
        }

        res.download(filePath, decoded.filename); // 🔹 Descarga el archivo
    } catch (error) {
        return res.status(403).json({ error: "Acceso no autorizado" });
    }
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token

    if(token) {
        Jwt.verify(token, 'jwt_secret_key', (err, decoded) => {
            if(err) return res.json({Status: false, Error: 'Token Inválido'})
            req.id = decoded.id;
            req.rol = decoded.rol;
            req.email = decoded.email;
            next()
        })
    } else {
        return res.json({Status: false, Error: 'Usuario no autenticado'})
    }
}

app.get('/verify', verifyUser, (req, res) => {
    return res.json({Status: true, admin: req.rol, id: req.id, correoUsu: req.email})
})


app.listen(5000, () => {
    console.log("Server is running on port ${5000}")
})
    