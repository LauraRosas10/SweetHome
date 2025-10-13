// Simulación de base de datos de productos
const productosDB = [
  {
    id: 1,
    nombre: "Jarrón Minimalista",
    descripcion: "Elegante jarrón de cerámica con acabado mate",
    precio: 45.99,
    categoria: "decoracion",
    imagen: "/minimalist-ceramic-vase.png",
  },
  {
    id: 2,
    nombre: "Silla Nórdica",
    descripcion: "Silla de madera con diseño escandinavo",
    precio: 189.99,
    categoria: "muebles",
    imagen: "/nordic-wooden-chair.jpg",
  },
  {
    id: 3,
    nombre: "Cojín Texturizado",
    descripcion: "Cojín de lino con textura artesanal",
    precio: 29.99,
    categoria: "textiles",
    imagen: "/textured-linen-cushion.jpg",
  },
  {
    id: 4,
    nombre: "Lámpara de Mesa",
    descripcion: "Lámpara moderna con base de mármol",
    precio: 129.99,
    categoria: "iluminacion",
    imagen: "/modern-marble-table-lamp.jpg",
  },
  {
    id: 5,
    nombre: "Espejo Redondo",
    descripcion: "Espejo decorativo con marco dorado",
    precio: 79.99,
    categoria: "decoracion",
    imagen: "/round-gold-frame-mirror.jpg",
  },
  {
    id: 6,
    nombre: "Mesa de Centro",
    descripcion: "Mesa de centro de roble con patas metálicas",
    precio: 299.99,
    categoria: "muebles",
    imagen: "/oak-coffee-table-metal-legs.jpg",
  },
  {
    id: 7,
    nombre: "Manta de Algodón",
    descripcion: "Manta suave de algodón orgánico",
    precio: 59.99,
    categoria: "textiles",
    imagen: "/soft-organic-cotton-blanket.jpg",
  },
  {
    id: 8,
    nombre: "Lámpara Colgante",
    descripcion: "Lámpara colgante de diseño industrial",
    precio: 159.99,
    categoria: "iluminacion",
    imagen: "/industrial-pendant-lamp.jpg",
  },
  {
    id: 9,
    nombre: "Set de Velas",
    descripcion: "Set de 3 velas aromáticas artesanales",
    precio: 34.99,
    categoria: "decoracion",
    imagen: "/artisan-scented-candles-set.jpg",
  },
  {
    id: 10,
    nombre: "Estantería Modular",
    descripcion: "Estantería de pared con diseño modular",
    precio: 249.99,
    categoria: "muebles",
    imagen: "/modular-wall-shelf.jpg",
  },
  {
    id: 11,
    nombre: "Alfombra Tejida",
    descripcion: "Alfombra de yute tejida a mano",
    precio: 149.99,
    categoria: "textiles",
    imagen: "/handwoven-jute-rug.jpg",
  },
  {
    id: 12,
    nombre: "Aplique de Pared",
    descripcion: "Aplique de pared con acabado en latón",
    precio: 89.99,
    categoria: "iluminacion",
    imagen: "/brass-wall-sconce.png",
  },
]

// Función para renderizar productos
function renderizarProductos(productos) {
  const grid = document.getElementById("productos-grid")
  const loading = document.getElementById("loading")

  // Mostrar loading
  loading.classList.remove("d-none")
  grid.innerHTML = ""

  // Simular carga de base de datos
  setTimeout(() => {
    loading.classList.add("d-none")

    if (productos.length === 0) {
      grid.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No se encontraron productos</p></div>'
      return
    }

    productos.forEach((producto, index) => {
      const col = document.createElement("div")
      col.className = "col-12 col-sm-6 col-lg-4 col-xl-3"
      col.style.animationDelay = `${index * 0.1}s`

      col.innerHTML = `
                <div class="product-card">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="product-image">
                    <div class="product-body">
                        <div class="product-category">${producto.categoria}</div>
                        <h3 class="product-title">${producto.nombre}</h3>
                        <p class="product-description">${producto.descripcion}</p>
                        <div class="product-footer">
                            <span class="product-price">€${producto.precio.toFixed(2)}</span>
                            <button class="btn btn-add" onclick="agregarAlCarrito(${producto.id})">Añadir</button>
                        </div>
                    </div>
                </div>
            `

      grid.appendChild(col)
    })
  }, 500)
}

// Función para filtrar productos
function filtrarProductos(categoria) {
  if (categoria === "todos") {
    renderizarProductos(productosDB)
  } else {
    const productosFiltrados = productosDB.filter((p) => p.categoria === categoria)
    renderizarProductos(productosFiltrados)
  }
}

// Función para agregar al carrito (placeholder)
function agregarAlCarrito(id) {
  const producto = productosDB.find((p) => p.id === id)
  alert(`${producto.nombre} añadido al carrito`)
}

// Event listeners para filtros
document.addEventListener("DOMContentLoaded", () => {
  // Renderizar todos los productos al cargar
  renderizarProductos(productosDB)

  // Agregar event listeners a los botones de filtro
  const botonesFiltro = document.querySelectorAll(".btn-filter")
  botonesFiltro.forEach((boton) => {
    boton.addEventListener("click", () => {
      // Remover clase active de todos los botones
      botonesFiltro.forEach((b) => b.classList.remove("active"))
      // Agregar clase active al botón clickeado
      boton.classList.add("active")
      // Filtrar productos
      const categoria = boton.getAttribute("data-categoria")
      filtrarProductos(categoria)
    })
  })

  // Smooth scroll para enlaces de navegación
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})
