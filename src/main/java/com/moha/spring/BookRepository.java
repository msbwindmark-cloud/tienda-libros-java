package com.moha.spring;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Integer> {
	List<Book> findByAuthor(String author);
	
	List<Book> findByTitleContaining(String keyword);
	
	List<Book> findByPriceBetween(double minPrice, double maxPrice);
	
	
}
