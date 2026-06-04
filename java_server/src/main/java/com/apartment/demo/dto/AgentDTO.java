package com.apartment.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class AgentDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private List<PropertyDTO> properties;
}
