package com.fasteam.fasteambackend.application.user.service.dto

data class LoginCommand(
    val username: String,
    val password: String
)
