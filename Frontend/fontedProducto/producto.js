// ============================
// Configuración de endpoints
// ============================
const API        = "http://localhost:8080";
const LOGIN_PATH = "/Frontend/frontLogin/login_html.html";

// ============================
// Función para cargar categorías
// ============================
async function cargarCategorias() {
  try {
    const token = localStorage.getItem("token");
    const res   = await fetch(`${API}/categorias/`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} al cargar categorías`);
    }

    const categorias = await res.json();
    const select     = document.getElementById("categoria");
    select.innerHTML = '<option value="">Selecciona una categoría</option>';

    categorias.forEach((cat) => {
      const option       = document.createElement("option");
      option.value       = cat.id_categoria;
      option.textContent = cat.nombre || cat.Nombre;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error cargando categorías:", error);
    alert("No se pudieron cargar las categorías");
  }
}

// ============================
// Función para crear producto y subir imágenes
// ============================
async function enviarProducto() {
  try {
    const token  = localStorage.getItem("token");
    const userId = parseInt(localStorage.getItem("userId"), 10);

    if (!token || !userId) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = LOGIN_PATH;
      return;
    }

    const categoriaId = parseInt(document.getElementById("categoria").value, 10);
    if (!categoriaId) throw new Error("Debes seleccionar una categoría");

    const payload = {
      nombre:       document.getElementById("nombre").value,
      stock:        parseInt(document.getElementById("stock").value, 10),
      precio:       parseFloat(document.getElementById("precio").value),
      descripcion:  document.getElementById("descripcion").value,
      id_categoria: { id_categoria: categoriaId },
      id_usuario:   { id_usuario: userId }
    };

    console.log("Payload a enviar:", JSON.stringify(payload, null, 2));

    const createRes = await fetch(`${API}/producto/nuevo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(payload)
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error("Error al crear producto: " + errText);
    }

    const creado = await createRes.json();
    console.log("Producto creado:", creado);

    const prodId = creado.id_producto;
    const files  = document.getElementById("imagenes").files;

    if (files.length > 0) {
      const formData = new FormData();
      for (let f of files) formData.append("files", f);

      const upRes = await fetch(`${API}/producto/${prodId}/imagenes`, {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData
      });

      if (!upRes.ok) {
        const errUp = await upRes.text();
        throw new Error("Error al subir imágenes: " + errUp);
      }

      console.log("Imágenes subidas con éxito");
    }

    alert("Producto y sus imágenes creados correctamente");
  } catch (error) {
    console.error("Error en enviarProducto:", error);
    alert(error.message || "Ocurrió un error al crear el producto");
  }
}

// ============================
// Inicializar la página de producto
// ============================
function initProductoPage() {
  const form = document.getElementById("formProducto");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await enviarProducto();
    });
  } else {
    console.error("No se encontró el formulario con id='formProducto'");
  }

  cargarCategorias(); // Ahora se llama en el momento correcto
}

// ============================
// Verificar sesión al cargar la página
// ============================
window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");
  if (!token) {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = LOGIN_PATH;
    return;
  }

  if (!userId) {
    try {
      const meRes = await fetch(`${API}/usuario/me`, {
        headers: { "Authorization": "Bearer " + token }
      });
      if (!meRes.ok) throw new Error("No se pudo obtener usuario");
      const me = await meRes.json();
      userId = me.id_usuario;
      localStorage.setItem("userId", userId);
    } catch (err) {
      console.error("Error fetching userId:", err);
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = LOGIN_PATH;
      return;
    }
  }

  // Solo ahora inicializamos la página
  initProductoPage();
});
