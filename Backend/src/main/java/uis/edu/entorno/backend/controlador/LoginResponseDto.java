package uis.edu.entorno.backend.controlador;

public class LoginResponseDto {
	private Integer id_usuario;
    private String nombre;
    private String apellidos;
    private String email;
    private String rol;
    private String token;
    
	public LoginResponseDto() {
		
	}

	// Constructor
    public LoginResponseDto(Integer id_usuario, String nombre, String apellidos, 
                            String email, String rol, String token) {
        this.id_usuario = id_usuario;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.email = email;
        this.rol = rol;
        this.token = token;
    }

    // Getters
    public Integer getId_usuario() {
        return id_usuario;
    }

    public String getNombre() {
        return nombre;
    }

    public String getApellidos() {
        return apellidos;
    }

    public String getEmail() {
        return email;
    }

    public String getRol() {
        return rol;
    }

    public String getToken() {
        return token;
    }

    // Setters
    public void setId_usuario(Integer id_usuario) {
        this.id_usuario = id_usuario;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public void setToken(String token) {
        this.token = token;
    }
	
    
}
