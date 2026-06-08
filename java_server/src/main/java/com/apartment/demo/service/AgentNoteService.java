package com.apartment.demo.service;

import com.apartment.demo.dto.AgentNoteDTO;
import com.apartment.demo.entities.Agent;
import com.apartment.demo.entities.AgentNote;
import com.apartment.demo.repository.AgentNoteRepository;
import com.apartment.demo.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AgentNoteService {

    private final AgentNoteRepository agentNoteRepository;
    private final AgentRepository agentRepository;
    private final ModelMapper modelMapper;

    public List<AgentNoteDTO> getByAgent(Long agentId) {
        return agentNoteRepository.findByAgentIdOrderByMeetingDateDesc(agentId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public AgentNoteDTO save(AgentNoteDTO dto) {
        AgentNote note = toEntity(dto);
        return toDTO(agentNoteRepository.save(note));
    }

    public AgentNoteDTO update(AgentNoteDTO dto) {
        AgentNote existing = agentNoteRepository.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Note not found"));
        existing.setClientName(dto.getClientName());
        existing.setClientPhone(dto.getClientPhone());
        existing.setClientEmail(dto.getClientEmail());
        existing.setMeetingDate(dto.getMeetingDate());
        existing.setPropertyOffered(dto.getPropertyOffered());
        existing.setNotes(dto.getNotes());
        existing.setStatus(dto.getStatus());
        return toDTO(agentNoteRepository.save(existing));
    }

    public void delete(Long id) {
        agentNoteRepository.deleteById(id);
    }

    private AgentNoteDTO toDTO(AgentNote n) {
        AgentNoteDTO dto = modelMapper.map(n, AgentNoteDTO.class);
        if (n.getAgent() != null) dto.setAgentId(n.getAgent().getId());
        return dto;
    }

    private AgentNote toEntity(AgentNoteDTO dto) {
        modelMapper.typeMap(AgentNoteDTO.class, AgentNote.class)
                .addMappings(m -> m.skip(AgentNote::setAgent));
        AgentNote note = modelMapper.map(dto, AgentNote.class);
        note.setStatus(dto.getStatus() != null ? dto.getStatus() : "פתוח");
        Agent agent = agentRepository.findById(dto.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        note.setAgent(agent);
        return note;
    }
}
