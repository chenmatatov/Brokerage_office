package com.apartment.demo.service;

import com.apartment.demo.dto.AgentDTO;
import com.apartment.demo.dto.AgentStatsDTO;
import java.util.List;

public interface AgentService {
    List<AgentDTO> getAll();
    AgentDTO getById(Long id);
    void save(AgentDTO dto);
    void update(AgentDTO dto);
    void delete(Long id);
    AgentStatsDTO getStats(Long agentId);
}
