package com.fasteam.fasteambackend.application.user.api

import com.fasteam.fasteambackend.application.user.api.model.LoginRequest
import com.fasteam.fasteambackend.application.user.service.UserAuthService
import com.fasteam.fasteambackend.application.user.service.dto.RegisterCommand
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/auth")
class UserAuthController(
    private val authService: UserAuthService
) {

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<out Any> {
        return authService.login(request.toCommand()).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { token ->
                ResponseEntity.ok(token)
            }
        )
    }

    @PostMapping("/register")
    fun register(@RequestBody request: RegisterCommand): ResponseEntity<out Any> {
        return authService.register(request).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { token ->
                ResponseEntity.status(HttpStatus.CREATED).build()
            }
        )
    }
}