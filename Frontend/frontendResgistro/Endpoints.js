// Llenar el select de roles activos de la base de datos

document.addEventListener("DOMContentLoaded", async function () {
    const select = document.getElementById("Rol");
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Seleccione</option>';
    try {
        const response = await fetch("http://localhost:8080/rol/"); // Cambia la URL según tu backend
        if (response.ok) {
            const roles = await response.json();
            // Filtrar solo roles activos (ajusta la condición según tu backend)
            const rolesActivos = roles.filter(rol => rol.estado === 'activo' || rol.estado === true);
            rolesActivos.forEach(rol => {
                const option = document.createElement("option");
                option.value = rol.id_rol; // tener bien el nombre de la BD
                option.textContent = rol.nombre;
                option.setAttribute("data-nombre", rol.nombre);
                option.setAttribute("data-estado", rol.estado);
                select.appendChild(option);
            });
        } else {
            select.innerHTML += '<option disabled>No se pudieron cargar los roles</option>';
        }
    } catch (error) {
        select.innerHTML += '<option disabled>Error de conexión</option>';
    }
});



// Registrar usuario solo tras validación exitosa
document.getElementById("resgistro_usuario").addEventListener("submit", function (e) {
    e.preventDefault();
    let valido = true;
    const campos = [
        { id: "Nombre", mensaje: "El nombre es obligatorio.", tipo: "texto" },
        { id: "Apellido", mensaje: "El apellido es obligatorio.", tipo: "texto" },
        { id: "Email", mensaje: "El correo es obligatorio.", tipo: "email" },
        { id: "Telefono", mensaje: "El teléfono es obligatorio.", tipo: "telefono" },
        { id: "Rol", mensaje: "Debe seleccionar un rol." },
        { id: "Password", mensaje: "La contraseña es obligatoria.", tipo: "password" }
    ];
    campos.forEach(campo => {
        const input = document.getElementById(campo.id);
        const errorDiv = document.getElementById(`error-${campo.id}`);
        // Limpiar errores al escribir
        if (input && errorDiv && !input._errorListenerAdded) {
            input.addEventListener("input", function() {
                input.classList.remove("input-error");
                errorDiv.innerText = "";
            });
            input._errorListenerAdded = true;
        }
        if (input) input.classList.remove("input-error");
        if (errorDiv) errorDiv.innerText = "";
        let valor = input ? input.value.trim() : "";
        let error = "";
        if (!valor) {
            error = campo.mensaje;
        } else if (campo.tipo === "email" && !/^\S+@\S+\.\S+$/.test(valor)) {
            error = "El correo no tiene un formato válido.";
        } else if (campo.tipo === "password" && valor.length < 6) {
            error = "La contraseña debe tener al menos 6 caracteres.";
        } else if (campo.tipo === "telefono" && !/^\d{7,15}$/.test(valor)) {
            error = "El teléfono debe contener solo números (mínimo 7 dígitos).";
        } else if (campo.tipo === "texto" && !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor)) {
            error = "Este campo solo debe contener letras y espacios.";
        }
        if (error) {
            valido = false;
            if (input) input.classList.add("input-error");
            if (errorDiv) errorDiv.innerText = error;
        }
    });
    if (valido) {
        // Obtener el option seleccionado correctamente
        const select = document.getElementById("Rol");
        console.log("Select element:", select);
        const selectedOption = select.options[select.selectedIndex];
        // Construir el objeto rol con los nombres correctos
        const rolSeleccionado = {
            id_rol: parseInt(selectedOption.value),
            nombre: selectedOption.getAttribute("data-nombre"),
            estado: selectedOption.getAttribute("data-estado")
        };
        const usuario = {
            //los nombres deben coincidir con los del backend
            nombre: document.getElementById("Nombre").value.trim(),
            apellidos: document.getElementById("Apellido").value.trim(),
            email: document.getElementById("Email").value.trim(),
            telefono: document.getElementById("Telefono").value.trim(),
            rol: rolSeleccionado,
            contraseña: document.getElementById("Password").value
        };

        console.log("Usuario a registrar:", usuario); // Verificar el objeto antes de enviarlo
        fetch("http://localhost:8080/usuario/nuevo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        })
        .then(async response => {
            if (response.ok) {
                mostrarToast("Usuario registrado con éxito");
                limpiarCamposRegistro();
            } else {
                // Intentar mostrar el mensaje de error del backend si existe
                let msg = "Error al registrar usuario";
                try {
                    msg = "El correo ya está en uso";
                } catch {}
                mostrarToast(msg);
            }
        })
        .catch(() => {
            mostrarToast("Error de conexión con el servidor");
        });

}});


