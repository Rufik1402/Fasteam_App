package com.fasteam.fasteambackend.application.role.dao

import org.springframework.data.jpa.repository.JpaRepository

interface RoleRepository : JpaRepository<RoleEntity, Long> {

    fun findByName(name: String): RoleEntity?

    fun getRolesByNameIn(names: List<String>): List<RoleEntity>
}