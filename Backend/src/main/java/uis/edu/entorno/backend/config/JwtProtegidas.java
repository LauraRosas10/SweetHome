package uis.edu.entorno.backend.config;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // ⬅️ Importante
import org.springframework.security.core.context.SecurityContextHolder; // ⬅️ Importante
import org.springframework.security.core.userdetails.User; // ⬅️ Usamos una clase básica de UserDetails
import org.springframework.security.core.authority.SimpleGrantedAuthority; // ⬅️ Para asignar roles
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.JwtException;

import java.io.IOException;
import java.util.Collections; // ⬅️ Para la lista de roles

@Component
public class JwtProtegidas extends OncePerRequestFilter {

    @Autowired
    private Jwt jwtUtil;
    


    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

    
        if (path.equals("/usuario/login") || path.equals("/usuario/nuevo") || path.equals("/producto/")|| path.equals("/producto/{id}")|| path.equals("/categoria/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                
                String email = jwtUtil.validarYObtenerEmail(token);
                
                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    
                 
               
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            email, 
                            null, 
                            Collections.emptyList()
                    );
                    
                  
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }

            } catch (JwtException e) {
                // Token inválido o expirado
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        } else {
            // Si no tiene token en rutas protegidas - no autorizado
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        filterChain.doFilter(request, response);
    }
}