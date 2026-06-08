package com.apartment.demo.service;

import com.apartment.demo.dto.PropertyDTO;
import com.apartment.demo.entities.Agent;
import com.apartment.demo.entities.Property;
import com.apartment.demo.repository.AgentRepository;
import com.apartment.demo.repository.ContactRequestRepository;
import com.apartment.demo.repository.PropertyRepository;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.lang.reflect.Type;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final AgentRepository agentRepository;
    private final ModelMapper mapper;
    private final ContactRequestRepository contactRequestRepository;

    private PropertyDTO toDTO(Property property) {
        PropertyDTO dto = mapper.map(property, PropertyDTO.class);
        if (property.getImages() != null)
            dto.setImageUrls(property.getImages().stream().map(img -> img.getImageUrl()).collect(Collectors.toList()));
        if (property.getAgent() != null)
            dto.setAgentName(property.getAgent().getName());
        return dto;
    }

    @Override
    public List<PropertyDTO> getAll() {
        return ((List<Property>) propertyRepository.findAll()).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public PropertyDTO getById(Long id) {
        return toDTO(propertyRepository.findById(id).orElseThrow(() -> new PropertyException(" - Property not found: " + id)));
    }

    @Override
    public List<PropertyDTO> getByAgent(Long agentId) {
        if (!agentRepository.existsById(agentId))
            throw new PropertyException(" - Agent not found: " + agentId);
        return propertyRepository.findByAgentId(agentId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void save(PropertyDTO dto) {
        if (propertyRepository.existsById(dto.getId() != null ? dto.getId() : -1L))
            throw new PropertyException(" - Property already exists!");
        Property property = mapper.map(dto, Property.class);
        if (dto.getAgentId() != null) {
            Agent agent = agentRepository.findById(dto.getAgentId()).orElseThrow(() -> new PropertyException(" - Agent not found: " + dto.getAgentId()));
            property.setAgent(agent);
        }
        propertyRepository.save(property);
    }

    @Override
    public void update(PropertyDTO dto) {
        Property existing = propertyRepository.findById(dto.getId())
                .orElseThrow(() -> new PropertyException(" - Property does not exist!"));
        existing.setAddress(dto.getAddress());
        existing.setPrice(dto.getPrice());
        existing.setRooms(dto.getRooms());
        existing.setDescription(dto.getDescription());
        if (dto.getAgentId() != null) {
            Agent agent = agentRepository.findById(dto.getAgentId())
                    .orElseThrow(() -> new PropertyException(" - Agent not found: " + dto.getAgentId()));
            existing.setAgent(agent);
        }
        propertyRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        if (!propertyRepository.existsById(id))
            throw new PropertyException(" - Property not found: " + id);
        contactRequestRepository.deleteByPropertyId(id);
        propertyRepository.deleteById(id);
    }

    @Override
    public List<PropertyDTO> getByPriceRange(double min, double max) {
        return propertyRepository.findByPriceBetween(min, max).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<PropertyDTO> getByRooms(int rooms) {
        return propertyRepository.findByRooms(rooms).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<PropertyDTO> search(String keyword) {
        return propertyRepository.searchByKeyword(keyword).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public List<PropertyDTO> getByCity(String city) {
        return propertyRepository.findByCity(city).stream().map(this::toDTO).collect(Collectors.toList());
    }
}
