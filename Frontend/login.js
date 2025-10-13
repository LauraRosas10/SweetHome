

document.getElementById("userform").addEventListener("submit", function(event) {
        event.preventDefault();

// Obtener los valores del formulario
        const email = document.getElementById("Email").value;
        const password = document.getElementById("login-pass").value;
        const LOGIN_URL = "http://localhost:8080/usuario/login"; 

fetch(LOGIN_URL, {
        method: "POST",
        headers: {
                "Content-Type": "application/json"
         },
        body: JSON.stringify({ email: email, contraseña: password }) 
        })
        .then(response => {
        if (!response.ok) {
            // Manejar error HTTP (401, 403, etc.)
                return response.json().then(errorData => Promise.reject(errorData));
        }
         return response.json();
    })
        .then(data => {

        console.log("Respuesta del Backend:", data); 

if (!data.token || !data.rol || !data.rol.nombre) {
throw new Error("Login exitoso, pero el servidor no devolvió el token o el rol.");
}

//guardar en localStorage y redirigir según rol
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userRole", data.rol.nombre); // Accede a rol.nombre
        localStorage.setItem("userName", data.nombre);      // Accede al nombre directamente
        localStorage.setItem("userId", data.id);          // Accede al ID directamente


        const loginModalElement = document.getElementById('loginModal');
        if (loginModalElement) {
                const loginModal = bootstrap.Modal.getInstance(loginModalElement);
                if (loginModal) loginModal.hide();
                }


if (typeof updateNavbarVisibility === 'function') {
updateNavbarVisibility(); 
} else {

}


        const rol = data.rol.nombre; 
        if (rol === "Administrador" || rol === "Vendedor-Comprador") {
                window.location.href = "admin-productos.html"; 
        } else if (rol === "Usuario") {
                window.location.href = "usuario.html";
        } else {
         window.location.href = "index.html"; // Redirección por defecto
        }
    })
        .catch(error => {
        console.error("Error en login:", error);
const mensajeError = error.mensaje || error.message || 'Credenciales inválidas o error de conexión.';
        alert(`Error al iniciar sesión: ${mensajeError}`);
    });
});