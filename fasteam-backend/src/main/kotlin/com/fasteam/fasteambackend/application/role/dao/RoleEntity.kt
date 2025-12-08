package com.fasteam.fasteambackend.application.role.dao

import com.fasteam.fasteambackend.application.authority.Authority
import jakarta.persistence.*

@Entity
@Table(name = "roles")
class RoleEntity() {  // <- пустой конструктор для Hibernate

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    @Column(unique = true, nullable = false)
    lateinit var name: String

    @ElementCollection
    @CollectionTable(
        name = "role_authorities",
        joinColumns = [JoinColumn(name = "role_id")]
    )
    @Enumerated(EnumType.STRING)
    var authorities: MutableSet<Authority> = mutableSetOf()

    // Дополнительно можно добавить вспомогательный конструктор для удобного создания
    constructor(name: String, authorities: MutableSet<Authority>) : this() {
        this.name = name
        this.authorities = authorities
    }
}
