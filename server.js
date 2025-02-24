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
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

const dbFilePath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFilePath);

// Инициализация базы данных
db.serialize(() => {
  // Таблица товаров
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    price INTEGER NOT NULL,
    oldPrice INTEGER DEFAULT 0,
    discount TEXT DEFAULT '',
    image TEXT NOT NULL,
    brand TEXT,
    material TEXT,
    color TEXT,
    rating REAL DEFAULT 0,
    sizes TEXT,
    country TEXT,
    reviews INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Таблица пользователей
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Проверка и добавление тестовых товаров
  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) return console.error('Error checking products:', err);

    if (row.count === 0) {
      const products = [
        {
          name: 'Мужские классические брюки',
          category: 'Одежда',
          subcategory: 'Брюки',
          price: 4500,
          oldPrice: 6000,
          discount: '25%',
          image: 'https://via.placeholder.com/200x250',
          brand: 'Gucci',
          material: 'Хлопок',
          color: 'Черный',
          rating: 4.5,
          sizes: 'S,M,L,XL',
          country: 'Италия',
          reviews: 12,
        },
        {
          name: 'Спортивный костюм',
          category: 'Спорт',
          subcategory: 'Спортивные костюмы',
          price: 7990,
          oldPrice: 9990,
          discount: '20%',
          image: 'https://via.placeholder.com/200x250',
          brand: 'Nike',
          material: 'Полиэстер',
          color: 'Синий',
          rating: 4.8,
          sizes: 'M,L,XL',
          country: 'Китай',
          reviews: 8,
        },
      ];

      const stmt = db.prepare(`INSERT INTO products (
        name, category, subcategory, price, oldPrice, discount, 
        image, brand, material, color, rating, sizes, country, reviews
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

      products.forEach((product) => {
        stmt.run(
          product.name,
          product.category,
          product.subcategory,
          product.price,
          product.oldPrice,
          product.discount,
          product.image,
          product.brand,
          product.material,
          product.color,
          product.rating,
          product.sizes,
          product.country,
          product.reviews
        );
      });

      stmt.finalize();
      console.log('Added initial products');
    }
  });
});

// Обработка промокодов
const promoCodesFile = path.resolve(__dirname, 'promoCodes.json');

function loadPromoCodes() {
  try {
    return fs.existsSync(promoCodesFile)
      ? JSON.parse(fs.readFileSync(promoCodesFile))
      : {};
  } catch (e) {
    return {};
  }
}

function savePromoCodes(promoCodes) {
  fs.writeFileSync(promoCodesFile, JSON.stringify(promoCodes, null, 2));
}

const promoCodes = loadPromoCodes();

function generatePromoCode() {
  return `DOMINIK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

// Настройка почтового клиента
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// API Endpoints

// Получение списка товаров
app.get('/api/products', (req, res) => {
  const {
    category,
    subcategory,
    discount,
    brand,
    material,
    color,
    size,
    country,
    price,
    sortBy,
    search,
  } = req.query;

  let query = `SELECT * FROM products WHERE 1=1`;
  const params = [];

  if (category) {
    query += ` AND category = ?`;
    params.push(decodeURIComponent(category));
  }

  if (subcategory) {
    query += ` AND subcategory = ?`;
    params.push(decodeURIComponent(subcategory));
  }

  if (discount === 'true') {
    query += ` AND discount != ''`;
  }

  if (brand) {
    query += ` AND brand IN (${brand
      .split(',')
      .map(() => '?')
      .join(',')})`;
    params.push(...brand.split(',').map(decodeURIComponent));
  }

  if (material) {
    query += ` AND material IN (${material
      .split(',')
      .map(() => '?')
      .join(',')})`;
    params.push(...material.split(',').map(decodeURIComponent));
  }

  if (color) {
    query += ` AND color IN (${color
      .split(',')
      .map(() => '?')
      .join(',')})`;
    params.push(...color.split(',').map(decodeURIComponent));
  }

  if (size) {
    query += ` AND sizes LIKE ?`;
    params.push(`%${size}%`);
  }

  if (country) {
    query += ` AND country IN (${country
      .split(',')
      .map(() => '?')
      .join(',')})`;
    params.push(...country.split(',').map(decodeURIComponent));
  }

  if (price) {
    const priceFilters = price.split(',');
    const priceConditions = priceFilters
      .map((p) => {
        const [min, max] = p.split('-');
        if (min && max) {
          params.push(parseInt(min), parseInt(max));
          return '(price BETWEEN ? AND ?)';
        }
        if (min) {
          params.push(parseInt(min));
          return 'price >= ?';
        }
        if (max) {
          params.push(parseInt(max));
          return 'price <= ?';
        }
        return '';
      })
      .filter(Boolean);

    if (priceConditions.length) {
      query += ` AND (${priceConditions.join(' OR ')})`;
    }
  }

  if (search) {
    query += ` AND name LIKE ?`;
    params.push(`%${decodeURIComponent(search)}%`);
  }

  if (sortBy) {
    const decodedSortBy = decodeURIComponent(sortBy);
    switch (decodedSortBy) {
      case 'Новинки':
        query += ` ORDER BY 
          CASE WHEN created_at IS NOT NULL THEN created_at 
               ELSE '1970-01-01' 
          END DESC`;
        break;
      case 'Сначала дороже':
        query += ' ORDER BY price DESC';
        break;
      case 'Сначала дешевле':
        query += ' ORDER BY price ASC';
        break;
      case 'По величине скидки':
        query += ` ORDER BY 
          CASE WHEN discount != '' 
               THEN CAST(REPLACE(discount, "%", "") AS INTEGER) 
               ELSE 0 
          END DESC`;
        break;
      default:
        query += ' ORDER BY created_at DESC';
    }
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    const processed = rows.map((row) => ({
      ...row,
      rating: parseFloat(row.rating) || 0,
      reviews: parseInt(row.reviews) || 0,
      sizes: row.sizes ? row.sizes.split(',') : [],
      discount: row.discount || null,
    }));

    res.json(processed);
  });
});

// Аутентификация пользователя
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT id, email, name FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка базы данных' });
      }
      if (!user) {
        return res.status(401).json({ error: 'Неверные учетные данные' });
      }

      res.json({
        message: 'Успешный вход',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    }
  );
});

// Регистрация пользователя
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  if (password.length < 8 || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return res.status(400).json({
      error:
        'Пароль должен содержать минимум 8 символов, одну заглавную букву и цифру',
    });
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Ошибка базы данных' });
      }
      if (existingUser) {
        return res.status(400).json({ error: 'Email уже зарегистрирован' });
      }

      db.run(
        'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
        [email, password, name],
        function (err) {
          if (err) {
            return res
              .status(500)
              .json({ error: 'Ошибка создания пользователя' });
          }

          res.json({
            message: 'Пользователь успешно зарегистрирован',
            userId: this.lastID,
          });
        }
      );
    }
  );
});

// Подписка и промокоды
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Некорректный email' });
  }

  if (promoCodes[email]) {
    return res.json({
      message: 'Вы уже получили промокод!',
      promoCode: promoCodes[email],
    });
  }

  const promoCode = generatePromoCode();
  promoCodes[email] = promoCode;
  savePromoCodes(promoCodes);

  try {
    await transporter.sendMail({
      from: `Dominik Store <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Ваш промокод от Dominik Store!',
      html: `
        <h1>Спасибо за подписку!</h1>
        <p>Ваш промокод: <strong>${promoCode}</strong></p>
        <p>Используйте его при оформлении заказа для получения скидки 10%!</p>
      `,
    });
    res.json({ message: 'Промокод отправлен на вашу почту' });
  } catch (error) {
    console.error('Ошибка отправки:', error);
    res.status(500).json({ message: 'Ошибка отправки письма' });
  }
});

// Обслуживание фронтенда
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Режим работы: ${process.env.NODE_ENV || 'development'}`);
});
