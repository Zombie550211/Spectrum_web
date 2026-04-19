require('dotenv').config();
const express  = require('express');
const nodemailer = require('nodemailer');
const cors     = require('cors');
const path     = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

app.post('/send', async (req, res) => {
  const { name, address, phone, email, message } = req.body;

  if (!name || !address) {
    return res.status(400).json({ ok: false, error: 'Nombre y dirección son requeridos.' });
  }
  if (!phone && !email) {
    return res.status(400).json({ ok: false, error: 'Se requiere teléfono o email.' });
  }

  const mailOptions = {
    from: `"Spectrum Web" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_USER,
    subject: `Solicitud de cobertura - ${name}`,
    html: `
      <h2 style="color:#0050ff">Nueva solicitud de cobertura</h2>
      <table style="border-collapse:collapse;width:100%;max-width:500px">
        <tr><td style="padding:8px;font-weight:bold">Nombre</td><td style="padding:8px">${name}</td></tr>
        <tr style="background:#f4f6fb"><td style="padding:8px;font-weight:bold">Dirección</td><td style="padding:8px">${address}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Teléfono</td><td style="padding:8px">${phone || '—'}</td></tr>
        <tr style="background:#f4f6fb"><td style="padding:8px;font-weight:bold">Email</td><td style="padding:8px">${email || '—'}</td></tr>
        <tr><td style="padding:8px;font-weight:bold">Comentarios</td><td style="padding:8px">${message || '—'}</td></tr>
      </table>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ ok: true });
  } catch (err) {
    console.error('Error al enviar correo:', err.message);
    res.status(500).json({ ok: false, error: 'No se pudo enviar el correo.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
