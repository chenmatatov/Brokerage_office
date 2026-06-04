package com.apartment.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AgentStatsDTO {
    private Long agentId;
    private String agentName;
    private int totalProperties;
    private double averagePrice;
    private double minPrice;
    private double maxPrice;
}
