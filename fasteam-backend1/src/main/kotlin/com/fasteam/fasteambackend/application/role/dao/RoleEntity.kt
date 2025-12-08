package com.fasteam.fasteambackend.application.role.dao

import jakarta.persistence.*

@Entity
@Table(name = "roles")
class RoleEntity() {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    @Column(unique = true, nullable = false)
    lateinit var name: String

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "role_authorities",
        joinColumns = [JoinColumn(name = "role_id")]
    )
    @Column(name = "authority")  // <- ВАЖНО: указываем имя колонки
    var authorities: MutableSet<String> = mutableSetOf()  // <- String вместо Enum

    constructor(name: String, authorities: MutableSet<String>) : this() {
        this.name = name
        this.authorities = authorities
    }
}