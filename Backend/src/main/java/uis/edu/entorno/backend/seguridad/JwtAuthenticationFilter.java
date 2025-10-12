package uis.edu.entorno.backend.seguridad;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;

public class JwtAuthenticationFilter extends OncePerRequestFilter{
	@Autowired
	private JwtTokenProvider tokenProvider;
	
	//================ Obtener el token del header================
	private String obtenerTokenDelRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
	
	@Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            String jwt = obtenerTokenDelRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validarToken(jwt)) {
                String email = tokenProvider.obtenerEmailDelToken(jwt);
                Integer UsuarioId = tokenProvider.obtenerUserIdDelToken(jwt);

                // Crear autenticación
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        email, 
                        null, 
                        new ArrayList<>()
                    );
                authentication.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            logger.error("No se puede establecer autenticación del usuario", ex);
        }

        filterChain.doFilter(request, response);
    }
	
}
