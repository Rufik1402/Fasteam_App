package com.fasteam.fasteambackend.application.user.service.dto

data class RegisterCommand(
    val username: String,
    val password: String,
    val roleNames: List<String>,
    val telegramId: String,
    val firstName: String,
    val lastName: String,
    val avatarUrl: String?,
    val experience: String?
)