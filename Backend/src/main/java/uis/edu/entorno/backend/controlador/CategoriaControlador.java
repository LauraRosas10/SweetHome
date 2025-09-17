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


import uis.edu.entorno.backend.modelo.Categoria;
import uis.edu.entorno.backend.servicio.CategoriaService;


@RestController
public class CategoriaControlador {

	@Autowired
	CategoriaService categoriaService;
	
	//Listar categorias
	@GetMapping("/categorias")
	public List<Categoria> cargarcategorias(){
		return categoriaService.getCategorias();
	}
	
	//Buscar por ID
	
	@GetMapping("categorias/{id}")
	public Categoria buscarporId(@PathVariable int id) {
		
		return categoriaService.buscarCategoria(id);
	}
	
	//nueva categoria
	@PostMapping("/nuevacategoria")
	public ResponseEntity<Categoria> nuevaCateg(@RequestBody Categoria categoria) {
		
		Categoria cat=categoriaService.nuevaCategoria(categoria);
		
		return new ResponseEntity<> (cat, HttpStatus.OK);
	}
}
