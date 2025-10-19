const ENDPOINTS = {
  PRODUCTS: "http://localhost:8080/producto/",
  CATEGORIES: "http://localhost:8080/categoria/"
};

let categoriasGlobal = [];
let productosGlobal = [];

// Elementos del DOM
const grid = document.getElementById("productos-grid");
const loading = document.getElementById("loading");
const filtroContainer = document.getElementById("filtros-categorias");


// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
  const col = document.createElement('div');
  col.className = 'col';
  
  const imagenUrl = producto.imagen && producto.imagen.trim() !== '' 
      ? producto.imagen 
      : 'https://placehold.co/400x300/a3c6c4/ffffff?text=Producto+SWEET+HOME';

  col.innerHTML = `
    <div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
      <img 
        src="${imagenUrl}" 
        class="card-img-top" 
        alt="${producto.nombre}"
        onerror="this.src='https://placehold.co/400x300/a3c6c4/ffffff?text=Sin+Imagen';"
        style="height:230px; object-fit:cover;"
      >
      <div class="card-body d-flex flex-column">
        <h5 class="fw-bold" style="font-family:'Montserrat',sans-serif">${producto.nombre}</h5>
        <p class="text-muted small mb-1">Categoría: ${producto.id_categoria?.nombre || 'N/A'}</p>
        <p class="fw-semibold fs-5 mb-3 text-success">$${producto.precio?.toFixed(2) || '0.00'}</p>
        <button class="btn btn-outline-primary mt-auto" onclick="agregarAlCarrito(${producto.id_producto})">
          <i class="bi bi-cart-plus-fill me-1"></i> Comprar
        </button>
      </div>
    </div>
  `;
  return col;
}

// Cargar categorías y crear botones de filtro
async function cargarCategorias() {
  try {
    const token = localStorage.getItem('userToken'); 

    const response = await fetch(ENDPOINTS.CATEGORIES, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    categoriasGlobal = await response.json();

    if (!Array.isArray(categoriasGlobal) || categoriasGlobal.length === 0) {
      filtroContainer.innerHTML = `<p class="text-muted">No hay categorías disponibles.</p>`;
      return;
    }

    filtroContainer.innerHTML = '';

    // Botón para mostrar todos
    const btnTodos = document.createElement('button');
    btnTodos.className = 'btn btn-success mx-2 mb-2';
    btnTodos.textContent = 'Todos';
    btnTodos.onclick = () => renderizarProductos(productosGlobal);
    filtroContainer.appendChild(btnTodos);

    // Crear botones de categorías
    categoriasGlobal.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-outline-success mx-2 mb-2';
      btn.textContent = cat.nombre;
      btn.onclick = () => filtrarPorCategoria(cat.id_categoria);
      filtroContainer.appendChild(btn);
    });

  } catch (error) {
    console.error("Error al cargar categorías:", error);
    filtroContainer.innerHTML = `<div class="alert alert-danger">
      ⚠️ No se pudieron cargar las categorías.
    </div>`;
  }
}



// Cargar productos
async function cargarProductos() {
  try {
    loading.classList.remove('d-none');
    const response = await fetch(ENDPOINTS.PRODUCTS);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    productosGlobal = await response.json();
    renderizarProductos(productosGlobal);

  } catch (error) {
    console.error("Error al cargar productos:", error);
    grid.innerHTML = `<div class="alert alert-danger">⚠️ No se pudieron cargar los productos.</div>`;
  } finally {
    loading.classList.add('d-none');
  }
}


// Renderizar productos en el grid
function renderizarProductos(productos) {
  grid.innerHTML = '';
  if (!productos || productos.length === 0) {
    grid.innerHTML = `<div class="text-muted py-5">No hay productos para mostrar.</div>`;
    return;
  }
  productos.forEach(p => grid.appendChild(crearTarjetaProducto(p)));
}


// Filtrar productos por categoría
function filtrarPorCategoria(idCategoria) {
  const filtrados = productosGlobal.filter(p => p.id_categoria?.id_categoria === idCategoria);
  renderizarProductos(filtrados);
}

// Buscar productos por nombre
function buscarProductos() {
  const termino = document.getElementById('busquedaProducto').value.trim().toLowerCase();

  if (termino === "") {
    renderizarProductos(productosGlobal);
    return;
  }

  const filtrados = productosGlobal.filter(p =>
    p.nombre.toLowerCase().includes(termino)
  );

  renderizarProductos(filtrados);
}


// Simular agregar al carrito
function agregarAlCarrito(id) {
  alert(`Producto ${id} agregado al carrito 🛒`);
}

// Inicializar la carga al DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([cargarCategorias(), cargarProductos()]);

    // 🔍 Eventos de búsqueda
  document.getElementById('btnBuscar').addEventListener('click', buscarProductos);
  document.getElementById('busquedaProducto').addEventListener('input', buscarProductos);
});
