/*Captura de datos para enviar al backend*/
document.getElementById("resgistro_usuario").addEventListener("submit", function(event) {
  event.preventDefault(); 

  const formDate = {
    nombre: document.getElementById("Nombre").value,
    apellido: document.getElementById("Apellido").value,
    email: document.getElementById("Email").value,
    password: document.getElementById("Password").value,
    telefono: document.getElementById("Telefono").value,
    rol: document.getElementById("TipoUsuario").value
  }

  console.log("exito",formDate)
}); 

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("form input, form select");
  const boton = document.querySelector("button");

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
  titulo.style.opacity = "0";
  titulo.style.transform = "translateY(-20px)";
  setTimeout(() => {
    titulo.style.transition = "all 0.8s ease";
    titulo.style.opacity = "1";
    titulo.style.transform = "translateY(0)";
  }, 200);
});
