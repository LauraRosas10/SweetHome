package uis.edu.entorno.backend.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import uis.edu.entorno.backend.modelo.Producto;

public interface IProductoRepositorio extends JpaRepository<Producto, Integer>{
	@Query("SELECT p FROM Producto p WHERE p.Id_categoria.Estado = 'ACTIVO'")
	List<Producto> findProductosPorCategoriaActiva();



}
