const API = "http://localhost:8080";

// ========== INICIALIZACIÓN ==========
window.addEventListener("DOMContentLoaded", () => {
    cargarProducto();
});

// ========== CARGAR PRODUCTO ==========
async function cargarProducto() {
    try {
        // Obtener ID del producto desde la URL
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        if (!productId) {
            alert("No se especificó un producto");
            window.history.back();
            return;
        }

        // Obtener producto del backend
        const res = await fetch(`${API}/producto/${productId}`);
        if (!res.ok) throw new Error("Producto no encontrado");

        const producto = await res.json();
        mostrarProducto(producto);
        verificarSiEsPropietario(producto);

    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar el producto");
        window.history.back();
    }
}

// ========== MOSTRAR PRODUCTO ==========
function mostrarProducto(producto) {
    document.getElementById("imagenPrincipal").src = 
        producto.imagen || "/imagenes/default.png";
    document.getElementById("nombreProducto").textContent = producto.nombre;
    document.getElementById("precioProducto").textContent = 
        "$" + producto.precio.toLocaleString('es-CO');
    document.getElementById("stockProducto").textContent = 
        "Stock: " + producto.stock;
    document.getElementById("vendedorProducto").textContent = 
        producto.id_usuario.nombre + " " + producto.id_usuario.apellidos;
    document.getElementById("categoriaProducto").textContent = 
        producto.id_categoria.nombre;
    document.getElementById("descripcionProducto").textContent = 
        producto.descripcion;
}

// ========== VERIFICAR SI ES PROPIETARIO ==========
function verificarSiEsPropietario(producto) {
    const userId = localStorage.getItem("userId");
    const botonesAdmin = document.getElementById("botonesAdmin");

    if (userId && producto.id_usuario.id_usuario == userId) {
        // Es el propietario, mostrar botones de editar/eliminar
        botonesAdmin.style.display = "flex";
    } else {
        // No es el propietario, ocultar botones
        botonesAdmin.style.display = "none";
    }
}

// ========== EDITAR PRODUCTO ==========
function editarProducto() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    window.location.href = `../frontendProductoEditar/editarProducto.html?id=${productId}`;
}

// ========== ELIMINAR PRODUCTO ==========
async function eliminarProducto() {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        return;
    }

    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/producto/borrar/${productId}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer "+token }
        });

        if (res.ok) {
            alert("Producto eliminado correctamente");
            window.location.href = "../frontendTienda/tienda.html";
        } else {
            alert("Error al eliminar el producto");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar");
    }
}

function agregarCarrito() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");
    const userId = localStorage.getItem("userId");
    
    fetch(`${API}/producto/${productId}`)
        .then(res => res.json())
        .then(producto => {
            // Verificar si es el vendedor
            if (userId && producto.id_usuario.id_usuario == userId) {
                alert("No puedes comprar tu propio producto");
                return;
            }
            
            // Si no es el vendedor, agregar al carrito
            alert("Producto agregado al carrito (función en desarrollo)");
        })
        .catch(err => {
            console.error("Error:", err);
            alert("Error al procesar");
        });
}