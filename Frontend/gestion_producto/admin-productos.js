(function() {
    const API_BASE_URL = 'http://localhost:8080';
    const ENDPOINTS = {
        PRODUCTS: `${API_BASE_URL}/producto/`, 
        PRODUCT_BY_ID: (id) => `${API_BASE_URL}/producto/${id}`,
        CREATE_PRODUCT: `${API_BASE_URL}/producto/nuevo`,
        UPDATE_PRODUCT: `${API_BASE_URL}/producto/editar`, 
        DELETE_PRODUCT: `${API_BASE_URL}/producto/borrar`,
        CATEGORIES: `${API_BASE_URL}/categoria/`
    };

    let imagenCargada = null;

    //  DOM para inicializar todo una vez cargada la página

    document.addEventListener("DOMContentLoaded", () => {
        checkAdminAccess();
        cargarProductos();
        inicializarDropZone();

        const form = document.getElementById("productoForm");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                guardarProducto();
            });
        }

        const btnNuevoProducto = document.getElementById("btnNuevoProducto");
        if (btnNuevoProducto) {
            btnNuevoProducto.addEventListener("click", async () => {
                limpiarFormulario();
                await cargarCategorias();
                const modalElement = document.getElementById("productoModal");
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.show();
            });
        }

        const productoModalElement = document.getElementById("productoModal");
        if (productoModalElement) {
            productoModalElement.addEventListener("hidden.bs.modal", limpiarFormulario);
        }
    });

    // chequeo de acceso de administrador o vendedor-comprador

    function checkAdminAccess() {
        const token = localStorage.getItem('userToken');
        const role = localStorage.getItem('userRole');
        console.log("Token:", token, "Role:", role);

        if (!token || (role !== 'Administrador' && role !== 'Vendedor-Comprador')) {
       
             document.getElementById("btnNuevoProducto")?.remove();
            if (typeof logoutUser === 'function') logoutUser();
            else window.location.href = 'index.html';
            return;
        }

  
    }

    // carga de datos iniciales de categorias

    async function cargarCategorias() {
        const select = document.getElementById("productoCategoria");
        if (!select) return;

        const token = localStorage.getItem('userToken');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        try {
            const response = await fetch(ENDPOINTS.CATEGORIES, { headers });
            if (response.ok) {
                const categorias = await response.json();
                select.innerHTML = '<option value="">-- Selecciona categoría --</option>';
                categorias.forEach(cat => {
                    select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`;
                });
            }
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    }

    // carga de productos en la tabla

    async function cargarProductos() {
    const tbody = document.getElementById("productosTableBody");
    tbody.innerHTML = '<tr><td colspan="9" class="text-center">Cargando productos...</td></tr>';

    const token = localStorage.getItem('userToken');
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const response = await fetch(ENDPOINTS.PRODUCTS, { headers });
        if (response.ok) {
            let productosDB = await response.json();
            tbody.innerHTML = "";

            // 🔹 FILTRAR según el rol
            if (role !== "Administrador") {
                productosDB = productosDB.filter(p => p.id_usuario.id_usuario == userId);
            }

            // 🔹 Mostrar productos filtrados
            productosDB.forEach(producto => {
                const estadoBadgeClass = producto.estado === 'DISPONIBLE' ? 'bg-success' : 'bg-danger';
                const tr = document.createElement("tr");

                tr.innerHTML = `
                    <td>${producto.id_producto}</td>
                    <td><img src="${producto.imagen}" alt="${producto.nombre}" 
                        style="width:60px; height:60px; object-fit:cover; border-radius:8px;"></td>
                    <td><strong>${producto.nombre}</strong></td>
                    <td>${producto.descripcion.substring(0, 50)}${producto.descripcion.length > 50 ? '...' : ''}</td>
                    <td><strong>$${producto.precio.toFixed(2)}</strong></td>
                    <td><span class="badge bg-primary">${producto.id_categoria.nombre}</span></td>
                    <td>${producto.stock}</td>
                    <td><span class="badge ${estadoBadgeClass}">${producto.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary me-1" 
                            onclick="editarProducto(${producto.id_producto})">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            if (productosDB.length === 0) {
                tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay productos registrados.</td></tr>';
            }
        } else {
            const errorText = await response.text();
            alert(`Error ${response.status} al cargar productos: ${errorText.substring(0,100)}`);
        }
    } catch (error) {
        console.error("Error de red:", error);
        alert("No se pudo conectar al servidor de productos.");
    }
}




    // funciones CRUD de productos

    async function guardarProducto() {
        const form = document.getElementById("productoForm");
        if (!form.checkValidity()) { form.reportValidity(); return; }

        const imagenData = document.getElementById("productoImagenData").value;
        if (!imagenData) { alert("Selecciona una imagen para el producto"); return; }

        const id = document.getElementById("productoId").value;
        const nombre = document.getElementById("productoNombre").value;
        const descripcion = document.getElementById("productoDescripcion").value;
        const precio = parseFloat(document.getElementById("productoPrecio").value);
        const categoriaId = document.getElementById("productoCategoria").value;
        const stock = parseInt(document.getElementById("productoStock").value);
        const estado = document.getElementById("productoEstado").value;


        const token = localStorage.getItem('userToken');
        const userId = localStorage.getItem('userId');
        if (!userId) { alert("Error: ID de usuario no encontrado"); return; }

        const productoPayload = {
            nombre, descripcion, precio, stock,  estado: estado, imagen:imagenData,
            id_categoria: { id_categoria: Number(categoriaId) },
            id_usuario: { id_usuario: Number(userId) }
        };


        console.log(localStorage.getItem('userToken'));

        console.log("Payload a enviar:", productoPayload);

        let url = ENDPOINTS.CREATE_PRODUCT, method = 'POST', successMessage = "Producto agregado exitosamente";

        if (id) {
            url = ENDPOINTS.UPDATE_PRODUCT;
            method = 'PUT';
            successMessage = "Producto actualizado exitosamente";
            productoPayload.id_producto = Number(id);
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(productoPayload)
            });

            if (response.ok) {
                const modal = bootstrap.Modal.getInstance(document.getElementById("productoModal"));
                if (modal) modal.hide();
                cargarProductos();
                alert(successMessage);
            } else {
                const errorText = await response.text();
                alert(`Error ${response.status} al guardar producto: ${errorText.substring(0,100)}`);
            }
        } catch (error) {
            console.error("Error al guardar producto:", error);
            alert("No se pudo conectar al servidor para guardar el producto.");
        }
    }





    async function eliminarProducto(id) {
        if (!confirm("¿Seguro de eliminar este producto?")) return;

        const token = localStorage.getItem('userToken');
        const url = ENDPOINTS.DELETE_PRODUCT + "/" + id;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                cargarProductos();
                alert("Producto eliminado exitosamente");
            } else {
                const errorText = await response.text();
                alert(`Error ${response.status} al eliminar producto: ${errorText.substring(0,100)}`);
            }
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            alert("No se pudo conectar al servidor para eliminar el producto.");
        }
    }




    async function editarProducto(id) {
    limpiarFormulario(false);
    await cargarCategorias();

    const url = ENDPOINTS.PRODUCT_BY_ID(id);
    const token = localStorage.getItem('userToken'); // tu JWT

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        const producto = await response.json();

        document.getElementById("productoModalLabel").textContent = id 
            ? "Editar Producto" 
            : "Nuevo Producto";


        document.getElementById("productoId").value = producto.id_producto;
        document.getElementById("productoNombre").value = producto.nombre;
        document.getElementById("productoDescripcion").value = producto.descripcion;
        document.getElementById("productoPrecio").value = producto.precio;
        document.getElementById("productoStock").value = producto.stock;
        document.getElementById("productoCategoria").value = producto.id_categoria.id_categoria;
        document.getElementById("productoEstado").value = producto.estado.toUpperCase();


        const imagePreview = document.getElementById("imagePreview");
        const dropZoneContent = document.getElementById("dropZoneContent");

        if (producto.imagen) {
            imagePreview.src = producto.imagen;
            imagePreview.style.display = "block";
            dropZoneContent.style.display = "none";
            document.getElementById("productoImagenData").value = producto.imagen;

            imagenCargada = producto.imagen;


        } else {
            resetearDropZone();
        }

        const modalElement = document.getElementById("productoModal");
        const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modal.show();

    } catch (error) {
        console.error("Error al cargar producto:", error);
        alert("No se pudo cargar el producto para edición.");
    }
}



// drop zone para imagenes, ayuda a subir imagenes en el formulario de productos 
    function inicializarDropZone() {
        const dropZone = document.getElementById("dropZone");
        const fileInput = document.getElementById("productoImagen");
        const imagePreview = document.getElementById("imagePreview");
        const dropZoneContent = document.getElementById("dropZoneContent");

        if (!dropZone || !fileInput) return;

        dropZone.addEventListener("click", () => fileInput.click());
        ["dragenter","dragover","dragleave","drop"].forEach(ev => dropZone.addEventListener(ev, preventDefaults, false));
        ["dragenter","dragover"].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.add("drag-over")));
        ["dragleave","drop"].forEach(ev => dropZone.addEventListener(ev, () => dropZone.classList.remove("drag-over")));

        dropZone.addEventListener("drop", (e) => handleFiles(e.dataTransfer.files));
        fileInput.addEventListener("change", (e) => handleFiles(e.target.files));

        function preventDefaults(e){ e.preventDefault(); e.stopPropagation(); }

        function handleFiles(files) {
            if (!files || files.length === 0) return;
            const file = files[0];
            if (!file.type.startsWith("image/")) { alert("Archivo no es imagen"); return; }

            const reader = new FileReader();
            reader.onload = e => {
                imagenCargada = e.target.result;
                imagePreview.src = e.target.result;
                imagePreview.style.display = "block";
                dropZoneContent.style.display = "none";
                document.getElementById("productoImagenData").value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    // resetea la drop zone a su estado inicial para subir imagenes de productos
    function resetearDropZone() {
        const imagePreview = document.getElementById("imagePreview");
        const dropZoneContent = document.getElementById("dropZoneContent");
        const fileInput = document.getElementById("productoImagen");

        imagePreview.style.display = "none";
        imagePreview.src = "";
        dropZoneContent.style.display = "flex";
        fileInput.value = "";
        imagenCargada = null;
    }

    function limpiarFormulario() {
        const form = document.getElementById("productoForm");
        if (form) form.reset();
        document.getElementById("productoId").value = "";
        document.getElementById("productoImagenData").value = "";
        document.getElementById("productoEstado").value = "DISPONIBLE";

        resetearDropZone();
    }


    // Exponer funciones globalmente para botones en línea esto se hace por que se creo una funcion autoejecutable, por ende, las funciones no son globales
    window.editarProducto = editarProducto;
    window.eliminarProducto = eliminarProducto;
    window.guardarProducto = guardarProducto;

})();
