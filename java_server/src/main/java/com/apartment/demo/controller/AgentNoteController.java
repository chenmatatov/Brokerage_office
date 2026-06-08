package com.apartment.demo.controller;

import com.apartment.demo.dto.AgentNoteDTO;
import com.apartment.demo.service.AgentNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/notes")
@RequiredArgsConstructor
public class AgentNoteController {

    private final AgentNoteService agentNoteService;

    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<AgentNoteDTO>> getByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(agentNoteService.getByAgent(agentId));
    }

    @PostMapping("/create")
    public ResponseEntity<AgentNoteDTO> create(@RequestBody AgentNoteDTO dto) {
        return ResponseEntity.ok(agentNoteService.save(dto));
    }

    @PutMapping("/update")
    public ResponseEntity<AgentNoteDTO> update(@RequestBody AgentNoteDTO dto) {
        return ResponseEntity.ok(agentNoteService.update(dto));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        agentNoteService.delete(id);
        return ResponseEntity.ok("נמחק בהצלחה");
    }
}
