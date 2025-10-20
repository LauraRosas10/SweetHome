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
    

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
  
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
        
                .cors(Customizer.withDefaults()) 
                
                .authorizeHttpRequests(auth -> auth
                        
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() 
                        
                        .requestMatchers(HttpMethod.GET, "/producto/**").permitAll() 
                        

                        .requestMatchers("/usuario/login", "/usuario/nuevo","/categoria/").permitAll()
                
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtProtegidas, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
