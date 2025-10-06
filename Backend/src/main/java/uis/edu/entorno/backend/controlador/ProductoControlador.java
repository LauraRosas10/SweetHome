package uis.edu.entorno.backend.controlador;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import uis.edu.entorno.backend.modelo.Producto;
import uis.edu.entorno.backend.modelo.Usuario;
import uis.edu.entorno.backend.repositorio.IUsuarioRepositorio;
import uis.edu.entorno.backend.servicio.CloudinaryService;
import uis.edu.entorno.backend.servicio.ProductoService;

@RestController
@RequestMapping("/productos")
public class ProductoControlador {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private CloudinaryService cloudinaryService;

    // Opcional: para verificar propietario por email/username
    @Autowired(required = false)
    private IUsuarioRepositorio iusuarioRepo;

    // Listar productos
    @GetMapping
    public ResponseEntity<List<Producto>> cargarProductos() {
        List<Producto> lista = productoService.getProductos();
        return ResponseEntity.ok(lista);
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarporID(@PathVariable int id) {
        Producto p = productoService.buscarProducto(id);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(p);
    }

    // Crear nuevo producto
    @PostMapping
    public ResponseEntity<Producto> crearproducto(@RequestBody Producto producto, Principal principal) {
        Producto prod = productoService.nuevoProducto(producto);
        return ResponseEntity.status(HttpStatus.CREATED).body(prod);
    }

    // Actualizar producto
    @PutMapping("/{id}")
    public ResponseEntity<Producto> editarproducto(@PathVariable int id, @RequestBody Producto input) {
        Producto prod = productoService.buscarProducto(id);
        if (prod == null) return ResponseEntity.notFound().build();

        // Actualizar campos desde el input (solo los editables)
        prod.setNombre(input.getNombre());
        prod.setStock(input.getStock());
        prod.setPrecio(input.getPrecio());
        prod.setDescripcion(input.getDescripcion());
        if (input.getId_categoria() != null) prod.setId_categoria(input.getId_categoria());
        // No tocar Id_usuario aquí a menos que la lógica lo permita

        Producto guardado = productoService.nuevoProducto(prod);
        return ResponseEntity.ok(guardado);
    }

    // Eliminar producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrarproducto(@PathVariable int id) {
        Producto prod = productoService.buscarProducto(id);
        if (prod == null) return ResponseEntity.notFound().build();
        productoService.eliminarProd(id);
        return ResponseEntity.noContent().build();
    }

    // Subir imágenes a Cloudinary y guardar la URL principal en Producto.Imagen
    @PostMapping("/{id}/imagenes")
    public ResponseEntity<List<String>> subirImagenes(
            @PathVariable int id,
            @RequestParam("files") MultipartFile[] files,
            Principal principal) {

        Producto producto = productoService.buscarProducto(id);
        if (producto == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).build();


        List<String> urls = new ArrayList<>();
        try {
            for (MultipartFile file : files) {
                String url = cloudinaryService.upload(file, "sweet_home/products/" + id);
                urls.add(url);
            }
        } catch (IOException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        // Guardar solo la primera URL en la columna Imagen (solución simple)
        if (!urls.isEmpty()) {
            producto.setImagen(urls.get(0));
            productoService.nuevoProducto(producto);
        }

        return ResponseEntity.ok(urls);
    }
}
