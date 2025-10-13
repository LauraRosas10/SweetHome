// Import Bootstrap
const bootstrap = window.bootstrap;

// URL Base de API y Endpoints
const API_BASE_URL = 'http://localhost:8080';

const ENDPOINTS = {

    CATEGORIES: `${API_BASE_URL}/categoria/`, 
    CATEGORY_BY_ID: (id) => `${API_BASE_URL}/categoria/${id}`, 
    CREATE_CATEGORY: `${API_BASE_URL}/categoria/nuevo`,
    UPDATE_CATEGORY: `${API_BASE_URL}/categoria/editar`, 

};

// Variable global para almacenar las categorías de la base de datos
let categoriasDB = []; 

// Función auxiliar para obtener el token y headers
function getAuthHeaders() {
    const token = localStorage.getItem('userToken');
    if (!token) {
   
        alert("Sesión no válida. Por favor, inicia sesión."); 
        return null;
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}



// carga y renderiza las categorias en la tabla
async function cargarCategorias() {
    const selector = document.getElementById("productoCategoria");
    // Obtener el token de localStorage (necesario para la ruta privada)
    const token = localStorage.getItem('userToken'); 
    
    selector.innerHTML = '<option value="" disabled selected>Cargando categorías...</option>'; 

    if (!token) {
        selector.innerHTML = '<option value="" disabled selected>Error: Inicia sesión para cargar categorías.</option>';
        return;
    }

    try {
        const response = await fetch(ENDPOINTS.CATEGORIES, { 
            method: 'GET',
            headers: {
            
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const categoriasDB = await response.json();
            
            // Limpiar y añadir la opción por defecto
            selector.innerHTML = '<option value="" disabled selected>-- Selecciona una Categoría --</option>'; 

            categoriasDB.forEach(categoria => {
                const option = document.createElement('option');
                
                option.value = categoria.id_categoria; 
                option.textContent = categoria.nombre;
                
                selector.appendChild(option);
            });
            console.log(" Categorías cargadas exitosamente.");
            
        } else if (response.status === 401 || response.status === 403) {
            selector.innerHTML = '<option value="" disabled selected>Error: Acceso denegado a categorías.</option>';
        } else {
            console.error(`Error ${response.status} al cargar categorías.`);
            selector.innerHTML = '<option value="" disabled selected>Error al cargar las categorías</option>'; 
        }
    } catch (error) {
        console.error("Error de red/conexión al cargar categorías:", error);
        selector.innerHTML = '<option value="" disabled selected>Error de conexión</option>'; 
    }
}


// guardar las categorias
async function guardarCategoria() {
    const headers = getAuthHeaders();
    if (!headers) return;

    const id = document.getElementById("categoriaId").value;
    const nombre = document.getElementById("categoriaNombre").value;
    const descripcion = document.getElementById("categoriaDescripcion").value;

    if (!nombre) {
        alert("El nombre es obligatorio");
        return;
    }
    
    const payload = {
        nombre: nombre,
        descripcion: descripcion

    };

    let url, method;

    if (id) {
        // ACTUALIZACIÓN (PUT)
        url = ENDPOINTS.UPDATE_CATEGORY; 
        method = 'PUT';
        payload.id_categoria = Number(id); 
    } else {
        // CREACIÓN (POST)
        url = ENDPOINTS.CREATE_CATEGORY;
        method = 'POST';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(`Categoría ${id ? 'actualizada' : 'agregada'} exitosamente.`);
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalAgregarCategoria"));
            if (modal) modal.hide();
            limpiarFormulario();
            cargarCategoriasYRenderizar(); // Recargar la tabla
        } else if (response.status === 401 || response.status === 403) {
            alert("No tienes permisos para realizar esta acción.");
        } else {
            const errorText = await response.text();
            alert(`Error ${response.status} al guardar categoría: ${errorText.substring(0, 100)}`);
        }
    } catch (error) {
        console.error("Error al guardar categoría:", error);
        alert("No se pudo conectar con el servidor para guardar la categoría.");
    }
}



//editar categoria
function editarCategoria(id) {
    // Usamos la lista local 'categoriasDB' para llenar el modal
    const categoria = categoriasDB.find((c) => c.id_categoria === id); 
    
    if (categoria) {
        document.getElementById("categoriaId").value = categoria.id_categoria;
        document.getElementById("categoriaNombre").value = categoria.nombre;
        document.getElementById("categoriaDescripcion").value = categoria.descripcion;
        document.getElementById("modalTitulo").textContent = "Editar Categoría";

        const modal = new bootstrap.Modal(document.getElementById("modalAgregarCategoria"));
        modal.show();
    } else {
        alert("Categoría no encontrada localmente. Intenta recargar la página.");
    }
}



function limpiarFormulario() {
    document.getElementById("categoriaId").value = "";
    document.getElementById("categoriaNombre").value = "";
    document.getElementById("categoriaDescripcion").value = "";
    document.getElementById("modalTitulo").textContent = "Agregar Categoría";
}


// Función principal para cargar y renderizar categorías
document.addEventListener("DOMContentLoaded", () => {
    // Llamar a la función principal para cargar y renderizar
    cargarCategoriasYRenderizar(); 

    // Limpiar formulario al cerrar modal
    document.getElementById("modalAgregarCategoria").addEventListener("hidden.bs.modal", limpiarFormulario);
    

    document.getElementById("btnGuardarCategoria").addEventListener("click", guardarCategoria);
});