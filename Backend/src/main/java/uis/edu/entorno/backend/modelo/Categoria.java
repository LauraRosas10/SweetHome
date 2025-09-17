package uis.edu.entorno.backend.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name=Categoria.TABLE_NAME)
public class Categoria {
	
	public static final String TABLE_NAME="categoria";
	
	//atributos
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int Id_categoria;
	
	private String Nombre;
	private String Descripcion;
	private String Estado;
	
	//constructor
	public Categoria() {
		
	}


	
	public Categoria(int id_categoria, String nombre, String descripcion, String estado) {
		super();
		Id_categoria = id_categoria;
		Nombre = nombre;
		Descripcion = descripcion;
		Estado = estado;
	}



	//get y set

	public int getId_categoria() {
		return Id_categoria;
	}

	public void setId_categoria(int id_categoria) {
		Id_categoria = id_categoria;
	}

	public String getNombre() {
		return Nombre;
	}

	public void setNombre(String nombre) {
		Nombre = nombre;
	}

	public String getDescripcion() {
		return Descripcion;
	}

	public void setDescripcion(String descripcion) {
		Descripcion = descripcion;
	}



	public String getEstado() {
		return Estado;
	}



	public void setEstado(String estado) {
		Estado = estado;
	}
	
	

}
