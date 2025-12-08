package com.fasteam.fasteambackend.application.user.dao

import com.fasteam.fasteambackend.application.role.dao.RoleEntity
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import java.util.UUID

@Entity
@Table(name = "users")
open class UserEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    var id: UUID? = null,
    @get:JvmName("getUserNameProperty")
    @Column(unique = true)
    var username: String,
    @Column(nullable = false)
    val passwordHash: String,
    @Column(unique = true)
    val telegramId: String,
    var firstName: String,
    var lastName: String,
    var avatarUrl: String?,
    var experience: String?,
    @ManyToMany(cascade = [CascadeType.PERSIST, CascadeType.MERGE], fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "role_id")]
    )
    val roles: MutableSet<RoleEntity> = mutableSetOf(),
) : UserDetails {

    override fun getAuthorities(): MutableCollection<out GrantedAuthority> {
        val auths = mutableSetOf<SimpleGrantedAuthority>()
        roles.forEach { role ->
            // Добавляем роль как ROLE_*
            auths.add(SimpleGrantedAuthority("ROLE_${role.name}"))
            // Добавляем все authorities из роли
            role.authorities.forEach { authority ->
                auths.add(SimpleGrantedAuthority(authority))
            }
        }
        return auths.toMutableList()
    }

    override fun getPassword() = passwordHash

    override fun getUsername() = username
}