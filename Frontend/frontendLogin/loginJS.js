

function mostrarErrorCampo(idCampo, mensaje) {
    const input = document.getElementById(idCampo);
    const errorDiv = document.getElementById(`error-${idCampo}`);
    input.classList.add("input-error");
    errorDiv.innerText = mensaje;
}

function limpiarErrores() {
    ["Email", "login-pass"].forEach(id => {
        document.getElementById(id).classList.remove("input-error");
        document.getElementById(`error-${id}`).innerText = "";
    });
}

/*--================== Show Hidden - Password =================*/
const showHiddenPass = (loginPass, LoginEye) => {
    const input = document.getElementById(loginPass),
    iconEye = document.getElementById(LoginEye);

    iconEye.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            iconEye.classList.add('ri-eye-line');
            iconEye.classList.remove('ri-eye-off-line');
        } else {
            input.type = 'password';
            iconEye.classList.remove('ri-eye-line');
            iconEye.classList.add('ri-eye-off-line');
        }
    });
};

showHiddenPass('login-pass', 'login-eye');
