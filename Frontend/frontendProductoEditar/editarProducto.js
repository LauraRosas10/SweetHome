const API = "http://localhost:8080";

// ========== INICIALIZACIÓN ==========
window.addEventListener("DOMContentLoaded", () => {
    verificarSesion();
    cargarProducto();
    cargarCategorias();
    
    document.getElementById("formEditar").addEventListener("submit", async (e) => {
        e.preventDefault();
        await guardarCambios();
    });
});

// ========== VERIFICAR SESIÓN ==========
function verificarSesion() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
        alert("Debes iniciar sesión");
        window.location.href = "../frontLogin/login_html.html";
    }
}

// ========== CARGAR PRODUCTO ==========
async function cargarProducto() {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        if (!productId) {
            alert("No se especificó un producto");
            history.back();
            return;
        }

        const res = await fetch(`${API}/producto/${productId}`);
        if (!res.ok) throw new Error("Producto no encontrado");

        const producto = await res.json();
        
        // Verificar que es propietario
        const userId = localStorage.getItem("userId");
        if (producto.id_usuario.id_usuario != userId) {
            alert("No tienes permiso para editar este producto");
            history.back();
            return;
        }

        mostrarProducto(producto);

    } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar el producto");
        history.back();
    }
}

// ========== MOSTRAR PRODUCTO EN FORMULARIO ==========
function mostrarProducto(producto) {
    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("stock").value = producto.stock;
    document.getElementById("categoria").value = producto.id_categoria.id_categoria;
    
    if (producto.imagen) {
        document.getElementById("imagenActual").src = producto.imagen;
    }
}

// ========== CARGAR CATEGORÍAS ==========
async function cargarCategorias() {
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/categorias/`, {
            headers: { "Authorization": "Bearer "+token }
        });

        if (!res.ok) throw new Error("Error al cargar categorías");

        const categorias = await res.json();
        const select = document.getElementById("categoria");
        select.innerHTML = '<option value="">Selecciona una categoría</option>';

        categorias.forEach((cat) => {
            const option = document.createElement("option");
            option.value = cat.id_categoria;
            option.textContent = cat.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

// ========== GUARDAR CAMBIOS ==========
async function guardarCambios() {
    try {
        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");
        const token = localStorage.getItem("token");
        const userId = parseInt(localStorage.getItem("userId"), 10);

        const categoriaId = parseInt(document.getElementById("categoria").value, 10);

        const payload = {
            nombre: document.getElementById("nombre").value.trim(),
            descripcion: document.getElementById("descripcion").value.trim(),
            precio: parseFloat(document.getElementById("precio").value),
            stock: parseInt(document.getElementById("stock").value, 10),
            id_categoria: {
                id_categoria: categoriaId
            },
            id_usuario: {
                id_usuario: userId
            }
        };

        console.log("Payload a enviar:", payload);

        const res = await fetch(`${API}/producto/editar/${productId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer "+token
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(error);
        }

        const actualizado = await res.json();
        console.log("Producto actualizado:", actualizado);

        // Si hay imagen nueva, subirla
        const files = document.getElementById("imagenes").files;
        if (files.length > 0) {
            await subirImagenNueva(productId, files, token);
        }

        alert("Producto actualizado correctamente");
        window.location.href = `../frontendDetalles/Detalles.html?id=${productId}`;

    } catch (error) {
        console.error("Error:", error);
        alert("Error al guardar: " + error.message);
    }
}

// ========== SUBIR IMAGEN NUEVA ==========
async function subirImagenNueva(productId, files, token) {
    try {
        const formData = new FormData();
        for (let f of files) {
            formData.append("files", f);
        }

        const res = await fetch(`${API}/producto/${productId}/imagenes`, {
            method: "POST",
            headers: { "Authorization":"Bearer "+ token },
            body: formData
        });

        if (!res.ok) {
            console.warn("Error al subir imagen");
        } else {
            console.log("Imagen actualizada");
        }
    } catch (error) {
        console.error("Error subiendo imagen:", error);
    }
}