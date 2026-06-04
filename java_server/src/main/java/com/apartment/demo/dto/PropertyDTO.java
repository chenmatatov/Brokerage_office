package com.apartment.demo.dto;

import lombok.Data;
import java.util.List;

@Data
public class PropertyDTO {
    private Long id;
    private String address;
    private double price;
    private int rooms;
    private String description;
    private Long agentId;
    private String agentName;
    private List<String> imageUrls;
}
