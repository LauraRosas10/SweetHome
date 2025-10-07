// Autentificación CORREGIDA
document.getElementById("userfrom").addEventListener("submit", async function (e) {
    e.preventDefault();
    limpiarErrores();

    const email = document.getElementById("Email").value.trim();
    const password = document.getElementById("login-pass").value;

    let valido = true;

    if (!email) {
        mostrarErrorCampo("Email", "El correo es obligatorio.");
        valido = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        mostrarErrorCampo("Email", "Formato de correo inválido.");
        valido = false;
    }

    if (!password) {
        mostrarErrorCampo("login-pass", "La contraseña es obligatoria.");
        valido = false;
    }

    if (!valido) return;

    try {
        const bodyLogin = { email: email, contraseña: password };
        console.log("Body enviado al backend:", bodyLogin);
        
        // CAMBIO 1: Usar el endpoint /login que devuelve el usuario completo
        const response = await fetch("http://localhost:8080/usuario/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyLogin)
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Respuesta del backend:", data);
            
            // CAMBIO 2: Verificar que recibimos los datos del usuario
            if (data && data.id_usuario) {
                // CAMBIO 3: Guardar token real (por ahora simulado) y userId
                localStorage.setItem("token", "Bearer-" + data.id_usuario); 
                localStorage.setItem("userId", data.id_usuario);
                localStorage.setItem("userEmail", data.email);
                localStorage.setItem("userName", data.nombre);
                
                mostrarNotificacion("Login exitoso", true);
                limpiarCamposLogin();

                // Redirigir a la página que estaba intentando acceder
                const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/Frontend/index.html";
                localStorage.removeItem("redirectAfterLogin");
                
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, 1000);
            } else {
                mostrarNotificacion("Credenciales incorrectas.");
            }
        } else {
            const errorText = await response.text();
            console.error("Error del servidor:", errorText);
            mostrarNotificacion("Correo o contraseña incorrectos.");
        }
    } catch (error) {
        console.error("Error en login:", error);
        mostrarNotificacion("Error al conectar con el servidor.");
    }
});

// Notificación flotante
function mostrarNotificacion(mensaje, exito = false) {
    let noti = document.createElement("div");
    noti.innerText = mensaje;
    noti.style.position = "fixed"; // Cambiar a fixed
    noti.style.left = "50%";
    noti.style.top = "30px";
    noti.style.transform = "translateX(-50%)";
    noti.style.background = exito ? "#4CAF50" : "#e74c3c";
    noti.style.color = "#fff";
    noti.style.padding = "16px 28px";
    noti.style.borderRadius = "8px";
    noti.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    noti.style.fontSize = "1rem";
    noti.style.zIndex = 9999;
    noti.style.opacity = 1;
    noti.style.transition = "opacity 0.5s";
    
    document.body.appendChild(noti); // Agregar al body
    
    setTimeout(() => {
        noti.style.opacity = 0;
        setTimeout(() => noti.remove(), 500);
    }, 2000);
}

// Limpiar campos del formulario de login
function limpiarCamposLogin() {
    ["Email", "login-pass"].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = "";
    });
}

// Función auxiliar para limpiar errores (debes tenerla definida)
function limpiarErrores() {
    document.querySelectorAll(".error-message").forEach(el => el.remove());
}

// Función auxiliar para mostrar errores en campos
function mostrarErrorCampo(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (campo) {
        const error = document.createElement("div");
        error.className = "error-message";
        error.style.color = "#e74c3c";
        error.style.fontSize = "0.9rem";
        error.style.marginTop = "5px";
        error.textContent = mensaje;
        campo.parentElement.appendChild(error);
    }
}