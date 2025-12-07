package com.fasteam.fasteambackend.application.user.service

import arrow.core.Either
import arrow.core.raise.either
import arrow.core.raise.ensure
import com.fasteam.fasteambackend.application.common.errorOf
import com.fasteam.fasteambackend.application.role.service.RoleGateway
import com.fasteam.fasteambackend.application.user.api.model.JwtResponse
import com.fasteam.fasteambackend.application.user.dao.UserEntity
import com.fasteam.fasteambackend.application.user.service.dto.LoginCommand
import com.fasteam.fasteambackend.application.user.service.dto.RegisterCommand
import com.fasteam.fasteambackend.application.user.service.error.LoginError
import com.fasteam.fasteambackend.application.user.service.error.LoginFailure
import com.fasteam.fasteambackend.application.user.service.error.RegisterError
import com.fasteam.fasteambackend.application.user.service.error.RegisterFailure
import com.fasteam.fasteambackend.configuration.security.JwtTokenProvider
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserAuthService(
    private val userGateway: UserGateway,
    private val roleGateway: RoleGateway,
    private val encoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
) {

    @Transactional
    fun register(command: RegisterCommand): Either<RegisterFailure, Unit> = either {
        with(command) {
            ensure(
                !userGateway.existsByUsername(username).bind()
            ) { errorOf(RegisterError.UsernameAlreadyTaken(username)) }

            val roles = roleGateway.getRolesByNames(roleNames).bind()
            ensure(roles.isNotEmpty()) { errorOf(RegisterError.UserHaveNoAnyRoles) }

            val user = UserEntity(
                username = username,
                passwordHash = encoder.encode(password)!!,
                roles = roles.toMutableSet(),
                telegramId = telegramId,
                firstName = firstName,
                lastName = lastName,
                avatarUrl = avatarUrl,
                experience = experience
            )

            userGateway.save(user)
        }
    }

    fun login(command: LoginCommand): Either<LoginFailure, JwtResponse> = either {
        with(command) {
            val user = userGateway.findByUsername(username).bind()

            ensure(user != null) { errorOf(LoginError.UserNotFound(username)) }

            ensure(encoder.matches(password, user.passwordHash)) {
                errorOf(LoginError.IncorrectPassword(username, password))
            }

            val token = jwtTokenProvider.generateToken(user)

            JwtResponse(token)
        }
    }
}