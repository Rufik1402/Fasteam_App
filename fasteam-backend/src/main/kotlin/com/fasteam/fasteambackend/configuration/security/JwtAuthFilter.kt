package com.fasteam.fasteambackend.configuration.security

import com.fasteam.fasteambackend.application.user.dao.UserRepository
import com.fasteam.fasteambackend.application.user.service.UserGateway
import com.fasteam.fasteambackend.application.user.service.error.LoginError
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse

@Component
class JwtAuthFilter(
    private val jwtTokenProvider: JwtTokenProvider,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response)
            return
        }

        val token = authHeader.substring(7)
        val username = jwtTokenProvider.getUsername(token)
        val context = SecurityContextHolder.getContext()

        if (username != null && context.authentication == null) {
            val userDetails = userRepository.findByUsername(username) ?: throw Exception("User not found")

            if (jwtTokenProvider.isValid(token, userDetails)) {
                val authToken = UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.authorities
                )
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                context.authentication = authToken
            }
        }

        filterChain.doFilter(request, response)
    }
}