// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user'));

// Elementos del DOM
const elements = {
  // Autenticación
  authSection: document.getElementById('auth-section'),
  appSection: document.getElementById('app-section'),
  userInfo: document.getElementById('userInfo'),
  userDisplay: document.getElementById('userDisplay'),
  
  // Login
  username: document.getElementById('username'),
  password: document.getElementById('password'),
  btnLogin: document.getElementById('btnLogin'),
  loginMsg: document.getElementById('loginMsg'),
  
  // Registro
  registerSection: document.getElementById('register-section'),
  regUsername: document.getElementById('regUsername'),
  regEmail: document.getElementById('regEmail'),
  regPassword: document.getElementById('regPassword'),
  btnRegister: document.getElementById('btnRegister'),
  btnShowRegister: document.getElementById('btnShowRegister'),
  btnShowLogin: document.getElementById('btnShowLogin'),
  registerMsg: document.getElementById('registerMsg'),
  
  // Logout
  btnLogout: document.getElementById('btnLogout'),
  
  // Libros
  booksTable: document.getElementById('booksTable'),
  bookModal: document.getElementById('bookModal'),
  bookForm: document.getElementById('bookForm'),
  modalTitle: document.getElementById('modalTitle'),
  btnSaveBook: document.getElementById('btnSaveBook'),
  
  // Campos del formulario de libro
  bookId: document.getElementById('bookId'),
  bookTitle: document.getElementById('bookTitle'),
  bookAuthor: document.getElementById('bookAuthor'),
  bookIsbn: document.getElementById('bookIsbn'),
  bookPrice: document.getElementById('bookPrice'),
  bookStock: document.getElementById('bookStock'),
  bookGenre: document.getElementById('bookGenre'),
  bookYear: document.getElementById('bookYear'),
  
  // APIs Externas
  pokemonLimit: document.getElementById('pokemonLimit'),
  btnPokemon: document.getElementById('btnPokemon'),
  pokemonResult: document.getElementById('pokemonResult'),
  
  weatherCity: document.getElementById('weatherCity'),
  btnWeather: document.getElementById('btnWeather'),
  weatherResult: document.getElementById('weatherResult'),
  
  // Loading
  loadingSpinner: document.getElementById('loadingSpinner')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  if (token && currentUser) {
    showAppSection();
    loadBooks();
  } else {
    showAuthSection();
  }
}

function setupEventListeners() {
  // Autenticación
  elements.btnLogin.addEventListener('click', handleLogin);
  elements.btnRegister.addEventListener('click', handleRegister);
  elements.btnShowRegister.addEventListener('click', showRegisterForm);
  elements.btnShowLogin.addEventListener('click', showLoginForm);
  elements.btnLogout.addEventListener('click', handleLogout);
  
  // Libros
  elements.btnSaveBook.addEventListener('click', handleSaveBook);
  
  // APIs Externas
  elements.btnPokemon.addEventListener('click', loadPokemon);
  elements.btnWeather.addEventListener('click', loadWeather);
  
  // Enter key en formularios
  elements.password.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  
  elements.regPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleRegister();
  });
}

// ===== FUNCIONES DE AUTENTICACIÓN =====

async function handleLogin() {
  const username = elements.username.value.trim();
  const password = elements.password.value.trim();
  
  if (!username || !password) {
    showMessage(elements.loginMsg, 'Por favor completa todos los campos', 'danger');
    return;
  }
  
  showLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en el login');
    }
    
    // Guardar token y usuario
    token = data.token;
    currentUser = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    showMessage(elements.loginMsg, 'Login exitoso', 'success');
    setTimeout(() => {
      showAppSection();
      loadBooks();
    }, 1000);
    
  } catch (error) {
    showMessage(elements.loginMsg, error.message, 'danger');
  } finally {
    showLoading(false);
  }
}

async function handleRegister() {
  const username = elements.regUsername.value.trim();
  const email = elements.regEmail.value.trim();
  const password = elements.regPassword.value.trim();
  
  if (!username || !email || !password) {
    showMessage(elements.registerMsg, 'Por favor completa todos los campos', 'danger');
    return;
  }
  
  if (password.length < 6) {
    showMessage(elements.registerMsg, 'La contraseña debe tener al menos 6 caracteres', 'danger');
    return;
  }
  
  showLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error en el registro');
    }
    
    showMessage(elements.registerMsg, 'Usuario registrado exitosamente', 'success');
    setTimeout(() => {
      showLoginForm();
    }, 1500);
    
  } catch (error) {
    showMessage(elements.registerMsg, error.message, 'danger');
  } finally {
    showLoading(false);
  }
}

function handleLogout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showAuthSection();
  clearBooksTable();
}

// ===== FUNCIONES DE LIBROS (CRUD) =====

async function loadBooks() {
  showLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/library/books`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Error cargando libros');
    }
    
    const books = await response.json();
    displayBooks(books);
    
  } catch (error) {
    showAlert('Error cargando libros: ' + error.message, 'danger');
  } finally {
    showLoading(false);
  }
}

function displayBooks(books) {
  const tbody = elements.booksTable.querySelector('tbody');
  tbody.innerHTML = '';
  
  if (books.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-muted">No hay libros disponibles</td></tr>';
    return;
  }
  
  books.forEach(book => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.id}</td>
      <td><strong>${book.title}</strong></td>
      <td>${book.author}</td>
      <td><code>${book.isbn}</code></td>
      <td>€${book.price.toFixed(2)}</td>
      <td>
        <span class="badge ${book.stock > 10 ? 'bg-success' : book.stock > 0 ? 'bg-warning' : 'bg-danger'}">
          ${book.stock}
        </span>
      </td>
      <td><span class="badge bg-info">${book.genre}</span></td>
      <td>${book.publishedYear}</td>
      <td>
        <button class="btn btn-sm btn-primary me-1" onclick="editBook(${book.id})" title="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteBook(${book.id})" title="Eliminar">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function handleSaveBook() {
  const bookData = {
    title: elements.bookTitle.value.trim(),
    author: elements.bookAuthor.value.trim(),
    isbn: elements.bookIsbn.value.trim(),
    price: parseFloat(elements.bookPrice.value),
    stock: parseInt(elements.bookStock.value),
    genre: elements.bookGenre.value,
    publishedYear: parseInt(elements.bookYear.value)
  };
  
  // Validación
  if (!bookData.title || !bookData.author || !bookData.isbn) {
    showAlert('Por favor completa todos los campos obligatorios', 'warning');
    return;
  }
  
  if (isNaN(bookData.price) || bookData.price < 0) {
    showAlert('El precio debe ser un número positivo', 'warning');
    return;
  }
  
  if (isNaN(bookData.stock) || bookData.stock < 0) {
    showAlert('El stock debe ser un número entero positivo', 'warning');
    return;
  }
  
  if (isNaN(bookData.publishedYear) || bookData.publishedYear < 1000 || bookData.publishedYear > 2024) {
    showAlert('El año de publicación debe ser válido', 'warning');
    return;
  }
  
  showLoading(true);
  
  try {
    const bookId = elements.bookId.value;
    const method = bookId ? 'PUT' : 'POST';
    const url = bookId 
      ? `${API_BASE_URL}/library/books/${bookId}`
      : `${API_BASE_URL}/library/books`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Error guardando libro');
    }
    
    // Cerrar modal y recargar
    const modal = bootstrap.Modal.getInstance(elements.bookModal);
    modal.hide();
    
    showAlert(bookId ? 'Libro actualizado exitosamente' : 'Libro creado exitosamente', 'success');
    loadBooks();
    
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  } finally {
    showLoading(false);
  }
}

async function editBook(id) {
  showLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/library/books/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Error cargando libro');
    }
    
    const book = await response.json();
    
    // Llenar formulario
    elements.bookId.value = book.id;
    elements.bookTitle.value = book.title;
    elements.bookAuthor.value = book.author;
    elements.bookIsbn.value = book.isbn;
    elements.bookPrice.value = book.price;
    elements.bookStock.value = book.stock;
    elements.bookGenre.value = book.genre;
    elements.bookYear.value = book.publishedYear;
    
    // Cambiar título del modal
    elements.modalTitle.innerHTML = '<i class="fas fa-edit me-2"></i>Editar Libro';
    
    // Abrir modal
    const modal = new bootstrap.Modal(elements.bookModal);
    modal.show();
    
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  } finally {
    showLoading(false);
  }
}

async function deleteBook(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este libro?')) {
    return;
  }
  
  showLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/library/books/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Error eliminando libro');
    }
    
    showAlert('Libro eliminado exitosamente', 'success');
    loadBooks();
    
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  } finally {
    showLoading(false);
  }
}

// ===== APIs EXTERNAS =====

async function loadPokemon() {
  const limit = elements.pokemonLimit.value;
  showLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/external/pokemon?limit=${limit}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Error cargando Pokémon');
    }
    
    const data = await response.json();
    displayPokemon(data.results);
    
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  } finally {
    showLoading(false);
  }
}

function displayPokemon(pokemonList) {
  const container = elements.pokemonResult;
  container.innerHTML = '';
  
  const row = document.createElement('div');
  row.className = 'row g-3';
  
  pokemonList.forEach(pokemon => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body text-center">
          <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="img-fluid mb-2" style="width: 80px;">
          <h6 class="card-title text-capitalize">${pokemon.name}</h6>
          <p class="card-text small">
            <strong>ID:</strong> ${pokemon.id}<br>
            <strong>Altura:</strong> ${pokemon.height/10}m<br>
            <strong>Peso:</strong> ${pokemon.weight/10}kg<br>
            <strong>Tipos:</strong> ${pokemon.types.map(t => `<span class="badge bg-secondary me-1">${t}</span>`).join('')}
          </p>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
  
  container.appendChild(row);
}

async function loadWeather() {
  const city = elements.weatherCity.value.trim() || 'Madrid';
  showLoading(true);
  
  try {
    const response = await fetch(`${API_BASE_URL}/external/weather?city=${encodeURIComponent(city)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Error cargando datos del clima');
    }
    
    const data = await response.json();
    displayWeather(data);
    
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  } finally {
    showLoading(false);
  }
}

function displayWeather(weather) {
  const container = elements.weatherResult;
  container.innerHTML = `
    <div class="card">
      <div class="card-body text-center">
        <h5 class="card-title">
          <i class="fas fa-map-marker-alt me-2"></i>
          ${weather.city}, ${weather.country}
        </h5>
        <div class="row">
          <div class="col-6">
            <h2 class="text-primary">${weather.temperature}°C</h2>
            <p class="text-muted">Sensación: ${weather.feels_like}°C</p>
          </div>
          <div class="col-6">
            <p><strong>Humedad:</strong> ${weather.humidity}%</p>
            <p><strong>Condición:</strong> ${weather.description}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ===== FUNCIONES DE UI =====

function showAuthSection() {
  elements.authSection.style.display = 'block';
  elements.appSection.style.display = 'none';
  elements.userInfo.style.display = 'none';
  clearForm();
}

function showAppSection() {
  elements.authSection.style.display = 'none';
  elements.appSection.style.display = 'block';
  elements.userInfo.style.display = 'flex';
  elements.userDisplay.textContent = `Bienvenido, ${currentUser.username}`;
}

function showLoginForm() {
  elements.registerSection.style.display = 'none';
  elements.loginMsg.innerHTML = '';
  elements.registerMsg.innerHTML = '';
}

function showRegisterForm() {
  elements.registerSection.style.display = 'block';
  elements.loginMsg.innerHTML = '';
  elements.registerMsg.innerHTML = '';
}

function showLoading(show) {
  elements.loadingSpinner.style.display = show ? 'block' : 'none';
}

function showMessage(element, message, type) {
  element.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>`;
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(alertDiv);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alertDiv.parentNode) {
      alertDiv.remove();
    }
  }, 5000);
}

function clearForm() {
  elements.bookId.value = '';
  elements.bookTitle.value = '';
  elements.bookAuthor.value = '';
  elements.bookIsbn.value = '';
  elements.bookPrice.value = '';
  elements.bookStock.value = '';
  elements.bookGenre.value = '';
  elements.bookYear.value = '';
  elements.modalTitle.innerHTML = '<i class="fas fa-book me-2"></i>Nuevo Libro';
}

function clearBooksTable() {
  const tbody = elements.booksTable.querySelector('tbody');
  tbody.innerHTML = '';
}

// Event listener para el modal - limpiar formulario al abrir
elements.bookModal.addEventListener('show.bs.modal', function (event) {
  if (!elements.bookId.value) {
    clearForm();
  }
});

// Event listener para el modal - limpiar formulario al cerrar
elements.bookModal.addEventListener('hidden.bs.modal', function (event) {
  clearForm();
});
