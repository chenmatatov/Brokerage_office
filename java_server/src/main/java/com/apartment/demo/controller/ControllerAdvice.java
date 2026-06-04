package com.apartment.demo.controller;


import com.apartment.demo.service.AgentException;
import com.apartment.demo.service.PropertyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;


@RestControllerAdvice
public class ControllerAdvice {

    @ExceptionHandler(AgentException.class)
    public ResponseEntity<String> handleAgentException(AgentException e)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exception with agent" + e.getMessage());
    }

    @ExceptionHandler(PropertyException.class)
    public ResponseEntity<String> handlePropertyException(PropertyException e)
    {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exception with property" + e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception e)
    {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Oops...... We are sorry, there is a problem");
    }


    
}
