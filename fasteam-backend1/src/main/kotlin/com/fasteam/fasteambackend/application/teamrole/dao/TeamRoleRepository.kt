package com.fasteam.fasteambackend.application.teamrole.dao

import org.springframework.data.jpa.repository.JpaRepository

interface TeamRoleRepository : JpaRepository<TeamRoleEntity, Int> {

    fun findByName(name: String): TeamRoleEntity?

    fun existsByName(name: String): Boolean
}