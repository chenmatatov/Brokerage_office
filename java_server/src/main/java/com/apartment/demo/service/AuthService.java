package com.apartment.demo.service;

import com.apartment.demo.dto.AuthResponse;
import com.apartment.demo.dto.LoginRequest;
import com.apartment.demo.dto.RegisterRequest;
import com.apartment.demo.entities.Agent;
import com.apartment.demo.entities.User;
import com.apartment.demo.repository.AgentRepository;
import com.apartment.demo.repository.UserRepository;
import com.apartment.demo.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AgentRepository agentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already exists");

        User user = new User();
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(User.Role.valueOf(req.getRole().toUpperCase()));

        if (req.getAgentId() != null) {
            Agent agent = agentRepository.findById(req.getAgentId())
                    .orElseThrow(() -> new RuntimeException("Agent not found"));
            user.setAgent(agent);
        }

        userRepository.save(user);
        Long agentId = user.getAgent() != null ? user.getAgent().getId() : null;
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), agentId);
        return new AuthResponse(token, user.getRole().name(), user.getEmail(), agentId);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");

        Long agentId = user.getAgent() != null ? user.getAgent().getId() : null;
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name(), agentId);
        return new AuthResponse(token, user.getRole().name(), user.getEmail(), agentId);
    }
}
