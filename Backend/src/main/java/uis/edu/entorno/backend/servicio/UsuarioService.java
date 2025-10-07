package uis.edu.entorno.backend.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uis.edu.entorno.backend.modelo.LoginDto;
import uis.edu.entorno.backend.modelo.Usuario;
import uis.edu.entorno.backend.repositorio.IUsuarioRepositorio;

@Service
@Transactional
public class UsuarioService implements IUsuarioService {

    @Autowired
    private IUsuarioRepositorio usuarioRepositorio;

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

    // ============================================
    // MÉTODO LOGIN SIMPLE (devuelve 1 o 0)
    // ============================================
    @Override
    public int login(LoginDto loginDto) {
        Usuario usuario = usuarioRepositorio.findByEmail(loginDto.getEmail());
        
        if (usuario == null) {
            return 0; // Usuario no encontrado
        }
        
        if (!usuario.getContraseña().equals(loginDto.getContraseña())) {
            return 0; // Contraseña incorrecta
        }
        
        return 1; // Login exitoso
    }

    // ============================================
    // MÉTODO LOGIN QUE DEVUELVE EL USUARIO COMPLETO
    // *** ESTE ES EL QUE NECESITAS ***
    // ============================================
    @Override
    public ResponseEntity<?> ingresar(LoginDto loginDto) {
        
        // 1. Buscar usuario por email
        Usuario usuarioEncontrado = usuarioRepositorio.findByEmail(loginDto.getEmail());
        
        // 2. Verificar si existe el usuario
        if (usuarioEncontrado == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Usuario no encontrado");
        }
        
        // 3. Verificar contraseña
        if (!usuarioEncontrado.getContraseña().equals(loginDto.getContraseña())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Contraseña incorrecta");
        }
        
        // 4. Login exitoso - Devolver usuario (sin contraseña por seguridad)
        usuarioEncontrado.setContraseña(null); 
        
        return ResponseEntity.ok(usuarioEncontrado);
    }
}