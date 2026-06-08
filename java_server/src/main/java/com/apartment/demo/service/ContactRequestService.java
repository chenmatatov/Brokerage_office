package com.apartment.demo.service;

import com.apartment.demo.dto.ContactRequestDTO;
import com.apartment.demo.dto.ContactRequestInput;
import com.apartment.demo.entities.ContactRequest;
import com.apartment.demo.entities.Property;
import com.apartment.demo.repository.ContactRequestRepository;
import com.apartment.demo.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactRequestService {

    private final ContactRequestRepository contactRequestRepository;
    private final PropertyRepository propertyRepository;
    private final ModelMapper modelMapper;

    public void save(ContactRequestInput input) {
        Property property = propertyRepository.findById(input.getPropertyId())
                .orElseThrow(() -> new PropertyException(" - Property not found: " + input.getPropertyId()));
        ContactRequest req = modelMapper.map(input, ContactRequest.class);
        req.setProperty(property);
        req.setAgent(property.getAgent());
        contactRequestRepository.save(req);
    }

    public List<ContactRequestDTO> getByAgent(Long agentId) {
        return contactRequestRepository.findByAgentIdOrderByCreatedAtDesc(agentId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<ContactRequestDTO> getAll() {
        return ((List<ContactRequest>) contactRequestRepository.findAllByOrderByCreatedAtDesc())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    private ContactRequestDTO toDTO(ContactRequest r) {
        ContactRequestDTO dto = modelMapper.map(r, ContactRequestDTO.class);
        if (r.getProperty() != null) {
            dto.setPropertyId(r.getProperty().getId());
            dto.setPropertyAddress(r.getProperty().getAddress());
        }
        if (r.getAgent() != null) {
            dto.setAgentId(r.getAgent().getId());
            dto.setAgentName(r.getAgent().getName());
        }
        return dto;
    }
}
