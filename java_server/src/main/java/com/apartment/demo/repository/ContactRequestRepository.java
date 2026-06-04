package com.apartment.demo.repository;

import com.apartment.demo.entities.ContactRequest;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface ContactRequestRepository extends CrudRepository<ContactRequest, Long> {
    List<ContactRequest> findByAgentIdOrderByCreatedAtDesc(Long agentId);
    List<ContactRequest> findAllByOrderByCreatedAtDesc();
}
