package com.fasteam.fasteambackend.application.teamrole.dao

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "team_roles")
class TeamRoleEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int,

    @Column(unique = true, nullable = false, length = 100)
    val name: String,

    val description: String?
)