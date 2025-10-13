

document.addEventListener("DOMContentLoaded", updateNavbarVisibility);

function logoutUser() {
    // Eliminar la información de la sesión
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');

    // Actualizar la vista de la barra de navegación
    updateNavbarVisibility();
    
    // Redirigir y alertar
    alert("Sesión cerrada correctamente.");
    window.location.href = 'productos.html';

}

function updateNavbarVisibility() {
    const userToken = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    
    const navUl = document.querySelector('#navbarNav ul.navbar-nav');
    if (!navUl) return;

    //  Obtener elementos de la barra de navegación 
    const loginLinkLi = document.querySelector('a[data-bs-target="#loginModal"]')?.parentElement; 
    const categoriasLinkLi = document.getElementById('nav-categorias'); 
    const usuariosLinkLi = document.getElementById('nav-usuarios');
    const gestionLinkLi = document.getElementById('nav-gestion');
    const homeLinkLi = document.getElementById('nav-home');
    const productosLinkLi = document.getElementById('nav-productos');
    const carritoLinkLi = document.getElementById('nav-carrito');

    
    // Variables de control de rol
    const isAdmin = userRole === 'Administrador';
    const isVendedor = userRole === 'Vendedor-Comprador';
    
    // Limpiar mensajes o botones anteriores
    document.getElementById('welcome-message')?.parentElement.remove();
    document.getElementById('logout-link')?.parentElement.remove();
    

    
    //logica de visibilidad según estado de login y rol

    if (userToken) {
        //  USUARIO LOGUEADO 
        if (loginLinkLi) loginLinkLi.style.display = 'none';

        // Mostrar mensaje de bienvenida
        const welcomeLi = document.createElement('li');
        welcomeLi.className = 'nav-item';
        welcomeLi.innerHTML = `<span class="nav-link text-primary fw-bold" id="welcome-message">Hola, ${userName || 'Usuario'}</span>`;
        navUl.appendChild(welcomeLi);

        // Mostrar botón de cerrar sesión
        const logoutLi = document.createElement('li');
        logoutLi.className = 'nav-item';
        logoutLi.innerHTML = `
            <a class="nav-link text-danger" href="#" id="logout-link">
                <i class="bi bi-box-arrow-right fs-5"></i> Cerrar Sesión
            </a>`;
        navUl.appendChild(logoutLi);

        document.getElementById('logout-link')?.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });

        // Mostrar secciones según rol
        if (categoriasLinkLi) categoriasLinkLi.style.display = isAdmin ? 'block' : 'none';
        if (usuariosLinkLi) usuariosLinkLi.style.display = isAdmin ? 'block' : 'none';
        if (gestionLinkLi) gestionLinkLi.style.display = (isAdmin || isVendedor) ? 'block' : 'none';
        if (homeLinkLi) homeLinkLi.style.display = 'block';
        if (productosLinkLi) productosLinkLi.style.display = 'block';
        if (carritoLinkLi) carritoLinkLi.style.display = 'block';

    } else {
        //  USUARIO NO LOGUEADO 
        if (loginLinkLi) loginLinkLi.style.display = 'block';
        if (homeLinkLi) homeLinkLi.style.display = 'block';
        if (productosLinkLi) productosLinkLi.style.display = 'block';
        if (carritoLinkLi) carritoLinkLi.style.display = 'block';
        if (registrarUsuario) registrarUsuario.style.display = 'block';

        // Ocultar todo lo demás
        if (categoriasLinkLi) categoriasLinkLi.style.display = 'none';
        if (usuariosLinkLi) usuariosLinkLi.style.display = 'none';
        if (gestionLinkLi) gestionLinkLi.style.display = 'none';
    }
}
