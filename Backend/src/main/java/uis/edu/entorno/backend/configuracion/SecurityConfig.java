package uis.edu.entorno.backend.configuracion;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import uis.edu.entorno.backend.seguridad.JwtAuthenticationFilter;



@Configuration
@EnableWebSecurity
public class SecurityConfig {
	@Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

	 @Bean
	    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	        http
	            .csrf().disable()
	            .sessionManagement()
	                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
	                .and()
	            .authorizeHttpRequests(authz -> authz
	                // Endpoints públicos (no requieren autenticación)
	                .requestMatchers("/usuario/login").permitAll()
	                .requestMatchers("/usuario/nuevo").permitAll()
	                .requestMatchers("/usuario/loginclient").permitAll()
	                .requestMatchers("/categorias/").permitAll()
	                .requestMatchers("/producto/").permitAll()
	                .requestMatchers("/producto/**").permitAll()
	                .requestMatchers("/rol/**").permitAll()
	                // Todos los demás endpoints requieren autenticación
	                .anyRequest().authenticated()
	            )
	            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

	        return http.build();
	    }
}
