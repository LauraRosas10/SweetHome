package uis.edu.entorno.backend.controlador;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import uis.edu.entorno.backend.modelo.Pedido;
import uis.edu.entorno.backend.servicio.PedidoService;

@RestController
@RequestMapping("/pedido")  //Todos los metodos inician por esta ruta
public class PedidoControlador {

	@Autowired
	PedidoService pedidoService;
	
	//listar pedidos
	@GetMapping("/")
	public List<Pedido> listarpedidos(){
		return pedidoService.getPedidos();
	}
	
	//Buscar por Id
	
	@GetMapping("/{id}")
	public Pedido buscarId(@PathVariable int id){
		
		return pedidoService.buscarpedido(id);
		
	}
	
	//Actualiza pedido
	
	@PutMapping("/editar")
	public ResponseEntity<Pedido> editarpedido(@RequestBody Pedido pedido){
		
		Pedido ped=null;
		
		ped=pedidoService.buscarpedido(pedido.getId_pedido());
		
		if (ped!=null) {
			
			ped.setDireccion(pedido.getDireccion());
			ped.setEstado(pedido.getEstado());
			ped.setFecha(pedido.getFecha());
			ped.setTipo_pago(pedido.getTipo_pago());
			ped.setTotal(pedido.getTotal());	
			
		}else {
			return new ResponseEntity<> (ped,HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		return new ResponseEntity<>(ped, HttpStatus.OK);
	}
	
	//nuevo pedido
	
	@PostMapping("/nuevo")
	public ResponseEntity<Pedido> nuevopedido(@RequestBody Pedido pedido){
		
		Pedido pedid=pedidoService.nuevopedido(pedido);
		
		return new ResponseEntity<>(pedid, HttpStatus.OK);
	}
}
