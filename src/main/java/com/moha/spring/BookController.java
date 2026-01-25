package com.moha.spring;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // Importa todas las anotaciones de una vez

@RestController
@CrossOrigin(origins = "*") // IMPORTANTE: Permite que tu HTML se conecte a la API
public class BookController {

	@Autowired
	BookRepository bookRepository;

	@Autowired
	private EmailService emailService; // Inyectamos el servicio de correo

	@PostMapping("/books")
	public Book createBook(@RequestBody Book book) {
		Book savedBook = bookRepository.save(book);
		emailService.enviarNotificacion("NUEVO LIBRO CREADO", savedBook);
		return savedBook;
	}

	@GetMapping("/books")
	public List<Book> retreiveAllBooks() {
		return bookRepository.findAll();
	}

	@PutMapping("/books/{id}")
	public Book updateBook(@PathVariable int id, @RequestBody Book bookDetails) {
		// Forzamos el ID de la URL al objeto para evitar errores
		/*
		book.setId(id);
		Book savedBook = bookRepository.save(book);
		emailService.enviarNotificacion("LIBRO MODIFICADO", savedBook);
		return savedBook;
		*/
		Book book = bookRepository.findById(id).orElseThrow();
	    
	    book.setTitle(bookDetails.getTitle());
	    book.setAuthor(bookDetails.getAuthor());
	    book.setPrice(bookDetails.getPrice());
	    book.setImageUrl(bookDetails.getImageUrl());
	    
	    Book updatedBook = bookRepository.save(book);
	    emailService.enviarNotificacion("ACTUALIZACIÓN DE DATOS", updatedBook);
	    return updatedBook;
	}

	@DeleteMapping("/books/{id}")
	public ResponseEntity<?> deleteBook(@PathVariable int id) {
		// ELIMINAMOS el @RequestBody para que sea más sencillo borrar por ID
		Book book = bookRepository.findById(id).orElse(null);
		if (book != null) {
			bookRepository.deleteById(id);
            emailService.enviarNotificacion("LIBRO ELIMINADO", book);
        }
		//bookRepository.deleteById(id);
		return ResponseEntity.ok().build();
	}
}