// /app/DJSHOP/Server/server.js
import express from 'express'
import cors from 'cors';
import { adminRouter } from "./Routes/AdminRoute.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import generoRoutes from './Routes/generoRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";
import descargasRoutes from './Routes/descargas.js';
import pagosRoutes from './Routes/pagos.js';
import rolesRoutes from './Routes/roles.js';
import contactoRoutes from './Routes/contacto.js';
import pistasRoutes from './Routes/pistasRoutes.js';
import usuariosRoutes from './Routes/usuariosRoutes.js';
import comprasRoutes from './Routes/comprasRoutes.js';
import planesRoutes from './Routes/planesRoutes.js';
import suscripcionesRoutes from './Routes/suscripcionesRoutes.js';

dotenv.config();
const app = express()

// 🔑 Variables desde .env
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ["http://localhost:5173", "https://djshop.prodixperu.com"],
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    credentials: true,
}));

// Obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📌 1️⃣ Ruta para generar un token
app.get("/generate-video-token/:filename", (req, res) => {
    const { filename } = req.params;
    const token = jwt.sign({ filename }, JWT_SECRET, { expiresIn: "30m" });
    res.json({ token });
});

// 📌 2️⃣ Ruta protegida para streaming
app.get("/stream-video/:token", (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, JWT_SECRET);
        const filePath = path.join(__dirname, "public", "Images", decoded.filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Archivo no encontrado" });
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(filePath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        console.error("Error al verificar token:", error);
        res.status(401).json({ error: "Token inválido o expirado" });
    }
});

// 📌 3️⃣ Ruta para descarga con token
app.get("/download/:token", (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, JWT_SECRET);
        const filePath = path.join(__dirname, "public", "Images", decoded.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "Archivo no encontrado" });
        }
        
        res.download(filePath, decoded.filename, (err) => {
            if (err) {
                console.error("Error al descargar archivo:", err);
                res.status(500).json({ error: "Error al descargar el archivo" });
            }
        });
    } catch (error) {
        console.error("Error al verificar token:", error);
        res.status(401).json({ error: "Token inválido o expirado" });
    }
});

app.use('/public', express.static(path.join(__dirname, 'Public')));
app.use(express.json())
app.use(cookieParser())
app.use('/api/descargas', descargasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/suscripciones', suscripcionesRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/pistas', pistasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/auth', adminRouter);
app.use('/api/generos', generoRoutes);

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
