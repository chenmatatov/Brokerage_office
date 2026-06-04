package com.apartment.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ContactRequestDTO {
    private Long id;
    private String senderName;
    private String senderEmail;
    private String senderPhone;
    private String message;
    private LocalDateTime createdAt;
    private Long propertyId;
    private String propertyAddress;
    private Long agentId;
    private String agentName;
}
