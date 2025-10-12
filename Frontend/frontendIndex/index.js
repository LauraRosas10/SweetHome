const API = "http://localhost:8080";
let todosLosProductos = [];

// ========== INICIALIZACIÓN ==========
window.addEventListener("DOMContentLoaded", () => {
    cargarCategorias();
    cargarProductosDestacados();
    configurarTiendaLink();
    actualizarIconoUsuario();
});
//============ Verificacion de session =========
function actualizarIconoUsuario() {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userIcon = document.getElementById("userIcon");
    
    if (!userIcon) return;
    
    if (token && userName) {
        // Usuario logueado - mostrar cerrar sesión
        userIcon.innerHTML = `<i class="fas fa-sign-out-alt"></i>`;
        userIcon.href = "#";
        userIcon.title = userName + " - Click para cerrar sesión";
        userIcon.onclick = (e) => {
            e.preventDefault();
            logout();
        };
    } else {
        // Usuario no logueado - mostrar login
        userIcon.href = "../frontendLogin/login_html.html";
        userIcon.innerHTML = `<i class="fas fa-user"></i>`;
        userIcon.title = "Iniciar sesión";
        userIcon.onclick = null;
    }
}

function logout() {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
        localStorage.clear();
        alert("Sesión cerrada");
        location.reload();
    }
}


// ========== ENLACE TIENDA ==========
function configurarTiendaLink() {
    const link = document.getElementById("tiendaLink");
    if (!link) return; // Si no existe el elemento, no hace nada
    
    link.addEventListener("click", (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = "/Frontend/frontendTienda/tienda.html";
        } else {
            window.location.href = "/Frontend/frontendLogin/login_html.html";
        }
    });
}

// ========== CATEGORÍAS ==========
async function cargarCategorias() {
    try {
        const res = await fetch(`${API}/categorias/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const categorias = await res.json();

        const menu = document.getElementById("categoriesMenu");
        if (!menu) return; // Si no existe el elemento, no hace nada
        
        menu.innerHTML = "";

        categorias.forEach(cat => {
            const item = document.createElement("div");
            item.href = "#";
            item.textContent = cat.nombre;
            item.addEventListener("click", (e) => {
                e.preventDefault();
                filtrarPorCategoria(cat.id_categoria);
            });
            menu.appendChild(item);
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
    }
}

// ========== PRODUCTOS DESTACADOS ==========
async function cargarProductosDestacados() {
    try {
        // CORREGIDO: /producto/ en lugar de /productos/
        const res = await fetch(`${API}/producto/`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const productos = await res.json();
        todosLosProductos = productos;
        mostrarProductos(productos.slice(0, 6)); // solo los primeros 6
    } catch (error) {
        console.error("Error cargando productos:", error);
        const container = document.getElementById("productosContainer");
        if (container) {
            container.innerHTML = "<p>Error al cargar productos. Intenta nuevamente.</p>";
        }
    }
}

function mostrarProductos(productos) {
    const container = document.getElementById("productosContainer");
    if (!container) return; // Si no existe el elemento, no hace nada
    
    if (!productos || productos.length === 0) {
        container.innerHTML = "<p>No hay productos disponibles.</p>";
        return;
    }

    container.innerHTML = productos
        .map(p => `
            <div class="producto-card">
                <div class="producto-imagen">
                    ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}">` : "<i class='fas fa-box' style='font-size:50px;color:#ccc;'></i>"}
                </div>
                <div class="producto-info">
                    <h3>${p.nombre}</h3>
                    <p class="precio">$${p.precio.toLocaleString('es-CO')}</p>
                    <p class="stock">Stock: ${p.stock}</p>
                </div>
            </div>
        `)
        .join("");
}


// ========== BUSCADOR ==========
function buscarProductos() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;
    
    const texto = searchInput.value.toLowerCase().trim();
    
    if (!texto) {
        mostrarProductos(todosLosProductos.slice(0, 6));
        return;
    }
    
    const filtrados = todosLosProductos.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(texto))
    );
    mostrarProductos(filtrados);
}

// ========== FILTRAR POR CATEGORÍA ==========
function filtrarPorCategoria(idCategoria) {
    const filtrados = todosLosProductos.filter(p => 
        p.id_categoria && p.id_categoria.id_categoria === idCategoria
    );
    mostrarProductos(filtrados);
}