const API = "http://localhost:8080";

window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión");
        window.location.href = "/Frontend/frontendLogin/login_html";
        return;
    }
    cargarMisProductos();
});

async function cargarMisProductos() {
    try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            console.error("No hay userId en localStorage");
            return;
        }

        const res = await fetch(`${API}/producto/`);
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }

        const productos = await res.json();
        
        const mios = productos.filter(p => 
            p.id_usuario && p.id_usuario.id_usuario == userId
        );

        mostrarProductos(mios);
    } catch (error) {
        console.error("Error cargando productos:", error);
        mostrarError("Error al cargar tus productos");
    }
}

function mostrarProductos(productos) {
    const container = document.getElementById("productosContainer");
    
    if (!container) return;

    if (!productos || productos.length === 0) {
        container.innerHTML = `
            <div class="sin-productos">
                <p>No tienes productos aún.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = productos
        .map(p => `
            <div class="producto-card">
                <div class="producto-imagen" onclick="verProducto(${p.id_producto})" style="cursor: pointer;">
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

function verProducto(productId) {
    window.location.href = `../frontendDetalles/Detalles.html?id=${productId}`;
}

function editarProducto(productId) {
    window.location.href = `../frontendProductoEditar/editarProducto.html?id=${productId}`;
}

async function eliminarProducto(productId) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        return;
    }

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/producto/borrar/${productId}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer "+token }
        });

        if (res.ok) {
            alert("Producto eliminado");
            cargarMisProductos();
        } else {
            alert("Error al eliminar");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function crearProducto() {
    window.location.href = "../frontendProducto/producto.html";
}