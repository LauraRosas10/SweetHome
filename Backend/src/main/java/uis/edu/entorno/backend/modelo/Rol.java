package uis.edu.entorno.backend.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name=Rol.TABLE_NAME)
public class Rol {
	
	public static final String TABLE_NAME="rol";
	
	//atributos
	
	@Id  //especifica que es la llave primaria de la tabla
	@GeneratedValue(strategy = GenerationType.IDENTITY) //la genera automaticamente
	private int Id_rol;
	private String Nombre;
	private String Estado;
	
	//contructores
	
	public Rol() {
	
	}


	public Rol(int id_rol, String nombre, String estado) {
		super();
		Id_rol = id_rol;
		Nombre = nombre;
		Estado=estado;
	}


	//get y set
	public int getId_rol() {
		return Id_rol;
	}


	public void setId_rol(int id_rol) {
		Id_rol = id_rol;
	}


	public String getNombre() {
		return Nombre;
	}


	public void setNombre(String nombre) {
		Nombre = nombre;
	}


	public String getEstado() {
		return Estado;
	}


	public void setEstado(String estado) {
		Estado = estado;
	}
	
	
	
	

}
