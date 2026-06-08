package com.apartment.demo.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AgentNoteDTO {
    private Long id;
    private String clientName;
    private String clientPhone;
    private String clientEmail;
    private LocalDate meetingDate;
    private String propertyOffered;
    private String notes;
    private String status;
    private Long agentId;
    private LocalDateTime createdAt;
}
