package com.fasteam.fasteambackend.configuration.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(

    @Value($$"${jwt.secret}")
    private val secret: String,

    @Value($$"${jwt.expiration}")
    private val expirationMs: Long
) {

    private val signingKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret))
    }

    fun generateToken(user: UserDetails): String {
        val now = Date()
        val expiry = Date(now.time + expirationMs)

        return Jwts.builder()
            .setSubject(user.username)
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(signingKey, SignatureAlgorithm.HS256)
            .compact()
    }

    fun getUsername(token: String): String =
        getClaims(token).subject

    fun isValid(token: String, user: UserDetails): Boolean {
        val username = getUsername(token)
        return username == user.username && !isExpired(token)
    }

    fun isExpired(token: String): Boolean =
        getClaims(token).expiration.before(Date())

    private fun getClaims(token: String): Claims =
        Jwts.parser()
            .setSigningKey(signingKey)
            .build()
            .parseClaimsJws(token)
            .body
}
