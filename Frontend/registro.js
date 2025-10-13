const ENDPOINTS = {
    REGISTER: "http://localhost:8080/usuario/nuevo",
    LOGIN: "http://localhost:8080/usuario/login",
};

/**
 * Muestra un mensaje temporal de éxito o error en el contenedor.
 * @param {string} message - El texto del mensaje.
 * @param {string} type - 'success' o 'danger'.
 */
function showMessage(message, type) {
    const container = document.getElementById("messageContainer");
    if (!container) return;

    // Limpiar mensajes anteriores
    container.innerHTML = '';
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = message;
    
    container.appendChild(alertDiv);
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        alertDiv.classList.add('d-none');
    }, 5000);
}

/**
 * Envía la solicitud de registro al backend.
 * @param {Object} userData - Los datos del nuevo usuario.
 */
async function registrarUsuario(userData) {
    const btn = document.getElementById('btnRegistro');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Registrando...';

    try {
        const response = await fetch(ENDPOINTS.REGISTER, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            showMessage('✅ ¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
            document.getElementById("registroForm").reset();
            setTimeout(() => window.location.href = "index.html", 2000);
        } else if (response.status === 403) {
            showMessage('🚫 No tienes permisos para registrar. Revisa la configuración de seguridad del backend.', 'danger');
        } else {
            const text = await response.text();
            showMessage(`❌ Error ${response.status}: ${text}`, 'danger');
        }
    } catch (err) {
        showMessage('⚠️ Error al conectar con el servidor.', 'danger');
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Crear Cuenta';
    }
}



//manejo del formulario de registro


document.getElementById("registroForm").addEventListener("submit", (e) => {
    e.preventDefault();

   //capturar datos del formulario
    const nombre = document.getElementById("registroNombre").value;
   
    const apellidos = document.getElementById("registroApellidos").value; 
    
    const email = document.getElementById("registroEmail").value;
    const telefono = document.getElementById("registroTelefono").value;
    const password = document.getElementById("registroPassword").value;
    const passwordConfirm = document.getElementById("registroPasswordConfirm").value;
    const aceptarTerminos = document.getElementById("aceptarTerminos").checked;



    // Validaciones
    if (password !== passwordConfirm) {
        showMessage("Las contraseñas no coinciden.", 'danger');
        return;
    }
    if (password.length < 8) {
        showMessage("La contraseña debe tener al menos 8 caracteres.", 'danger');
        return;
    }
    if (!aceptarTerminos) {
        showMessage("Debes aceptar los términos y condiciones.", 'danger');
        return;
    }

    // Preparar datos
    const nuevoUsuario = {
    
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        contraseña: password, 
        telefono: telefono,
        rol: { id_rol: 2 }
    };

    console.log("Datos del nuevo usuario a registrar:", nuevoUsuario);
  
    registrarUsuario(nuevoUsuario);
});



  document.getElementById("loginModal").addEventListener('submit', (e) => {
      
      if(e.target.id === 'userform') {
          e.preventDefault();
          console.log("Intento de login simulado...");
  
          const modalElement = document.getElementById("loginModal");
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
         
      }
  });
