package com.fasteam.fasteambackend.application.user.service.error

import com.fasteam.fasteambackend.application.common.DomainError

sealed class RegisterError {

    data class UsernameAlreadyTaken(val username: String) : RegisterError()

    data object UserHaveNoAnyRoles : RegisterError()
}

typealias RegisterFailure = DomainError<RegisterError>