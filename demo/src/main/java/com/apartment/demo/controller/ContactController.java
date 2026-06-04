package com.apartment.demo.controller;

import com.apartment.demo.dto.ContactRequestDTO;
import com.apartment.demo.dto.ContactRequestInput;
import com.apartment.demo.service.ContactRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactRequestService contactRequestService;

    // URL: POST /contact/send
    @PostMapping("/send")
    public ResponseEntity<String> send(@RequestBody ContactRequestInput input) {
        contactRequestService.save(input);
        return ResponseEntity.ok("הפנייה נשלחה בהצלחה");
    }

    // URL: GET /contact/agent/1
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<List<ContactRequestDTO>> getByAgent(@PathVariable Long agentId) {
        return ResponseEntity.ok(contactRequestService.getByAgent(agentId));
    }

    // URL: GET /contact/all
    @GetMapping("/all")
    public ResponseEntity<List<ContactRequestDTO>> getAll() {
        return ResponseEntity.ok(contactRequestService.getAll());
    }
}
