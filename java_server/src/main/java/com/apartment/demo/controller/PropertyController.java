package com.apartment.demo.controller;

import com.apartment.demo.dto.PropertyDTO;
import com.apartment.demo.service.PropertyImageService;
import com.apartment.demo.service.PropertyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final PropertyImageService propertyImageService;

        // URL: GET /properties/getAll
        @GetMapping("/getAll")
        public ResponseEntity<List<PropertyDTO>> getAll() {
            return ResponseEntity.ok(propertyService.getAll());
        }

        // URL: GET /properties/getById/4
        @GetMapping("/getById/{id}")
        public ResponseEntity<PropertyDTO> getById(@PathVariable Long id) {
            return ResponseEntity.ok(propertyService.getById(id));
        }

        // URL: GET /properties/getByAgent/2
        @GetMapping("/getByAgent/{agentId}")
        public ResponseEntity<List<PropertyDTO>> getByAgent(@PathVariable Long agentId) {
            return ResponseEntity.ok(propertyService.getByAgent(agentId));
        }

        // URL: POST /properties/create
        @PostMapping("/create")
        public ResponseEntity<String> create(@RequestBody PropertyDTO dto) {
            propertyService.save(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body("Property created successfully");
        }

        // URL: PUT /properties/update
        @PutMapping("/update")
        public ResponseEntity<String> update(@RequestBody PropertyDTO dto) {
            propertyService.update(dto);
            return ResponseEntity.ok("Property updated successfully");
        }

        // URL: DELETE /properties/delete/4
        @DeleteMapping("/delete/{id}")
        public ResponseEntity<String> delete(@PathVariable Long id) {
            propertyService.delete(id);
            return ResponseEntity.ok("Property deleted successfully");
        }
        // URL: GET /properties/price-range?min=1000&max=5000
        @GetMapping("/price-range")
        public ResponseEntity<List<PropertyDTO>> getByPriceRange(@RequestParam double min, @RequestParam double max) {
            return ResponseEntity.ok(propertyService.getByPriceRange(min, max));
        }
        // URL: GET /properties/rooms/3
        @GetMapping("/rooms/{rooms}")
        public ResponseEntity<List<PropertyDTO>> getByRooms(@PathVariable int rooms) {
            return ResponseEntity.ok(propertyService.getByRooms(rooms));
        }

        // URL: GET /properties/search?keyword=תל אביב
        @GetMapping("/search")
        public ResponseEntity<List<PropertyDTO>> search(@RequestParam String keyword) {
            return ResponseEntity.ok(propertyService.search(keyword));
        }

        // URL: GET /properties/city/תל אביב
        @GetMapping("/city/{city}")
        public ResponseEntity<List<PropertyDTO>> getByCity(@PathVariable String city) {
            return ResponseEntity.ok(propertyService.getByCity(city));
        }

        // URL: POST /properties/addImage/4
        @PostMapping("/addImage/{propertyId}")
        public ResponseEntity<String> addImage(@PathVariable Long propertyId, @RequestParam String imageUrl) {
            propertyImageService.addImage(propertyId, imageUrl);
            return ResponseEntity.status(HttpStatus.CREATED).body("Image added successfully");
        }
}
