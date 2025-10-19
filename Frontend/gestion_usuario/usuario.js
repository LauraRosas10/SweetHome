
const API_BASE_URL = 'http://localhost:8080';

const ENDPOINTS = {

    USUARIOS: `${API_BASE_URL}/usuario/`, 
    CREATE_USER: `${API_BASE_URL}/usuario/nuevo`,
    UPDATE_USER: `${API_BASE_URL}/usuario/editar`, 
    DELETE_USER: (id) => `${API_BASE_URL}/usuario/borrar/${id}`,
};

// Variable global para almacenar los usuarios de la base de datos
let usuariosDB = []; 
let usuarioEditando = null;


const bootstrap = window.bootstrap;

// Función auxiliar para obtener el token y headers
function getAuthHeaders(includeContentType = false) {
    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');


    if (!token || role !== 'Administrador') {
        alert("Acceso no autorizado. Debe ser Administrador.");
    
        return null;
    }
    
    const headers = {
        'Authorization': `Bearer ${token}`,
    };
    if (includeContentType) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
}



// carga y renderiza los usuarios en la tabla
async function cargarUsuariosYRenderizar() {
    const tbody = document.getElementById("tablaUsuarios");
    const headers = getAuthHeaders();
    
    
    tbody.innerHTML = '<tr><td colspan="8" class="text-center">Cargando usuarios...</td></tr>';
    
    if (!headers) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Acceso denegado. Se requiere ser Administrador.</td></tr>';
        return;
    }

    try {
        const response = await fetch(ENDPOINTS.USUARIOS, { 
            method: 'GET',
            headers: headers 
        });

        if (response.ok) {
            usuariosDB = await response.json(); // Almacena la data globalmente
            tbody.innerHTML = "";
            
            if (usuariosDB.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay usuarios registrados.</td></tr>';
                return;
            }

            usuariosDB.forEach(usuario => {
       
        const rolNombre = usuario.rol && usuario.rol.nombre ? usuario.rol.nombre : 'Sin Rol';


        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="align-middle">${usuario.id_usuario || 'N/A'}</td>
            <td class="align-middle">${usuario.nombre || ''}</td>
            <td class="align-middle">${usuario.apellidos || ''}</td>
            <td class="align-middle">${usuario.email || ''}</td>
            <td class="align-middle">${usuario.telefono || 'N/A'}</td>
            <td class="align-middle">${rolNombre}</td>
   
            <td class="align-middle">
                <button 
                    class="btn btn-sm btn-outline-primary me-2" 
                     onclick="editarUsuario(${usuario.id_usuario})"
    
                    title="Editar Usuario">
                    <i class="bi bi-pencil"></i> Editar
                </button>
  
            </td>
        `;
        tbody.appendChild(row);
    });
            
        } else {
            const errorText = await response.text();
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error ${response.status} al cargar: ${errorText.substring(0, 100)}...</td></tr>`;
        }
    } catch (error) {
        console.error("Error de red/conexión:", error);
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">No se pudo conectar con el servidor.</td></tr>';
    }
}



// Abrir modal para crear un usuario nuevo
function abrirModalNuevo() {
    usuarioEditando = null;
    document.getElementById("modalTitulo").textContent = "Agregar Usuario";
    document.getElementById("formUsuario").reset();
    document.getElementById("usuarioId").value = "";

    // Habilitar y limpiar campos correctamente
    const passwordInput = document.getElementById("usuarioPassword");
    const emailInput = document.getElementById("usuarioEmail");
    
    passwordInput.value = "";
    passwordInput.required = true; 
    document.getElementById("usuarioPasswordGroup").style.display = "block"; 

    emailInput.disabled = false;
    document.getElementById("usuarioEmailGroup").classList.remove('opacity-75');
    document.getElementById("usuarioTelefonoGroup").classList.remove('opacity-75');

    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById("modalUsuario"));
    modal.show();
}


// Editar usuario existente
function editarUsuario(id) {
    usuarioEditando = usuariosDB.find(u => u.id_usuario === id); 

    if (!usuarioEditando) {
        alert(`Error: Usuario con ID ${id} no encontrado.`);
        return;
    }

    // Configurar modal
    document.getElementById("modalTitulo").textContent = "Editar Usuario";
    document.getElementById("usuarioId").value = usuarioEditando.id_usuario;
    document.getElementById("usuarioNombre").value = usuarioEditando.nombre || '';
    document.getElementById("usuarioApellidos").value = usuarioEditando.apellidos || '';
    document.getElementById("usuarioTelefono").value = usuarioEditando.telefono || '';
    document.getElementById("usuarioEmail").value = usuarioEditando.email || '';
    document.getElementById("usuarioEmail").disabled = true;
    document.getElementById("usuarioPasswordGroup").style.display = "none";
    document.getElementById("usuarioPassword").required = false;
    document.getElementById("usuarioPassword").value = "";

 
    document.getElementById("usuarioRol").value = usuarioEditando.rol?.id_rol || '';

    // Abrir modal
    const modalElement = document.getElementById("modalUsuario");
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.show();
}





// Guardar usuario (crear o actualizar)
async function guardarUsuario() {
    const headers = getAuthHeaders(true); 
    if (!headers) return;

    const id = document.getElementById("usuarioId").value;
    const nombre = document.getElementById("usuarioNombre").value;
    const apellidos = document.getElementById("usuarioApellidos").value; 
    const email = document.getElementById("usuarioEmail").value;
    const rol = document.getElementById("usuarioRol").value;
    const password = document.getElementById("usuarioPassword").value;
    const telefono = document.getElementById("usuarioTelefono").value;

    if (!nombre || !email || !rol || !apellidos || !telefono) {
        alert("Por favor completa todos los campos requeridos");
        return;
    }

    if (!id && !password) {
        alert("La contraseña es requerida para nuevos usuarios");
        return;
    }
    
    console.log("Rol seleccionado:", password)
    const idRolMap = { 'Administrador': 1, 'Vendedor-Comprador': 2};
    const rolObj = { id_rol: idRolMap[rol.toLowerCase()] || 2 };

    const payload = {
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        telefono: telefono || undefined,
        rol: rolObj,

    };
    console.log("Payload a enviar:", payload);

        if (id) {
            // Si es edición, añadir el ID
            payload.id_usuario = Number(id);
            // Solo enviar contraseña si se ingresó una nueva
            if (password) payload.contraseña = password;
        } else {
            // Nuevo usuario: la contraseña es obligatoria
            payload.contraseña = password;
        }

    let url = id ? ENDPOINTS.UPDATE_USER : ENDPOINTS.CREATE_USER;
    let method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert(`Usuario ${id ? 'actualizado' : 'agregado'} exitosamente.`);
            const modal = bootstrap.Modal.getInstance(document.getElementById("modalUsuario"));
            if (modal) modal.hide();
            cargarUsuariosYRenderizar(); // Recargar la tabla
        } else {
            const errorText = await response.text();
            alert(`Error ${response.status} al guardar usuario: ${errorText.substring(0, 100)}`);
            console.error("Fallo al guardar:", errorText);
        }
    } catch (error) {
        console.error("Error de red al guardar usuario:", error);
        alert("No se pudo conectar con el servidor para guardar el usuario.");
    }
}


// Eliminar usuario
async function eliminarUsuario(id) {
    if (!confirm(`¿Estás seguro de que deseas eliminar el usuario con ID ${id}? Esta acción es irreversible.`)) {
        return;
    }

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
        const url = ENDPOINTS.DELETE_USER(id);
        console.log("Token:", localStorage.getItem('userToken'));
        const response = await fetch(url, {
            method: 'DELETE',
            headers: headers
        });

        if (response.ok) {
            alert(`Usuario con ID ${id} eliminado exitosamente.`);
            cargarUsuariosYRenderizar(); // Recargar la tabla
        } else {
            const errorText = await response.text();
            alert(`Error ${response.status} al eliminar usuario: ${errorText.substring(0, 100)}`);
            console.error("Fallo al eliminar:", errorText);
        }
    } catch (error) {
        console.error("Error de red al eliminar usuario:", error);
        alert("No se pudo conectar con el servidor para eliminar el usuario.");
    }
}


window.cargarUsuariosYRenderizar = cargarUsuariosYRenderizar;
window.guardarUsuario = guardarUsuario;
window.editarUsuario = editarUsuario;
window.eliminarUsuario = eliminarUsuario;
window.abrirModalNuevo = abrirModalNuevo; 

document.addEventListener("DOMContentLoaded", () => {
 
    cargarUsuariosYRenderizar(); 
  
    document.getElementById("formUsuario")?.addEventListener("submit", function(e) {
        e.preventDefault();
        guardarUsuario();
    });
});