const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const path = require('path');

// CRITICAL: Load .env explicitly from this file's directory
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug: verify env vars are loaded (never log the password!)
console.log('\uD83D\uDD10 GMAIL_USER:', process.env.GMAIL_USER || 'NOT SET');
console.log('\uD83D\uDD10 GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***loaded***' : 'NOT SET — email will fail');

// Gmail SMTP transporter — port 465 + secure:true is most reliable for App Passwords
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter on startup
transporter.verify((error, success) => {
  if (error) {
    console.log('\u26A0\uFE0F  Gmail transporter error:', error.message);
    console.log('   Make sure GMAIL_APP_PASSWORD is set in backend/.env');
    console.log('   Get one at: https://myaccount.google.com/apppasswords');
  } else {
    console.log('\u2705 Gmail transporter ready — emails will send to vezziren@gmail.com');
  }
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many contact attempts, please try again later.' }
});

const messages = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test email endpoint — visit http://localhost:5000/api/test-email to verify
app.get('/api/test-email', async (req, res) => {
  try {
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.GMAIL_USER}>`,
      to: 'vezziren@gmail.com',
      subject: 'Test email from Vezziren\'s Den',
      text: 'If you received this, the email system is working!',
    });
    res.json({ success: true, messageId: info.messageId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, code: err.code });
  }
});

app.get('/api/projects', (req, res) => {
  const projects = [
    {
      id: 1,
      title: "EliteBasket",
      category: "E-Commerce Platform",
      description: "A full-stack e-commerce platform built with modern authentication via Clerk and a robust Supabase backend. Features include product browsing, category filtering, shopping cart management, user authentication with Google OAuth, promo code system, and a responsive premium UI inspired by boutique retail experiences.",
      images: [
        "/images/elitebasket-1.png",
        "/images/elitebasket-2.png",
        "/images/elitebasket-3.png",
        "/images/elitebasket-4.png",
        "/images/elitebasket-5.png",
        "/images/elitebasket-6.png"
      ],
      tech: ["React", "Clerk", "Supabase", "Node.js", "CSS3"],
      links: { github: "#" },
      featured: true
    }
  ];
  res.json(projects);
});

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const newMessage = {
    id: messages.length + 1,
    name,
    email,
    message,
    timestamp: new Date().toISOString()
  };

  messages.push(newMessage);

  try {
    const mailOptions = {
      from: `"Vezziren's Den Portfolio" <${process.env.GMAIL_USER}>`,
      to: 'vezziren@gmail.com',
      replyTo: email,
      subject: `New message from ${name} — Vezziren's Den`,
      text: `Name: ${name}
Email: ${email}
Message:
${message}

—
Sent from Vezziren's Den portfolio contact form`,
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; background: #0c0c0c; color: #f0ece4; border-radius: 16px; border: 1px solid rgba(212,196,168,0.1);">
          <h2 style="color: #c9a84c; margin-bottom: 24px; font-size: 24px;">\uD83D\uDCAC New Message Received</h2>
          <div style="background: #1a1a18; padding: 24px; border-radius: 12px; margin-bottom: 24px;">
            <p style="margin: 0 0 12px 0; color: #a09888; font-size: 14px;"><strong style="color: #c9a84c;">Name:</strong> ${name}</p>
            <p style="margin: 0 0 12px 0; color: #a09888; font-size: 14px;"><strong style="color: #c9a84c;">Email:</strong> <a href="mailto:${email}" style="color: #d4c4a8;">${email}</a></p>
            <p style="margin: 0; color: #a09888; font-size: 14px;"><strong style="color: #c9a84c;">Message:</strong></p>
            <p style="margin: 12px 0 0 0; color: #f0ece4; line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #6a6458; font-size: 12px; margin: 0;">Sent from Vezziren's Den portfolio contact form</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('\u2705 Email sent:', info.messageId);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      id: newMessage.id
    });
  } catch (emailError) {
    console.error('\u274C Email send failed:', emailError.message, '| Code:', emailError.code);
    res.status(500).json({
      success: false,
      error: 'Email failed to send. Check server logs.',
      details: emailError.message,
      code: emailError.code
    });
  }
});

app.get('/api/messages', (req, res) => {
  res.json(messages);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`\uD83D\uDCBB Vezziren's Den server running on port ${PORT}`);
  console.log(`\uD83D\uDE80 Environment: ${process.env.NODE_ENV || 'development'}`);
});
