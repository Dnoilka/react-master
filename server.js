require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 80;

app.use(bodyParser.json());

app.use(express.static('frontend/dist'));

// Файл для хранения промокодов
const promoCodesFile = './promoCodes.json';

// Чтение данных из файла
function loadPromoCodes() {
  if (fs.existsSync(promoCodesFile)) {
    const data = fs.readFileSync(promoCodesFile);
    return JSON.parse(data);
  }
  return {};
}

// Запись данных в файл
function savePromoCodes(promoCodes) {
  fs.writeFileSync(promoCodesFile, JSON.stringify(promoCodes, null, 2));
}

const promoCodesDB = loadPromoCodes();

// Генерация уникального промокода
function generatePromoCode() {
  return `DOMINIK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail обязателен!' });
  }

  if (promoCodesDB[email]) {
    return res.status(200).json({
      message: 'Вы уже получили промокод!',
      promoCode: promoCodesDB[email],
    });
  }

  const promoCode = generatePromoCode();

  promoCodesDB[email] = promoCode;

  // Сохраняем данные о промокодах в файл
  savePromoCodes(promoCodesDB);

  // Настройка письма
  const mailOptions = {
    from: `"Dominik Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Ваш промокод от Dominik Store!',
    html: `
      <h1>Спасибо за подписку!</h1>
      <p>Ваш уникальный промокод: <strong>${promoCode}</strong>.</p>
      <p>Примените его при оформлении заказа и получите скидку 10%!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Промокод отправлен на вашу почту!' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Ошибка отправки письма. Попробуйте позже.' });
  }
});

app.listen(port, () => {
  console.log('Server has been started on port ' + port);
});
