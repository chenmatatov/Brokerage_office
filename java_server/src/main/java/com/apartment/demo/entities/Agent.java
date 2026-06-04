package com.apartment.demo.entities;

import java.util.List;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
public class Agent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;

    @OneToMany(mappedBy = "agent", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("agent")
    private List<Property> properties;
}
