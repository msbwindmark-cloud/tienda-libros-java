package com.moha.spring;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // IMPORTANTE: Añade esta importación
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).authorizeHttpRequests(auth -> auth
				// 1. Acceso total a archivos y registro
				.requestMatchers("/login.html", "/registro.html", "/style.css", "/api/usuarios/registrar",
						"/api/usuarios/me")
				.permitAll()

				// 2. Usamos hasAuthority porque tu BD tiene el texto completo "ROLE_ADMIN"
				.requestMatchers(HttpMethod.POST, "/books/**").hasAuthority("ROLE_ADMIN")
				.requestMatchers(HttpMethod.PUT, "/books/**").hasAuthority("ROLE_ADMIN")
				.requestMatchers(HttpMethod.DELETE, "/books/**").hasAuthority("ROLE_ADMIN")

				// 3. Ver libros
				.requestMatchers(HttpMethod.GET, "/books/**").authenticated().anyRequest().authenticated())
				.formLogin(form -> form.loginPage("/login.html").loginProcessingUrl("/login")
						.defaultSuccessUrl("/index.html", true).permitAll())
				.logout(logout -> logout.logoutUrl("/logout").logoutSuccessUrl("/login.html?logout").permitAll());

		return http.build();
	}
}