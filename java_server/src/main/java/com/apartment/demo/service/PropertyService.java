package com.apartment.demo.service;

import com.apartment.demo.dto.PropertyDTO;
import java.util.List;

public interface PropertyService {
    List<PropertyDTO> getAll();
    PropertyDTO getById(Long id);
    List<PropertyDTO> getByAgent(Long agentId);
    void save(PropertyDTO dto);
    void update(PropertyDTO dto);
    void delete(Long id);
    List<PropertyDTO> getByPriceRange(double min, double max);
    List<PropertyDTO> getByRooms(int rooms);
    List<PropertyDTO> search(String keyword);
    List<PropertyDTO> getByCity(String city);
}
