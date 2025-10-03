

function togglePassword() {
    const passwordInput = document.getElementById("Password");
    const eyeIcon = document.getElementById("eyeIcon");
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        eyeIcon.textContent = "👁️";
    }
}


function mostrarToast(mensaje) {
    const form = document.getElementById("resgistro_usuario");
    let toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = mensaje;
    toast.style.position = "absolute";
    toast.style.left = "50%";
    toast.style.top = "30px";
    toast.style.transform = "translateX(-50%)";
        // Si el mensaje es de éxito exacto, mostrar en verde, si no, en rojo
        if (mensaje.toLowerCase().includes("éxito")) {
            toast.style.background = "#0b9710ff";
        } else {
            toast.style.background = "#e74c3c";
        }
    toast.style.color = "#fff";
    toast.style.padding = "16px 28px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
    toast.style.fontSize = "1rem";
    toast.style.zIndex = 9999;
    toast.style.opacity = 1;
    toast.style.transition = "opacity 0.5s";
    form.style.position = "relative";
    form.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// Limpiar campos del formulario de registro
function limpiarCamposRegistro() {
    const ids = ["Nombre", "Apellido", "Email", "Telefono", "Password"];
    ids.forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = "";
    });
    // Resetear select de rol
    const select = document.getElementById("Rol");
    if (select) select.selectedIndex = 0;
}

