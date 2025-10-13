package uis.edu.entorno.backend.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.Customizer;

@Configuration
public class SecurityConfig {

    private final JwtProtegidas jwtProtegidas;

    public SecurityConfig(JwtProtegidas jwtProtegidas) {
        this.jwtProtegidas = jwtProtegidas;
    }
    
    //cuando se activa segurityconfig apesar de tener el cors es necesario ponerlo aqui
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 🎯 Incluye tus orígenes
        configuration.setAllowedOrigins(Arrays.asList("http://127.0.0.1:5500", "http://localhost:5500"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica a todas las rutas
        return source;
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                
                // 1. 🔑 ACTIVAR EL CORS: Esto le indica a Spring Security que use el bean de arriba
                .cors(Customizer.withDefaults()) 
                
                .authorizeHttpRequests(auth -> auth
                        
                        // 2. 🔑 PERMITIR OPTIONS: Regla crítica para el preflight de CORS.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                        
                        // 3. RUTAS PÚBLICAS: GET /producto/** no requiere token.
                        .requestMatchers(HttpMethod.GET, "/producto/**").permitAll() 
                        
                        // 4. RUTAS PÚBLICAS: Login y registro no requieren token.
                        .requestMatchers("/usuario/login", "/usuario/nuevo","/categoria/").permitAll()
                        
                        // 5. El resto de solicitudes (POST/PUT/DELETE, o GET a otras rutas) debe estar autenticado.
                        .anyRequest().authenticated()
                )
                // 6. El filtro JWT se aplica antes de que Spring evalúe las credenciales de usuario y solo para rutas que requieren autenticación.
                .addFilterBefore(jwtProtegidas, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
