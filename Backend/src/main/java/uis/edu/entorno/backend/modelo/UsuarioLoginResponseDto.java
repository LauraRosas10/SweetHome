package uis.edu.entorno.backend.modelo;

public class UsuarioLoginResponseDto {
	private Integer Id_usuario;
	private String Nombre;
	private String Apellidos;
	private String Email;
	private Rol Rol;
	private String Telefono;
	
	public UsuarioLoginResponseDto(Usuario usuario) {
		this.Id_usuario = usuario.getId_usuario();
		this.Nombre = usuario.getNombre();
		this.Apellidos = usuario.getApellidos();
		this.Email = usuario.getEmail();
		this.Rol = usuario.getRol();
		this.Telefono = usuario.getTelefono();
	}

	public Integer getId_usuario() {
		return Id_usuario;
	}

	public void setId_usuario(Integer id_usuario) {
		this.Id_usuario = id_usuario;
	}

	public String getNombre() {
		return Nombre;
	}

	public void setNombre(String nombre) {
		this.Nombre = nombre;
	}

	public String getApellidos() {
		return Apellidos;
	}

	public void setApellidos(String apellidos) {
		this.Apellidos = apellidos;
	}

	public String getEmail() {
		return Email;
	}

	public void setEmail(String email) {
		this.Email = email;
	}

	public Rol getRol() {
		return Rol;
	}

	public void setRol(Rol rol) {
		this.Rol = rol;
	}

	public String getTelefono() {
		return Telefono;
	}

	public void setTelefono(String telefono) {
		this.Telefono = telefono;
	}
	
	
}
