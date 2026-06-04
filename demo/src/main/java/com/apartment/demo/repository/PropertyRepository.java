package com.apartment.demo.repository;

import com.apartment.demo.entities.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByAgentId(Long agentId);
    List<Property> findByPriceBetween(double minPrice, double maxPrice);
    List<Property> findByRooms(int rooms);

    @Query("SELECT p FROM Property p WHERE " +
           "LOWER(p.address) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Property> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT p FROM Property p WHERE LOWER(p.address) LIKE LOWER(CONCAT('%', :city, '%'))")
    List<Property> findByCity(@Param("city") String city);
}
