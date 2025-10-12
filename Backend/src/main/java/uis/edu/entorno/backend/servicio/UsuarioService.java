package uis.edu.entorno.backend.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uis.edu.entorno.backend.controlador.LoginResponseDto;
import uis.edu.entorno.backend.modelo.LoginDto;
import uis.edu.entorno.backend.modelo.Usuario;
import uis.edu.entorno.backend.modelo.UsuarioLoginResponseDto;
import uis.edu.entorno.backend.repositorio.IUsuarioRepositorio;
import uis.edu.entorno.backend.seguridad.JwtTokenProvider;

@Service
@Transactional
public class UsuarioService implements IUsuarioService {

    @Autowired
    private IUsuarioRepositorio usuarioRepositorio;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    
    @Override
    public List<Usuario> getUsuarios() {
        return usuarioRepositorio.findAll();
    }

    @Override
    public Usuario buscarUsuario(int id) {
        return usuarioRepositorio.findById(id).orElse(null);
    }

    @Override
    public Usuario nuevoUsuario(Usuario usuario) {
        // Verificar si el correo ya existe
        Usuario existente = usuarioRepositorio.findByEmail(usuario.getEmail());
        if (existente != null && existente.getId_usuario() != usuario.getId_usuario()) {
            throw new RuntimeException("El correo ya está registrado");
        }
        return usuarioRepositorio.save(usuario);
    }

    @Override
    public String borrarUsuario(int id) {
        usuarioRepositorio.deleteById(id);
        return "Usuario eliminado exitosamente";
    }

    @Override
    public Optional<Usuario> obtenerPorId(Integer id) {
        return usuarioRepositorio.findById(id);
    }

    public Usuario buscarPorEmail(String email) {
        return usuarioRepositorio.findByEmail(email);
    }
    
    @Override
    public ResponseEntity<?> ingresar(LoginDto loginDto) {
        // Usar el método del servicio en lugar de llamar directo al repositorio
        Usuario usuarioEncontrado = buscarPorEmail(loginDto.getEmail());

        if (usuarioEncontrado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Usuario no encontrado");
        }

        if (!usuarioEncontrado.getContraseña().equals(loginDto.getContraseña())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Contraseña incorrecta");
        }

        // Generar JWT
        String token = jwtTokenProvider.generarToken(
            usuarioEncontrado.getId_usuario(),
            usuarioEncontrado.getEmail(),
            usuarioEncontrado.getNombre()
        );

        // Crear response con token
        LoginResponseDto response = new LoginResponseDto(
            usuarioEncontrado.getId_usuario(),
            usuarioEncontrado.getNombre(),
            usuarioEncontrado.getApellidos(),
            usuarioEncontrado.getEmail(),
            usuarioEncontrado.getRol().getNombre(),
            token);

        return ResponseEntity.ok(response);
    }

	@Override
	public int login(LoginDto loginDto) {
		// TODO Auto-generated method stub
		return 0;
	}
}