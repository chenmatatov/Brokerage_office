package com.apartment.demo.controller;

import com.apartment.demo.dto.AgentDTO;
import com.apartment.demo.dto.AgentStatsDTO;
import com.apartment.demo.service.AgentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/agents")
@RequiredArgsConstructor
public class AgentController {

    private final AgentService agentService;

    // URL: GET /agents/getAll
    @GetMapping("/getAll")
    public ResponseEntity<List<AgentDTO>> getAll() {
        return ResponseEntity.ok(agentService.getAll());
    }

    // URL: GET /agents/getById/5
    @GetMapping("/getById/{id}")
    public ResponseEntity<AgentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getById(id));
    }

    // URL: POST /agents/create
    @PostMapping("/create")
    public ResponseEntity<String> create(@RequestBody AgentDTO dto) {
        agentService.save(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body("Agent created successfully");
    }

    // URL: PUT /agents/update
    @PutMapping("/update")
    public ResponseEntity<String> update(@RequestBody AgentDTO dto) {
        agentService.update(dto);
        return ResponseEntity.ok("Agent updated successfully");
    }

    // URL: DELETE /agents/delete/5
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        agentService.delete(id);
        return ResponseEntity.ok("Agent deleted successfully");
    }

    // URL: GET /agents/getStats/5
    @GetMapping("/getStats/{id}")
    public ResponseEntity<AgentStatsDTO> getStats(@PathVariable Long id) {
        return ResponseEntity.ok(agentService.getStats(id));
    }
}