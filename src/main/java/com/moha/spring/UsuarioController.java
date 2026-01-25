package com.moha.spring;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

	@Autowired
	private UsuarioRepository usuarioRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@PostMapping("/registrar")
	public ResponseEntity<String> registrar(@RequestBody Usuario usuario) {
		// 1. Verificar si el usuario ya existe
		if (usuarioRepository.findByUsername(usuario.getUsername()).isPresent()) {
			return ResponseEntity.badRequest().body("El nombre de usuario ya está en uso");
		}

		// 2. Si no existe, encriptar y guardar
		usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
		usuario.setRole("ROLE_USER");
		usuarioRepository.save(usuario);

		return ResponseEntity.ok("Usuario registrado correctamente");
	}

	@GetMapping("/me") // Ahora la ruta real es /api/usuarios/me
	public Map<String, String> getActual() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Map<String, String> userDetails = new HashMap<>();
		userDetails.put("username", auth.getName());
		// Obtenemos el rol limpio
		userDetails.put("role", auth.getAuthorities().toString());
		return userDetails;
	}
}