package uis.edu.entorno.backend.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;



import uis.edu.entorno.backend.servicio.UsuarioService;
import uis.edu.entorno.backend.modelo.LoginDto;
import uis.edu.entorno.backend.modelo.Usuario;
import uis.edu.entorno.backend.seguridad.JwtTokenProvider;
import uis.edu.entorno.backend.controlador.LoginResponseDto;
@RestController //especifica que esta clase esta diseñada para manejar solicitudes web y devolver datos
@RequestMapping("/usuario")  //Todos los metodos inician por esta ruta
//@CrossOrigin(origins = "http://127.0.0.1:5500") // o "*" para permitir todos los orígenes del frontend
public class UsuarioControlador {
	
	//atributos
	@Autowired//conectar automáticamente los componentes 
	//utilizamos los metodos de la clase
	UsuarioService usuarioService;
	
	@Autowired
	private JwtTokenProvider jwtTokenProvider;
	
	
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
			obj.setContraseña(usuario.getContraseña());
			obj.setRol(usuario.getRol());
			obj.setTelefono(usuario.getTelefono());

			
			usuarioService.nuevoUsuario(obj);
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
	
	// ========== LOGIN (devuelve JWT) ==========
    @PostMapping("/login")
    public ResponseEntity<?> loginCliente(@RequestBody LoginDto loginDto) {
        try {
            // Buscar usuario
            Usuario usuario = usuarioService.buscarPorEmail(loginDto.getEmail());

            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Usuario no encontrado");
            }

            // Verificar contraseña
            if (!usuario.getContraseña().equals(loginDto.getContraseña())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Contraseña incorrecta");
            }

            // GENERAR JWT
            String token = jwtTokenProvider.generarToken(
                usuario.getId_usuario(),
                usuario.getEmail(),
                usuario.getNombre()
            );

            // Crear respuesta con token
            LoginResponseDto response = new LoginResponseDto(
                usuario.getId_usuario(),
                usuario.getNombre(),
                usuario.getApellidos(),
                usuario.getEmail(),
                usuario.getRol().getNombre(),
                token
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al procesar login");
        }
    }
}
