const API = "http://localhost:8080"; // Ajusta si tu backend usa otro puerto o contexto

// Verificar autenticación al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/Frontend/frontLogin/login_html.html"; // Ajusta la ruta si tu login está en otra carpeta
        return;
    }

    // Configurar envío del formulario
    const form = document.getElementById("formProducto");
    if (form) {
        form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await enviarProducto();
        });
    } else {
        console.error("No se encontró el formulario con id='formProducto'");
    }

    // Cargar categorías
    cargarCategorias();
    });

    // Cargar categorías desde el backend
    async function cargarCategorias() {
    try {
        const res = await fetch(`${API}/categorias`);
        if (!res.ok) throw new Error("Error al cargar categorías");

        const categorias = await res.json();
        const select = document.getElementById("categoria");
        select.innerHTML = '<option value="">Selecciona una categoría</option>';

        categorias.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat.id_categoria;
        option.textContent = cat.nombre || cat.Nombre;
        select.appendChild(option);
        });
    } catch (error) {
        console.error("Error cargando categorías:", error);
        alert("No se pudieron cargar las categorías");
    }
    }

    // Enviar producto y subir imágenes
    async function enviarProducto() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Debes iniciar sesión");
        window.location.href = "/login.html";
        return;
    }

    const payload = {
        Nombre: document.getElementById("nombre").value,
        Precio: parseFloat(document.getElementById("precio").value),
        Stock: parseInt(document.getElementById("stock").value),
        Descripcion: document.getElementById("descripcion").value,
        Id_categoria: {
        id_categoria: parseInt(document.getElementById("categoria").value),
        },
    };

    try {
        //  Crear producto
        const createRes = await fetch(`${API}/productos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify(payload),
        });

        if (!createRes.ok) {
        alert("Error creando producto");
        return;
        }

        const creado = await createRes.json();
        const prodId = creado.id_producto || creado.Id_producto || creado.id;

        //  Subir imágenes (si hay)
        const files = document.getElementById("imagenes").files;
        if (files.length > 0) {
        const form = new FormData();
        for (let f of files) form.append("files", f);

        const upRes = await fetch(`${API}/productos/${prodId}/imagenes`, {
            method: "POST",
            headers: {
            Authorization: "Bearer " + token,
            },
            body: form,
        });

        if (!upRes.ok) {
            alert("Error subiendo imágenes");
            return;
        }
        }

        alert("Producto creado correctamente");
        window.location.href = "/";
    } catch (error) {
        console.error("Error en el proceso:", error);
        alert("Ocurrió un error al crear el producto");
    }
}
