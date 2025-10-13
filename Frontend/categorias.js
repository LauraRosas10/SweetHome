(function() {

    const bootstrap = window.bootstrap;
    const API_BASE_URL = 'http://localhost:8080';

    const ENDPOINTS = {
        CATEGORIES: `${API_BASE_URL}/categoria/`,
        CREATE_CATEGORY: `${API_BASE_URL}/categoria/nueva`,
        UPDATE_CATEGORY: `${API_BASE_URL}/categoria/editar`,
    };

    let categoriasDB = [];

    // Obtener headers con token
    function getAuthHeaders() {
        const token = localStorage.getItem('userToken');
        const role = localStorage.getItem('userRole'); 
        console.log("Rol desde localStorage:", role); 
    if (!token || role !== 'Administrador') {
        alert("No tienes permisos para esta acción.");
        return null;
    }
        if (!token) {
            console.warn("Token no encontrado en localStorage. Sesión inválida.");
            alert("Sesión no válida. Por favor, inicia sesión.");
            return null;
        }
        return { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
    }

    
    // cargar y renderizar categorias en la tabla
    async function cargarCategoriasYRenderizar() {
        const tbody = document.getElementById("tabla-categorias");
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Cargando categorías...</td></tr>';

        const headers = getAuthHeaders();
        if (!headers) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Acceso denegado o sesión expirada.</td></tr>';
            return;
        }

        try {
            const response = await fetch(ENDPOINTS.CATEGORIES, {
                method: 'GET',
                headers
            });

            if (response.ok) {
                categoriasDB = await response.json();
                tbody.innerHTML = "";
                
                if (categoriasDB.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay categorías registradas.</td></tr>';
                } else {
                    categoriasDB.forEach((cat) => {
                        const tr = document.createElement("tr");
                        const estadoAPI = String(cat.estado).toUpperCase();
                        const estadoTexto = estadoAPI === 'ACTIVO' ? 'Habilitada' : 'Deshabilitada';
                        const estadoClase = estadoAPI === 'ACTIVO' ? 'bg-success' : 'bg-danger';

                        tr.innerHTML = `
                            <td>${cat.id_categoria}</td>
                            <td><strong>${cat.nombre}</strong></td>
                            <td>${cat.descripcion || 'N/A'}</td>
                            <td><span class="badge ${estadoClase}">${estadoTexto}</span></td>
                            <td class="text-end">
                                <button class="btn btn-sm btn-outline-primary me-2" onclick="editarCategoria(${cat.id_categoria})">
                                    <i class="bi bi-pencil"></i> Editar
                                </button>
                                <button class="btn btn-sm btn-outline-danger " 
                                    onclick="toggleCategoria(${cat.id_categoria}, '${cat.estado}')">
                                ${String(cat.estado).toUpperCase() === 'ACTIVO' ? 'Desactivar' : 'Activar'}
                            </button>


                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                }
            } else {
                const errorText = await response.text();
                console.error("Error en fetch:", response.status, errorText);
                tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error ${response.status}: ${errorText}</td></tr>`;
            }
        } catch (error) {
            console.error("Error de red/conexión:", error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">No se pudo conectar con el servidor. Revisa CORS o la URL del backend.</td></tr>';
        }
    }



    // guardar las categorias
    async function guardarCategoria() {
        const headers = getAuthHeaders();
        if (!headers) return;

        const id = document.getElementById("categoriaId").value;
        const nombre = document.getElementById("categoriaNombre").value;
        const descripcion = document.getElementById("categoriaDescripcion").value;
        const estado = document.getElementById("categoriaEstado").value;

        if (!nombre) {
            alert("El nombre es obligatorio");
            return;
        }

        const payload = { nombre, descripcion, estado: estado.toUpperCase() };
        let url = ENDPOINTS.CREATE_CATEGORY, method = 'POST';

        if (id) {
            url = ENDPOINTS.UPDATE_CATEGORY;
            method = 'PUT';
            payload.id_categoria = Number(id);
        }

        try {
            const response = await fetch(url, {
                method,
                headers,
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert(`Categoría ${id ? 'actualizada' : 'agregada'} exitosamente.`);
                limpiarFormulario(); 
    const modalElemento = document.getElementById("modalAgregarCategoria");
    

    let modal = bootstrap.Modal.getInstance(modalElemento); 
    
    if (!modal) {
        modal = new bootstrap.Modal(modalElemento);
    }
    
    modal.hide(); 

                cargarCategoriasYRenderizar();
            }
        } catch (error) {
            console.error("Error de red al guardar categoría:", error);
        }
    }

    // activar o desactivar categoria
async function toggleCategoria(id, estadoActual) {
    const headers = getAuthHeaders();
    if (!headers) return;

    // Determinar el nuevo estado
    const nuevoEstado = estadoActual.toUpperCase() === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

    try {
        
        const cat = categoriasDB.find(c => c.id_categoria === id);
        if (!cat) return; 


        const payload = {
            id_categoria: cat.id_categoria,
            nombre: cat.nombre,
            descripcion: cat.descripcion,
            estado: nuevoEstado
        };

   
        const response = await fetch(`${ENDPOINTS.UPDATE_CATEGORY}`, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(`Categoría ${nuevoEstado === 'ACTIVO' ? 'activada' : 'desactivada'} exitosamente.`);
            
   
            cat.estado = nuevoEstado;

            cargarCategoriasYRenderizar();

        } else {
            const errorText = await response.text();
            alert(`Error ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error("Error al actualizar estado:", error);
        alert("No se pudo conectar al servidor.");
    }
}


// editar categoria
    function editarCategoria(id) {
        console.log("Categorias DB:", categoriasDB);
            const cat = categoriasDB.find(c => c.id_categoria === id);
            if (!cat) {
                alert("Categoría no encontrada. Recargue la página.");
                return;
            }
        limpiarFormulario(); // Limpia el formulario antes de rellenar
        
        document.getElementById("categoriaId").value = cat.id_categoria;
        document.getElementById("categoriaNombre").value = cat.nombre;
        document.getElementById("categoriaDescripcion").value = cat.descripcion;
        document.getElementById("categoriaEstado").value = String(cat.estado).toLowerCase();
        document.getElementById("modalTitulo").textContent = "Editar Categoría";

      
        const modalEl = document.getElementById("modalAgregarCategoria");
        const modal = new bootstrap.Modal(modalEl); 
        modal.show();
    }


    function limpiarFormulario() {
        document.getElementById("categoriaId").value = ""; 
        document.getElementById("categoriaNombre").value = "";
        document.getElementById("categoriaDescripcion").value = "";
        document.getElementById("categoriaEstado").value = "activo";
        document.getElementById("modalTitulo").textContent = "Agregar Categoría";
    }


    document.addEventListener("DOMContentLoaded", () => {
        cargarCategoriasYRenderizar();
        
    
        document.getElementById("modalAgregarCategoria").addEventListener("hidden.bs.modal", limpiarFormulario);
        
        // Exponer funciones al scope global (window) para que el HTML (onclick) pueda llamarlas
        window.guardarCategoria = guardarCategoria; 
        window.editarCategoria = editarCategoria; 
        window.toggleCategoria = toggleCategoria;
        window.limpiarFormulario = limpiarFormulario; 
    });

})();