package com.fasteam.fasteambackend.application.user.service.error

import com.fasteam.fasteambackend.application.common.DomainError

sealed class LoginError {

    data class UserNotFound(val username: String) : LoginError()

    data class IncorrectPassword(val username: String, val password: String) : LoginError()
}

typealias LoginFailure = DomainError<LoginError>