const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro';

// Middleware
app.use(cors());
app.use(express.json());

// Base de datos en memoria (en producción usarías una base de datos real)
let users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    email: 'admin@libreria.com',
    role: 'admin'
  },
  {
    id: 2,
    username: 'usuario',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    email: 'usuario@libreria.com',
    role: 'user'
  }
];

let books = [
  {
    id: 1,
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes',
    isbn: '978-84-376-0494-7',
    price: 25.99,
    stock: 10,
    genre: 'Novela',
    publishedYear: 1605
  },
  {
    id: 2,
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    isbn: '978-84-397-2077-7',
    price: 22.50,
    stock: 15,
    genre: 'Realismo mágico',
    publishedYear: 1967
  },
  {
    id: 3,
    title: 'El Señor de los Anillos',
    author: 'J.R.R. Tolkien',
    isbn: '978-84-450-7179-3',
    price: 35.00,
    stock: 8,
    genre: 'Fantasía',
    publishedYear: 1954
  }
];

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Validación de datos
const validateBook = [
  body('title').notEmpty().withMessage('El título es requerido'),
  body('author').notEmpty().withMessage('El autor es requerido'),
  body('isbn').notEmpty().withMessage('El ISBN es requerido'),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un número entero positivo'),
  body('genre').notEmpty().withMessage('El género es requerido'),
  body('publishedYear').isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Año de publicación inválido')
];

const validateUser = [
  body('username').isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('email').isEmail().withMessage('Email inválido')
];

// Rutas de autenticación
app.post('/api/users/register', validateUser, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Usuario o email ya existe' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      email,
      role: 'user'
    };

    users.push(newUser);

    // Generar token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de la librería (CRUD)
app.get('/api/library/books', authenticateToken, (req, res) => {
  res.json(books);
});

app.get('/api/library/books/:id', authenticateToken, (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }
  res.json(book);
});

app.post('/api/library/books', authenticateToken, validateBook, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, isbn, price, stock, genre, publishedYear } = req.body;

    // Verificar si el ISBN ya existe
    const existingBook = books.find(b => b.isbn === isbn);
    if (existingBook) {
      return res.status(400).json({ error: 'Un libro con este ISBN ya existe' });
    }

    const newBook = {
      id: books.length + 1,
      title,
      author,
      isbn,
      price: parseFloat(price),
      stock: parseInt(stock),
      genre,
      publishedYear: parseInt(publishedYear),
      createdAt: new Date().toISOString()
    };

    books.push(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.put('/api/library/books/:id', authenticateToken, validateBook, (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    const { title, author, isbn, price, stock, genre, publishedYear } = req.body;

    // Verificar si el ISBN ya existe en otro libro
    const existingBook = books.find(b => b.isbn === isbn && b.id !== bookId);
    if (existingBook) {
      return res.status(400).json({ error: 'Un libro con este ISBN ya existe' });
    }

    books[bookIndex] = {
      ...books[bookIndex],
      title,
      author,
      isbn,
      price: parseFloat(price),
      stock: parseInt(stock),
      genre,
      publishedYear: parseInt(publishedYear),
      updatedAt: new Date().toISOString()
    };

    res.json(books[bookIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/library/books/:id', authenticateToken, (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json({ error: 'Libro no encontrado' });
  }

  books.splice(bookIndex, 1);
  res.json({ message: 'Libro eliminado exitosamente' });
});

// API externa - Pokémon
app.get('/api/external/pokemon', authenticateToken, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    
    // Obtener detalles de cada Pokémon
    const pokemonPromises = response.data.results.map(async (pokemon) => {
      const pokemonResponse = await axios.get(pokemon.url);
      return {
        id: pokemonResponse.data.id,
        name: pokemonResponse.data.name,
        height: pokemonResponse.data.height,
        weight: pokemonResponse.data.weight,
        types: pokemonResponse.data.types.map(t => t.type.name),
        sprites: {
          front_default: pokemonResponse.data.sprites.front_default,
          back_default: pokemonResponse.data.sprites.back_default
        }
      };
    });

    const pokemonDetails = await Promise.all(pokemonPromises);
    
    res.json({
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: pokemonDetails
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos de Pokémon' });
  }
});

// API externa - Weather
app.get('/api/external/weather', authenticateToken, async (req, res) => {
  try {
    const { city = 'Madrid' } = req.query;
    const API_KEY = process.env.OPENWEATHER_API_KEY || 'tu_api_key_aqui';
    
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`
    );
    
    res.json({
      city: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      feels_like: response.data.main.feels_like,
      humidity: response.data.main.humidity,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener datos del clima' });
  }
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`API disponible en: http://localhost:${PORT}/api`);
});

