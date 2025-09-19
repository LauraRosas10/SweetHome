package uis.edu.entorno.backend.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import uis.edu.entorno.backend.modelo.Rol;
import uis.edu.entorno.backend.servicio.RolService;

@RestController
public class RolControlador {

	//Atributos
	
	@Autowired
	RolService rolService;
	
	//Listar los roles
	
	@GetMapping("/roles")
	public List<Rol> cargarRol(){
		return rolService.getRoles();
	}
	
	//Buscar al rol por ID
	
	@GetMapping("/roles/{id}")
	public Rol buscarId (@PathVariable int id) {
		
		return rolService.buscarRol(id);
	}
	
	//nuevo rol
	@PostMapping("/nuevorol")
	
	public ResponseEntity<Rol> crearrol(@RequestBody Rol rol) {
		
		Rol rol1= rolService.nuevoRol(rol);
		
		return new ResponseEntity<> (rol1, HttpStatus.OK);
	}
	
}
