package com.semp.service;

import com.semp.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getAdminDashboardStats();
    DashboardStatsDto getEmployeeDashboardStats(Long currentUserId);
}
