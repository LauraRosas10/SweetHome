package uis.edu.entorno.backend.controlador;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import uis.edu.entorno.backend.servicio.UsuarioService;
import uis.edu.entorno.backend.config.Jwt;
import uis.edu.entorno.backend.modelo.LoginDto;
import uis.edu.entorno.backend.modelo.Usuario;
@CrossOrigin(origins = {"http://127.0.0.1:5500", "http://localhost:5500"}, allowCredentials = "true") 
@RestController //especifica que esta clase esta diseñada para manejar solicitudes web y devolver datos
@RequestMapping("/usuario")  //Todos los metodos inician por esta ruta
//@CrossOrigin(origins = "http://127.0.0.1:5500") // o "*" para permitir todos los orígenes del frontend
public class UsuarioControlador {
	
	//atributos
	@Autowired//conectar automáticamente los componentes 
	//utilizamos los metodos de la clase
	UsuarioService usuarioService;
	
	//Listar usuarios
	@GetMapping("/")//Le dice al servidor que este método debe manejar 
	//las solicitudes HTTP de tipo GET
	public List<Usuario> cargarUsuario(){
		return usuarioService.getUsuarios();
	}
	
	//Buscar por ID
	
	@GetMapping("/{id}")
	public Usuario buscarPorId (@PathVariable int id) {
		
		return usuarioService.buscarUsuario(id);
	}
	
	//agregar un usuario

	@PostMapping("/nuevo")
	public ResponseEntity<?> agregar(@RequestBody Usuario usuario){
		
	    try {
	        Usuario obj = usuarioService.nuevoUsuario(usuario);
	        return new ResponseEntity<>(obj, HttpStatus.OK);
	    } catch (RuntimeException e) {
	        // Si el correo ya está registrado, devuelve un error y un mensaje claro
	        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
	    }
	}
	
	//editar usuario
	
	@PutMapping("/editar")
	//Es el tipo de dato que el método devolverá //con el formato JSON  de entrada se crea el objeto
	public ResponseEntity<Usuario> editar(@RequestBody Usuario usuario){
		Usuario obj =usuarioService.buscarUsuario(usuario.getId_usuario());
		
		if (obj!=null) {
			//get obtiene los valores del JSOn ingresado
			//set reestablece, cambia el valor actual
			obj.setEmail(usuario.getEmail());
			obj.setNombre(usuario.getNombre());
			obj.setApellidos(usuario.getApellidos());
			obj.setRol(usuario.getRol());
			obj.setTelefono(usuario.getTelefono());

		    // Solo actualizar contraseña si viene algo
		    if (usuario.getContraseña() != null && !usuario.getContraseña().isEmpty()) {
		        obj.setContraseña(usuario.getContraseña());
		    }
			usuarioService.guardarUsuario(obj);
		}else {
			return new ResponseEntity<>(obj, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<> (obj, HttpStatus.OK);
		
	}	
	
	//eliminar usuario
	
	@DeleteMapping("/borrar/{id}")
	public ResponseEntity<Usuario> eliminar(@PathVariable int id){
		Usuario obj =usuarioService.buscarUsuario(id);
		
		if (obj!=null) {
			usuarioService.borrarUsuario(id);
		}else {
			return new ResponseEntity<>(obj, HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return null;
	}
	
	
	
	//LOGIN
	
	@PostMapping("/loginclient") 
	public int login(@RequestBody LoginDto usuario) {
		int responseLogin = usuarioService.login(usuario);
		return responseLogin;
	}
	
	@Autowired
	private Jwt jwtUtil;

	@PostMapping("/login")
	public ResponseEntity<?> loginCliente(@RequestBody LoginDto usuario) {
	    Usuario user = usuarioService.loginReturnUser(usuario); // nuevo método que devuelve el usuario completo
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
	                .body(Map.of("mensaje", "Credenciales incorrectas"));
	    }

	    String token = jwtUtil.generarToken(user.getEmail());

	    return ResponseEntity.ok(Map.of(
	            "token", token,
	            "nombre", user.getNombre(),
	            "id",user.getId_usuario(),
	            "rol", user.getRol()
	    ));
	}

}
