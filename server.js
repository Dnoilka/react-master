require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 80;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Указываем путь к файлу базы данных
const dbFilePath = path.resolve(__dirname, 'database.sqlite');

// Создаем или подключаемся к базе данных
const db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
    process.exit(1);
  } else {
    console.log(`База данных подключена: ${dbFilePath}`);
  }
});

// Создание таблицы и заполнение данными (если таблицы не существует)
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      category TEXT,
      subcategory TEXT,
      price INTEGER,
      oldPrice INTEGER,
      discount TEXT,
      image TEXT,
      brand TEXT,
      material TEXT,
      color TEXT,
      rating REAL,
      sizes TEXT
    )`,
    (err) => {
      if (err) console.error('Ошибка создания таблицы:', err.message);
    }
  );

  const products = [
    [
      'Классические брюки',
      'Одежда',
      'Брюки',
      2500,
      5000,
      '-50%',
      'https://via.placeholder.com/200x250',
      'Gucci',
      'Хлопок',
      'Черный',
      4.5,
      'S,M,L',
    ],
    // ... другие продукты
  ];

  const stmt = db.prepare(
    `INSERT INTO products (name, category, subcategory, price, oldPrice, discount, image, brand, material, color, rating, sizes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) {
      console.error('Ошибка проверки данных:', err.message);
    } else if (row.count === 0) {
      products.forEach((product) => {
        product[10] = parseFloat(product[10]) || null;
        stmt.run(product, (err) => {
          if (err) {
            console.error('Ошибка вставки данных:', err.message);
          }
        });
      });
      console.log('Таблица products заполнена данными');
    } else {
      console.log('Таблица products уже содержит данные');
    }
    stmt.finalize();
  });
});

// Маршрут для получения всех продуктов
app.get('/api/products', (req, res) => {
  const {
    category,
    subcategory,
    discount,
    brand,
    material,
    color,
    size,
    sortBy,
  } = req.query;

  let query = `SELECT * FROM products WHERE 1=1`;
  const params = [];

  if (category) {
    query += ` AND category = ?`;
    params.push(category);
  }

  if (subcategory) {
    query += ` AND subcategory = ?`;
    params.push(subcategory);
  }

  if (discount === 'true') {
    query += ` AND discount != ''`;
  }

  if (brand) {
    query += ` AND brand = ?`;
    params.push(brand);
  }

  if (material) {
    query += ` AND material = ?`;
    params.push(material);
  }

  if (color) {
    query += ` AND color = ?`;
    params.push(color);
  }

  if (size) {
    query += ` AND sizes LIKE ?`;
    params.push(`%${size}%`);
  }

  if (sortBy) {
    const validSortOptions = ['price', 'rating', 'discount'];
    if (validSortOptions.includes(sortBy)) {
      query += ` ORDER BY ${sortBy}`;
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Ошибка выполнения запроса:', err.message);
      res.status(500).json({ error: 'Ошибка сервера' });
    } else {
      rows.forEach((row) => {
        row.rating = parseFloat(row.rating) || null;
      });
      res.json(rows);
    }
  });
});

// Промокоды
const promoCodesFile = path.resolve(__dirname, 'promoCodes.json');

function loadPromoCodes() {
  if (fs.existsSync(promoCodesFile)) {
    const data = fs.readFileSync(promoCodesFile);
    return JSON.parse(data);
  }
  return {};
}

function savePromoCodes(promoCodes) {
  fs.writeFileSync(promoCodesFile, JSON.stringify(promoCodes, null, 2));
}

const promoCodesDB = loadPromoCodes();

function generatePromoCode() {
  return `DOMINIK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

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
  savePromoCodes(promoCodesDB);

  const mailOptions = {
    from: `Dominik Store <${process.env.EMAIL_USER}>`,
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
    console.error('Ошибка отправки письма:', error.message);
    res
      .status(500)
      .json({ message: 'Ошибка отправки письма. Попробуйте позже.' });
  }
});

// Обработка остальных маршрутов (для SPA)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
