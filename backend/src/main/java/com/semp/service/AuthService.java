package com.semp.service;

import com.semp.dto.JwtAuthResponse;
import com.semp.dto.LoginRequest;
import com.semp.dto.MessageResponse;
import com.semp.dto.RegisterRequest;

public interface AuthService {
    JwtAuthResponse authenticateUser(LoginRequest loginRequest);
    MessageResponse registerUser(RegisterRequest registerRequest);
}
