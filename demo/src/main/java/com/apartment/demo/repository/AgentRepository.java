package com.apartment.demo.repository;

import com.apartment.demo.entities.Agent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
}
