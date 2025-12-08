package com.fasteam.fasteambackend.application.user.api.model

import com.fasteam.fasteambackend.application.user.service.dto.LoginCommand

data class LoginRequest(
    val username: String,
    val password: String
) {

    fun toCommand(): LoginCommand = LoginCommand(username, password)
}