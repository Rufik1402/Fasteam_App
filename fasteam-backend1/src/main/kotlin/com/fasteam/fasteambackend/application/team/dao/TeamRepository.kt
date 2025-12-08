package com.fasteam.fasteambackend.application.team.dao

import org.springframework.data.jpa.repository.JpaRepository

interface TeamRepository : JpaRepository<TeamEntity, Long> {

    fun findByIdAndIsDeletedFalse(id: Long): TeamEntity?

    fun findAllByIsDeletedFalse(): List<TeamEntity>

    fun findAllByEventIdAndIsDeletedFalse(eventId: Long): List<TeamEntity>

    fun existsByIdAndIsDeletedFalse(id: Long): Boolean
}