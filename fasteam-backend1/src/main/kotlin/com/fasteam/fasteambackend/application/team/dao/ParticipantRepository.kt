package com.fasteam.fasteambackend.application.team.dao

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import java.util.UUID

interface ParticipantRepository : JpaRepository<ParticipantEntity, ParticipantId> {

    fun findAllByTeamId(teamId: Long): List<ParticipantEntity>

    fun findAllByUserId(userId: UUID): List<ParticipantEntity>

    fun findByTeamIdAndUserId(teamId: Long, userId: UUID): ParticipantEntity?

    fun existsByTeamIdAndUserId(teamId: Long, userId: UUID): Boolean

    fun deleteByTeamIdAndUserId(teamId: Long, userId: UUID)

    @Query("SELECT p FROM ParticipantEntity p WHERE p.team.id = :teamId AND p.teamRole.name = :roleName")
    fun findAllByTeamIdAndRoleName(@Param("teamId") teamId: Long, @Param("roleName") roleName: String): List<ParticipantEntity>
}