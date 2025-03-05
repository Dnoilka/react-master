require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Разрешены только изображения!'), false);
    }
  },
});

// Настройка Passport
app.use(passport.initialize());

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      const db = new sqlite3.Database(
        path.resolve(__dirname, 'database.sqlite')
      );

      db.get(
        'SELECT * FROM users WHERE email = ?',
        [profile.emails[0].value],
        (err, user) => {
          if (err) return done(err);

          if (!user) {
            db.run(
              'INSERT INTO users (email, patronymic, surname , name, isVerified, authMethod) VALUES (?, ?, TRUE, "google")',
              [profile.emails[0].value, profile.displayName],
              function (err) {
                if (err) return done(err);

                const newUser = {
                  id: this.lastID,
                  email: profile.emails[0].value,
                  name: profile.displayName,
                  surname: profile.displayName,
                  patronymic: profile.name.display,
                  isVerified: true,
                  authMethod: 'google',
                };
                db.close();
                return done(null, newUser);
              }
            );
          } else {
            db.close();
            return done(null, user);
          }
        }
      );
    }
  )
);

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const dbFilePath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbFilePath);

// Инициализация базы данных
db.serialize(() => {
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

  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    surname TEXT,
    patronymic TEXT,
    avatar TEXT,
    isVerified BOOLEAN DEFAULT FALSE,
    verificationToken TEXT,
    resetPasswordToken TEXT,
    resetPasswordExpires DATETIME,
    authMethod TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.get('SELECT COUNT(*) AS count FROM products', (err, row) => {
    if (err) return console.error('Ошибка при проверке продуктов:', err);

    if (row.count === 0) {
      const products = [
        {
          name: 'Мужские классические брюки',
          category: 'Одежда',
          subcategory: 'Брюки',
          price: 6000,
          image:
            'https://a.lmcdn.ru/img389x562/M/P/MP002XM0S8DI_13019465_1_v1_2x.jpg',
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
          image:
            'https://img0.happywear.ru/502x758/cache/goods/H/F/HF77111_%D1%87%D0%B5%D1%80%D0%BD%D1%8B%D0%B9_front.jpg',
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
      console.log('Добавлены начальные продукты');
    }
  });
});

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Генерация JWT токена
const generateAuthToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Middleware аутентификации
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Маршруты аутентификации
app.post('/api/register', async (req, res) => {
  const { name, surname, patronymic, email, password } = req.body;

  try {
    if (
      !password ||
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      return res.status(400).json({
        error:
          'Пароль должен содержать минимум 8 символов, одну заглавную букву и цифру',
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = crypto.randomBytes(20).toString('hex');

    db.run(
      `INSERT INTO users (email, password,patronymic, surname, name, verificationToken, authMethod) 
       VALUES (?, ?, ?, ?, "email")`,
      [email, hashedPassword, patronymic, surname, name, verificationToken],
      function (err) {
        if (err) {
          return res.status(400).json({ error: 'Email уже зарегистрирован' });
        }

        const verificationLink = `http://localhost:${PORT}/verify-email?token=${verificationToken}`;
        res.json({
          message: 'Регистрация успешна! Проверьте ваш email для подтверждения',
        });

        transporter
          .sendMail({
            from: `Dominik Store <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Подтверждение email',
            html: `
            <h1>Подтвердите ваш email</h1>
            <p>Пожалуйста, перейдите по ссылке для подтверждения: 
              <a href="${verificationLink}">${verificationLink}</a>
            </p>
          `,
          })
          .catch((error) => {
            console.error('Ошибка при отправке email:', error);
          });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/verify-email', (req, res) => {
  const { token } = req.query;

  db.get(
    'SELECT * FROM users WHERE verificationToken = ?',
    [token],
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: 'Неверный токен подтверждения',
        });
      }

      db.run(
        'UPDATE users SET isVerified = TRUE, verificationToken = NULL WHERE id = ?',
        [user.id],
        (err) => {
          if (err) return res.status(500).json({ error: 'Ошибка сервера' });
          res.json({
            success: true,
            message: 'Email успешно подтвержден',
          });
        }
      );
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: 'Email не подтвержден' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const token = generateAuthToken(user);
    res.json({
      message: 'Успешный вход',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  });
});

app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000;

    db.run(
      'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
      [resetToken, resetExpires, user.id],
      async (err) => {
        if (err) return res.status(500).json({ error: 'Ошибка сервера' });

        const resetLink = `http://localhost:${PORT}/reset-password?token=${resetToken}`;
        await transporter.sendMail({
          from: `Dominik Store <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Сброс пароля',
          html: `
            <h1>Сброс пароля</h1>
            <p>Для сброса пароля перейдите по ссылке: 
              <a href="${resetLink}">${resetLink}</a>
            </p>
            <p>Ссылка действительна 1 час.</p>
          `,
        });

        res.json({ message: 'Ссылка для сброса пароля отправлена на email' });
      }
    );
  });
});

app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
    [token, Date.now()],
    async (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({ error: 'Неверный или просроченный токен' });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        db.run(
          'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
          [hashedPassword, user.id],
          (err) => {
            if (err) return res.status(500).json({ error: 'Ошибка сервера' });
            res.json({ message: 'Пароль успешно изменен' });
          }
        );
      } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
      }
    }
  );
});

app.get('/api/verify-token', authenticateJWT, (req, res) => {
  db.get('SELECT * FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ valid: false });
    }
    res.json({ valid: true, user });
  });
});

// Google OAuth Routes
app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const user = req.user;
    const token = generateAuthToken(user);
    res.redirect(`http://localhost:${PORT}/auth-success?token=${token}`);
  }
);

// Маршруты продуктов
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
      console.error('Ошибка базы данных:', err);
      return res.status(500).json({ error: 'Ошибка базы данных' });
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

// Эндпоинт для загрузки аватара
app.post(
  '/api/upload-avatar',
  authenticateJWT,
  upload.single('avatar'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
      }

      const avatarPath = `/uploads/${req.file.filename}`;

      db.run(
        'UPDATE users SET avatar = ? WHERE id = ?',
        [avatarPath, req.user.id],
        function (err) {
          if (err) {
            console.error('Ошибка базы данных:', err);
            return res.status(500).json({ error: 'Ошибка базы данных' });
          }

          db.get(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id],
            (err, user) => {
              if (err)
                return res.status(500).json({ error: 'Ошибка базы данных' });

              res.json({
                message: 'Аватар успешно загружен',
                avatarUrl: avatarPath,
                user,
              });
            }
          );
        }
      );
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      res.status(500).json({ error: 'Ошибка загрузки' });
    }
  }
);

// Обработка всех остальных запросов
app.get('*', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'frontend', 'dist', 'index.html'),
    (err) => {
      if (err) {
        res.status(500).send(err);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log(`Режим работы: ${process.env.NODE_ENV || 'development'}`);
});
