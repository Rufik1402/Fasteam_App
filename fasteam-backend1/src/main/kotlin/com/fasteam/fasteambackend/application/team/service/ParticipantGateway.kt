package com.fasteam.fasteambackend.application.team.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.team.dao.ParticipantEntity
import java.util.UUID

interface ParticipantGateway {

    fun findAllByTeamId(teamId: Long): Either<DatabaseError, List<ParticipantEntity>>

    fun findAllByUserId(userId: UUID): Either<DatabaseError, List<ParticipantEntity>>

    fun findByTeamIdAndUserId(teamId: Long, userId: UUID): Either<DatabaseError, ParticipantEntity?>

    fun existsByTeamIdAndUserId(teamId: Long, userId: UUID): Either<DatabaseError, Boolean>

    fun save(participant: ParticipantEntity): Either<DatabaseError, ParticipantEntity>

    fun delete(teamId: Long, userId: UUID): Either<DatabaseError, Unit>

    fun findAllByTeamIdAndRoleName(teamId: Long, roleName: String): Either<DatabaseError, List<ParticipantEntity>>
}