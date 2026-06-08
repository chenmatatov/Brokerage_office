package com.apartment.demo.repository;

import com.apartment.demo.entities.ContactRequest;
import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface ContactRequestRepository extends CrudRepository<ContactRequest, Long> {
    List<ContactRequest> findByAgentIdOrderByCreatedAtDesc(Long agentId);
    List<ContactRequest> findAllByOrderByCreatedAtDesc();
    @Transactional
    void deleteByPropertyId(Long propertyId);
}
