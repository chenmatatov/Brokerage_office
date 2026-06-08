package com.apartment.demo.repository;

import com.apartment.demo.entities.AgentNote;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface AgentNoteRepository extends CrudRepository<AgentNote, Long> {
    List<AgentNote> findByAgentIdOrderByMeetingDateDesc(Long agentId);
}
