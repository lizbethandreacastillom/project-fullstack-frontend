const API_URL = "https://project-fullstack-backend.onrender.com";

let token = null;

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("btnLogin");
  const logoutBtn = document.getElementById("btnLogout");
  const saveBtn = document.getElementById("btnSave");
  const pokemonBtn = document.getElementById("btnPokemon");

  loginBtn.addEventListener("click", login);
  logoutBtn.addEventListener("click", logout);
  saveBtn.addEventListener("click", saveProduct);
  pokemonBtn.addEventListener("click", loadPokemon);
});

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!username || !password) {
    alert("Ingresa usuario y contraseña");
    return;
  }

  fetch(`${API_BASE_URL.replace("/api", "")}/users/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Usuario o contraseña incorrectos");
      return res.json();
    })
    .then((data) => {
      token = data.access;
      document.getElementById("login-section").style.display = "none";
      document.getElementById("app-section").style.display = "block";
      loadProducts();
    })
    .catch((err) => {
      alert(err.message);
    });
}

function logout() {
  token = null;
  document.getElementById("login-section").style.display = "block";
  document.getElementById("app-section").style.display = "none";
  clearForm();
  clearProductsTable();
}

function loadProducts() {
  fetch(`${API_BASE_URL}/store/products/`, {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((products) => {
      const tbody = document.querySelector("#productsTable tbody");
      tbody.innerHTML = "";
      products.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.price}</td>
          <td>${p.stock}</td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="editProduct(${p.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    })
    .catch(() => alert("Error cargando productos"));
}

function saveProduct() {
  const id = document.getElementById("prodId").value;
  const name = document.getElementById("prodName").value.trim();
  const price = parseFloat(document.getElementById("prodPrice").value);
  const stock = parseInt(document.getElementById("prodStock").value);

  if (!name || isNaN(price) || isNaN(stock)) {
    alert("Por favor completa todos los campos correctamente");
    return;
  }

  const method = id ? "PUT" : "POST";
  const url = id
    ? `${API_BASE_URL}/store/products/${id}/`
    : `${API_BASE_URL}/store/products/`;

  fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ name, price, stock }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error guardando producto");
      return res.json();
    })
    .then(() => {
      clearForm();
      loadProducts();
    })
    .catch((err) => alert(err.message));
}

function editProduct(id) {
  fetch(`${API_BASE_URL}/store/products/${id}/`, {
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => res.json())
    .then((p) => {
      document.getElementById("prodId").value = p.id;
      document.getElementById("prodName").value = p.name;
      document.getElementById("prodPrice").value = p.price;
      document.getElementById("prodStock").value = p.stock;
    })
    .catch(() => alert("Error al cargar producto"));
}

function deleteProduct(id) {
  if (!confirm("¿Eliminar producto?")) return;
  fetch(`${API_BASE_URL}/store/products/${id}/`, {
    method: "DELETE",
    headers: { Authorization: "Bearer " + token },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error eliminando producto");
      loadProducts();
    })
    .catch((err) => alert(err.message));
}

function clearForm() {
  document.getElementById("prodId").value = "";
  document.getElementById("prodName").value = "";
  document.getElementById("prodPrice").value = "";
  document.getElementById("prodStock").value = "";
}

function clearProductsTable() {
  const tbody = document.querySelector("#productsTable tbody");
  tbody.innerHTML = "";
}

function loadPokemon() {
  fetch(`${API_BASE_URL}/store/products/pokemon/`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("pokeResult").innerText = JSON.stringify(data, null, 2);
    })
    .catch(() => alert("Error cargando datos de Pokémon"));
}
