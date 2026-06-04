package com.apartment.demo.service;

import com.apartment.demo.dto.AgentDTO;
import com.apartment.demo.dto.AgentStatsDTO;
import com.apartment.demo.entities.Agent;
import com.apartment.demo.repository.AgentRepository;
import com.apartment.demo.repository.PropertyRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.lang.reflect.Type;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentServiceImpl implements AgentService {

    private final AgentRepository agentRepository;
    private final PropertyRepository propertyRepository;
    private final ModelMapper mapper;

    @Override
    public List<AgentDTO> getAll() {
        Type listType = new TypeToken<List<AgentDTO>>(){}.getType();
        return mapper.map((List<Agent>) agentRepository.findAll(), listType);
    }

    @Override
    public AgentDTO getById(Long id) {
        return mapper.map(agentRepository.findById(id).orElseThrow(() -> new AgentException(" - Agent not found: " + id)), AgentDTO.class);
    }

    @Override
    public void save(AgentDTO dto) {
        if (agentRepository.existsById(dto.getId() != null ? dto.getId() : -1L))
            throw new AgentException(" - Agent already exists!");
        agentRepository.save(mapper.map(dto, Agent.class));
    }

    @Override
    public void update(AgentDTO dto) {
        if (!agentRepository.existsById(dto.getId()))
            throw new AgentException(" - Agent does not exist!");
        agentRepository.save(mapper.map(dto, Agent.class));
    }

    @Override
    public void delete(Long id) {
        if (!agentRepository.existsById(id))
            throw new AgentException(" - Agent not found: " + id);
        agentRepository.deleteById(id);
    }

    @Override
    public AgentStatsDTO getStats(Long agentId) {
        Agent agent = agentRepository.findById(agentId).orElseThrow(() -> new AgentException(" - Agent not found: " + agentId));
        List<Double> prices = propertyRepository.findByAgentId(agentId)
                .stream().map(p -> p.getPrice()).toList();

        if (prices.isEmpty())
            return new AgentStatsDTO(agentId, agent.getName(), 0, 0, 0, 0);

        double avg = prices.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        double min = prices.stream().mapToDouble(Double::doubleValue).min().orElse(0);
        double max = prices.stream().mapToDouble(Double::doubleValue).max().orElse(0);

        return new AgentStatsDTO(agentId, agent.getName(), prices.size(), avg, min, max);
    }
}
