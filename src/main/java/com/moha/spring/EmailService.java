package com.moha.spring;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarNotificacion(String accion, Book book) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("msb.duck@gmail.com");
        message.setTo("asus.medic@gmail.com", "msebti2@gmail.com", "msb.caixa@gmail.com", 
                       "msb.tesla@gmail.com", "msb.windmark@gmail.com", "msb.coin@gmail.com", 
                       "msb.motive@gmail.com");
        
        message.setSubject("ALERTA SISTEMA: " + accion);

        // Creamos un formato de fecha para saber CUÁNDO ocurrió
        String fechaHora = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss"));

        // Construimos el cuerpo del mensaje con todos los datos del objeto
        StringBuilder cuerpo = new StringBuilder();
        cuerpo.append("DETALLES DE LA OPERACIÓN\n");
        cuerpo.append("=========================\n");
        cuerpo.append("Acción: ").append(accion).append("\n");
        cuerpo.append("Fecha: ").append(fechaHora).append("\n\n");
        
        cuerpo.append("DATOS DEL LIBRO:\n");
        cuerpo.append("-------------------------\n");
        cuerpo.append("ID: ").append(book.getId()).append("\n");
        cuerpo.append("Título: ").append(book.getTitle()).append("\n");
        cuerpo.append("Autor: ").append(book.getAuthor()).append("\n");
        cuerpo.append("Precio: ").append(book.getPrice()).append("€\n");
        cuerpo.append("Imagen URL: ").append(book.getImageUrl()).append("\n");
        cuerpo.append("-------------------------\n");
        cuerpo.append("\nEste es un mensaje automático del sistema de gestión CrudRestJPADemo.");

        message.setText(cuerpo.toString());
        
        mailSender.send(message);
    }
}