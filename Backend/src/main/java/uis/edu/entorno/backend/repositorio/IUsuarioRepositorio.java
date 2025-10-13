package uis.edu.entorno.backend.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import uis.edu.entorno.backend.modelo.Usuario;

//puente entre  objetos Java y la base de datos, permitiéndote realizar operaciones de CRUD
//sin necesidad de definir metodos

public interface IUsuarioRepositorio extends JpaRepository<Usuario, Integer> {

	//para el login se agrega
	
	//JPQL: Se hace la consulta sobre la clase
	
	//nos dice cuantos registros hay con ese nombre y password
	
	//Estamos trabajando con el modelo Usuario, donde se utilizan los atributos de este
	@Query("select count(*) from Usuario as u where u.Email=:Email and u.Contraseña=:Contraseña")
	
	Integer findByNombreUsuarioAndPassword(@Param("Email") String Email,
			@Param("Contraseña") String password);
	
	
	//Nos recupera el objeto usuario por completo con las coincidencias
	@Query("select u from Usuario as u where u.Email =:Email and u.Contraseña=:Contraseña")
	Usuario findByNameAndPassword (@Param("Email") String Email, 
			@Param("Contraseña") String password);	
	
	//metodo para verificar que ese correo ya existe
	
	@Query("select u from Usuario u where u.Email = :Email")
	Usuario findByEmailJPQL(@Param("Email") String Email);

	//se utilizan las query por la notacion de los atributos, ya que es complejo la toma de mayuscula
	//por ende se define de esta forma, ya que no se aplica directamente el metodo
	
	
	@Query("SELECT u FROM Usuario u WHERE u.Email = :Email AND u.Contraseña = :Contraseña")
	Optional<Usuario> findByEmailAndContraseña(@Param("Email") String Email, @Param("Contraseña") String Contraseña);

}
