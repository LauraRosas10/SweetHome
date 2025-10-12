package uis.edu.entorno.backend.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;

import uis.edu.entorno.backend.modelo.LoginDto;
import uis.edu.entorno.backend.modelo.Usuario;

public interface IUsuarioService {
    
    // Métodos CRUD básicos
    List<Usuario> getUsuarios();
    
    Usuario buscarUsuario(int id);
    
    Usuario nuevoUsuario(Usuario usuario);
    
    String borrarUsuario(int id);
    
    Usuario buscarPorEmail(String email);
    
    Optional<Usuario> obtenerPorId(Integer id);
    
    // Métodos de autenticación
    int login(LoginDto loginDto);
    
    ResponseEntity<?> ingresar(LoginDto loginDto);  // ← ESTE ES EL NUEVO
}