package uis.edu.entorno.backend.seguridad;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {
	@Value("${jwt.secret:mi-clave-secreta-muy-larga-para-jwt-token-provider}")
	private String jwtSecret;
	
	@Value("${jwt.expiration:86400000}")
	private long jwrExpirationMS;
	
	//=========== Generacion del token===========
	public String generarToken(Integer UsuarioId, String email, String nombre) {
		Date ahora = new Date();
		Date fechaExpiracion = new Date(ahora.getTime()+jwrExpirationMS);
		
		Key key =Keys.hmacShaKeyFor(jwtSecret.getBytes());
		
		return Jwts.builder()
				.setSubject(email)
				.claim("UsuarioId", UsuarioId)
				.claim("nombre", nombre)
				.setIssuedAt(ahora)
				.setExpiration(fechaExpiracion)
				.signWith(key, SignatureAlgorithm.HS512)
				.compact();
	}
	
	
	//========== Validar token =================
	public boolean validarToken(String token) {
		try {
			Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
			Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token);
			
			return true;
		} catch (MalformedJwtException ex) {
			System.out.println("Token JWT invalido: "+ex.getMessage());
		} catch (ExpiredJwtException ex) {
            System.out.println("Token JWT expirado: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.out.println("Token JWT no soportado: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.out.println("Token JWT vacío: " + ex.getMessage());
        }
        return false;
	}
	
	//================= obtener email del token ==========
	public String obtenerEmailDelToken(String token) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
	
	// ========== OBTENER USER ID DEL TOKEN ==========
    public Integer obtenerUserIdDelToken(String token) {
        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("userId", Integer.class);
    }
}
