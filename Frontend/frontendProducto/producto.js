// ============================
// Configuración de endpoints
// ============================
const API        = "http://localhost:8080";
const LOGIN_PATH = "/Frontend/frontLogin/login_html.html";

// ============================
// Verificar sesión al cargar la página
// ============================
window.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  
  if (!token || !userId) {
    console.log("No hay sesión activa, redirigiendo a login...");
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    window.location.href = LOGIN_PATH;
    return;
  }
  
  console.log("Usuario logueado con ID:", userId);
  initProductoPage();
});

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

  cargarCategorias();
}

// ============================
// Función para cargar categorías
// ============================
async function cargarCategorias() {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/categorias/`, {
      headers: { "Authorization": token }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} al cargar categorías`);
    }

    const categorias = await res.json();
    const select = document.getElementById("categoria");
    select.innerHTML = '<option value="">Selecciona una categoría</option>';

    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id_categoria;
      option.textContent = cat.nombre || cat.Nombre;
      select.appendChild(option);
    });
    
    console.log("Categorías cargadas:", categorias.length);
  } catch (error) {
    console.error("Error cargando categorías:", error);
    alert("No se pudieron cargar las categorías: " + error.message);
  }
}

// ============================
// Función para crear producto y subir imágenes
// ============================
async function enviarProducto() {
  try {
    const token = localStorage.getItem("token");
    const userId = parseInt(localStorage.getItem("userId"), 10);

    if (!token || !userId || isNaN(userId)) {
      alert("Sesión expirada. Por favor inicia sesión nuevamente.");
      localStorage.clear();
      window.location.href = LOGIN_PATH;
      return;
    }

    const categoriaId = parseInt(document.getElementById("categoria").value, 10);
    if (!categoriaId || isNaN(categoriaId)) {
      alert("Debes seleccionar una categoría válida");
      return;
    }

    const payload = {
      nombre: document.getElementById("nombre").value.trim(),
      stock: parseInt(document.getElementById("stock").value, 10),
      precio: parseFloat(document.getElementById("precio").value),
      descripcion: document.getElementById("descripcion").value.trim(),
      id_categoria: { 
        id_categoria: categoriaId 
      },
      id_usuario: { 
        id_usuario: userId 
      }
    };

    // Validar campos obligatorios
    if (!payload.nombre || !payload.descripcion) {
      alert("Nombre y descripción son obligatorios");
      return;
    }
    
    if (isNaN(payload.stock) || payload.stock < 0) {
      alert("El stock debe ser un número válido");
      return;
    }
    
    if (isNaN(payload.precio) || payload.precio <= 0) {
      alert("El precio debe ser un número válido mayor a 0");
      return;
    }

    console.log("Payload a enviar:", JSON.stringify(payload, null, 2));

    // CREAR EL PRODUCTO
    const createRes = await fetch(`${API}/producto/nuevo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(payload)
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      console.error("Error del servidor:", errText);
      throw new Error("Error al crear producto: " + errText);
    }

    const creado = await createRes.json();
    console.log("Producto creado exitosamente:", creado);

    // SUBIR IMÁGENES SI EXISTEN
    const prodId = creado.id_producto;
    const files = document.getElementById("imagenes").files;

    if (files.length > 0) {
      console.log("Subiendo", files.length, "imagen(es)...");
      
      const formData = new FormData();
      for (let f of files) {
        formData.append("files", f);
      }

      const upRes = await fetch(`${API}/producto/${prodId}/imagenes`, {
        method: "POST",
        headers: { 
          "Authorization": token 
        },
        body: formData
      });

      if (!upRes.ok) {
        const errUp = await upRes.text();
        console.warn("Error al subir imágenes:", errUp);
        alert("Producto creado, pero hubo un problema al subir las imágenes");
        volverTienda();
        return;
      }
      
      console.log("Imágenes subidas con éxito");
      alert("Producto e imágenes creados correctamente");
    } else {
      alert("Producto creado correctamente (sin imágenes)");
    }

    // LIMPIAR FORMULARIO Y VOLVER
    document.getElementById("formProducto").reset();
    volverTienda();
    
  } catch (error) {
    console.error("Error en enviarProducto:", error);
    alert(error.message || "Ocurrió un error al crear el producto");
  }
}

// ============================
// Volver a la tienda
// ============================
function volverTienda() {
    window.location.href = "../frontendTienda/tienda.html";
}