const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const port = 80;

// Middleware для парсинга JSON
app.use(bodyParser.json());

// Статическая папка
app.use(express.static('frontend/dist'));

// Генерация уникального промокода
function generatePromoCode() {
  return `DOMINIK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

// Настройка Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // или другой почтовый сервис
  auth: {
    user: 'dominikrassylka@gmail.com', // Твоя почта
    pass: 'gmtr vlyt aqyf yhzp', // Пароль приложения или App Password
  },
});

// Маршрут для обработки подписки
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'E-mail обязателен!' });
  }

  // Генерация промокода
  const promoCode = generatePromoCode();

  // Настройка письма
  const mailOptions = {
    from: '"Dominik Store" <your-email@gmail.com>',
    to: email,
    subject: 'Ваш промокод от Dominik Store!',
    html: `
      <h1>Спасибо за подписку!</h1>
      <p>Ваш уникальный промокод: <strong>${promoCode}</strong>.</p>
      <p>Примените его при оформлении заказа и получите скидку 10%!</p>
    `,
  };

  try {
    // Отправка письма
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Промокод отправлен на вашу почту!' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Ошибка отправки письма. Попробуйте позже.' });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log('Server has been started on port ' + port);
});
