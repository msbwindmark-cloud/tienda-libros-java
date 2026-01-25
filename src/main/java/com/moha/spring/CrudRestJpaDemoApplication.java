package com.moha.spring;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CrudRestJpaDemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrudRestJpaDemoApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UsuarioRepository repo, PasswordEncoder encoder) {
		return args -> {
			// Buscamos si existe el usuario "moha"
			if (repo.findByUsername("moha").isEmpty()) {
				Usuario admin = new Usuario();
				admin.setUsername("moha");
				// Contraseña encriptada
				admin.setPassword(encoder.encode("123"));
				// LE ASIGNAMOS EL ROL DE ADMIN
				admin.setRole("ROLE_ADMIN");
				repo.save(admin);
				System.out.println("✅ Administrador 'moha' creado con éxito.");
			}

			// OPCIONAL: Crear un usuario normal para probar que no puede borrar
			if (repo.findByUsername("invitado").isEmpty()) {
				Usuario invitado = new Usuario();
				invitado.setUsername("invitado");
				invitado.setPassword(encoder.encode("123"));
				invitado.setRole("ROLE_USER");
				repo.save(invitado);
				System.out.println("👤 Usuario 'invitado' creado para pruebas.");
			}
		};
	}

}
