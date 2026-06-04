package com.apartment.demo.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String role; // USER, AGENT, ADMIN
    private Long agentId; // רק לסוכנים
}
