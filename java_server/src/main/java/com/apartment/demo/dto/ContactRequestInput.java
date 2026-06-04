package com.apartment.demo.dto;

import lombok.Data;

@Data
public class ContactRequestInput {
    private String senderName;
    private String senderEmail;
    private String senderPhone;
    private String message;
    private Long propertyId;
}
