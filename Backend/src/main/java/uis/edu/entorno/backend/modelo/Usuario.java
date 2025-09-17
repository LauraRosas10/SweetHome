package uis.edu.entorno.backend.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import uis.edu.entorno.backend.modelo.Usuario;


@Entity  // se coloca sobre una clase Java para indicar que es una entidad JPA,
//es decir, esta clase representa una tabla en la BD para springboot-hibernate

@Table(name=Usuario.TABLE_NAME) //se usa para especificar el nombre de la tabla en la BD
public class Usuario {
	
	//crea una nueva constante llamada TABLE_NAME para definir el nombre de la tabla
	public static final String TABLE_NAME="usuario";
	
	//atributos
	
	@Id  //especifica que es la llave primaria de la tabla
	@GeneratedValue(strategy = GenerationType.IDENTITY) //la genera automaticamente
	private int Id_usuario;
		
	private String Nombre;
	private String Apellidos;
	private String Email;
	private String Contraseña;
	
	
	//hacer la foranea
	
	@ManyToOne  //muchos a uno
	@JoinColumn(name="Rol")  //me relaciona las tablas - el atributo Rol (vincula)
	private Rol Rol;
	
	private String Telefono;
	
	//contructor
	public Usuario() {
		
	}

	
	public Usuario(int id_usuario, String nombre, String apellidos, String email, String contraseña,
			uis.edu.entorno.backend.modelo.Rol rol, String telefono) {

		Id_usuario = id_usuario;
		Nombre = nombre;
		Apellidos = apellidos;
		Email = email;
		Contraseña = contraseña;
		Rol = rol;
		Telefono = telefono;
	}



	//set y get
	
	public int getId_usuario() {
		return Id_usuario;
	}

	public void setId_usuario(int id_usuario) {
		Id_usuario = id_usuario;
	}

	public String getNombre() {
		return Nombre;
	}

	public void setNombre(String nombre) {
		Nombre = nombre;
	}

	public String getApellidos() {
		return Apellidos;
	}

	public void setApellidos(String apellidos) {
		Apellidos = apellidos;
	}

	public String getEmail() {
		return Email;
	}

	public void setEmail(String email) {
		Email = email;
	}

	public String getContraseña() {
		return Contraseña;
	}

	public void setContraseña(String contraseña) {
		Contraseña = contraseña;
	}


	public Rol getRol() {
		return Rol;
	}

	public void setRol(Rol rol) {
		Rol = rol;
	}

	public String getTelefono() {
		return Telefono;
	}

	public void setTelefono(String telefono) {
		Telefono = telefono;
	}
	
	
	
	
}
