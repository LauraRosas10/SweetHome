package uis.edu.entorno.backend.controlador;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import uis.edu.entorno.backend.modelo.Categoria;
import uis.edu.entorno.backend.modelo.Producto;
import uis.edu.entorno.backend.modelo.Usuario;
import uis.edu.entorno.backend.servicio.CategoriaService;
import uis.edu.entorno.backend.servicio.CloudinaryService;
import uis.edu.entorno.backend.servicio.ProductoService;
import uis.edu.entorno.backend.servicio.UsuarioService;

@RestController
@RequestMapping("/producto")
public class ProductoControlador {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private CategoriaService categoriaService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Listar todos
    @GetMapping("/")
    public List<Producto> cargarProductos() {
        return productoService.getProductos();
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable int id) {
        return productoService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Crear nuevo producto (resuelve FKs)
    @PostMapping("/nuevo")
    public ResponseEntity<Producto> crearProducto(@RequestBody Producto producto) {
        // 1) Resolver categoría
        if (producto.getId_categoria() == null ||
            producto.getId_categoria().getId_categoria() <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Debe indicar id_categoria");
        }
        Categoria cat = categoriaService
            .obtenerPorId(producto.getId_categoria().getId_categoria())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Categoría no encontrada"));
        producto.setId_categoria(cat);

        // 2) Resolver usuario
        if (producto.getId_usuario() == null ||
            producto.getId_usuario().getId_usuario() <= 0) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Debe indicar id_usuario");
        }
        Usuario usr = usuarioService
            .obtenerPorId(producto.getId_usuario().getId_usuario())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Usuario no encontrado"));
        producto.setId_usuario(usr);

        // 3) Persistir
        Producto creado = productoService.nuevoProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    // Editar producto existente
    @PutMapping("/editar/{id}")
    public ResponseEntity<Producto> editarProducto(
        @PathVariable int id,
        @RequestBody Producto datosRequest
    ) {
        Producto prodExistente = productoService.obtenerPorId(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Producto no encontrado"));

        // Actualizar solo campos modificables
        prodExistente.setNombre(datosRequest.getNombre());
        prodExistente.setStock(datosRequest.getStock());
        prodExistente.setPrecio(datosRequest.getPrecio());
        prodExistente.setDescripcion(datosRequest.getDescripcion());

        // Si permites cambiar categoría
        if (datosRequest.getId_categoria() != null &&
            datosRequest.getId_categoria().getId_categoria() > 0) {
            Categoria cat2 = categoriaService
                .obtenerPorId(datosRequest.getId_categoria().getId_categoria())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Categoría no encontrada"));
            prodExistente.setId_categoria(cat2);
        }

        Producto actualizado = productoService.nuevoProducto(prodExistente);
        return ResponseEntity.ok(actualizado);
    }

    // Borrar producto
    @DeleteMapping("/borrar/{id}")
    public ResponseEntity<Void> borrarProducto(@PathVariable int id) {
        if (productoService.obtenerPorId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        productoService.eliminarProd(id);
        return ResponseEntity.noContent().build();
    }

    // Subir imágenes sin perder datos
    @PostMapping("/{id}/imagenes")
    public ResponseEntity<Producto> subirImagenes(
        @PathVariable Integer id,
        @RequestParam("files") MultipartFile[] files
    ) throws IOException {
        Producto producto = productoService.obtenerPorId(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Producto no encontrado"));

        for (MultipartFile file : files) {
            String url = cloudinaryService.subirImagen(
                file, "sweet_home/products/" + id);
            producto.setImagen(url);
        }

        Producto actualizado = productoService.nuevoProducto(producto);
        return ResponseEntity.ok(actualizado);
    }
}
