/*Captura de datos para enviar al backend*/
document.getElementById("resgistro_usuario").addEventListener("submit", function(event) {
  event.preventDefault(); 

  const nombre = document.getElementById("Nombre").value.trim();
  const apellidos = document.getElementById("Apellido").value.trim();
  const email = document.getElementById("Email").value.trim();
  const contraseña = document.getElementById("Password").value.trim();
  const telefono = document.getElementById("Telefono").value.trim();
  const idRol = document.getElementById("TipoUsuario").value;

  if (!nombre || !apellidos || !email || !contraseña || !telefono || !idRol) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Verificar si el correo ya existe
  fetch(`http://localhost:8080/api/usuarios`)
    .then(response => response.json())
    .then(usuarios => {
      const existe = usuarios.some(u => u.email === email);
      if (existe) {
        alert("El correo ya está registrado. Usa otro correo.");
        return;
      }
      // Si no existe, registrar
      const formDate = {
        nombre,
        apellidos,
        email,
        contraseña,
        telefono,
        rol: { id_rol: idRol }
      };
      fetch('http://localhost:8080/api/nuevousuario',{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formDate)
      }).then(response=>{
        if (response.ok) {
          document.getElementById("success").innerText="Los datos se guardaron exitosamente";
          document.getElementById("resgistro_usuario").reset();
        } else {
          alert("Error en guardando los datos. Intenta de nuevo");
        }
      }).catch(error =>{
        console.error("Error:", error);
        alert("Error guardando los datos. intenta de nuevo");
      });
    })
    .catch(error => {
      alert("No se pudo verificar el correo. Intenta de nuevo.");
    });

}); 





document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("form input, form select");
  const boton = document.querySelector("button");
  if (!boton) return;

  // Efecto al enfocar campos
  inputs.forEach(input => {
    input.addEventListener("focus", () => {
      input.style.backgroundColor = "#3a3a3a";
      input.style.color = "#fff";
      input.style.transition = "0.3s";
    });

    input.addEventListener("blur", () => {
      input.style.backgroundColor = "#2c2c2c";
      input.style.color = "#ccc";
    });
  });

  // Hover dinámico del botón
  boton.addEventListener("mouseenter", () => {
    boton.style.transform = "scale(1.05)";
    boton.style.boxShadow = "0 0 10px rgba(76, 175, 80, 0.8)";
  });

  boton.addEventListener("mouseleave", () => {
    boton.style.transform = "scale(1)";
    boton.style.boxShadow = "none";
  });

  // Animación del título
  const titulo = document.querySelector("h2");
  if (titulo) {
    titulo.style.opacity = "0";
    titulo.style.transform = "translateY(-20px)";
    setTimeout(() => {
      titulo.style.transition = "all 0.8s ease";
      titulo.style.opacity = "1";
      titulo.style.transform = "translateY(0)";
    }, 200);
  }
});
