import nodemailer from 'nodemailer';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

export const enviarMensajeContacto = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { nombre, correo, mensaje } = req.body;

  try {
    // Transportador (puedes cambiar esto según tu proveedor SMTP)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // o 'hotmail', 'outlook', etc.
      auth: {
        user: process.env.CONTACT_EMAIL,
        pass: process.env.CONTACT_PASSWORD,
      },
    });

    const mailOptions = {
      from: correo,
      to: process.env.CONTACT_EMAIL,
      subject: `Mensaje desde DJShop de ${nombre}`,
      text: mensaje,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'No se pudo enviar el mensaje' });
  }
};
