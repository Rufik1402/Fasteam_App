package com.fasteam.fasteambackend.application.team.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.team.dao.TeamEntity

interface TeamGateway {

    fun findById(id: Long): Either<DatabaseError, TeamEntity?>

    fun findAll(): Either<DatabaseError, List<TeamEntity>>

    fun findAllByEventId(eventId: Long): Either<DatabaseError, List<TeamEntity>>

    fun existsById(id: Long): Either<DatabaseError, Boolean>

    fun save(team: TeamEntity): Either<DatabaseError, TeamEntity>

    fun delete(team: TeamEntity): Either<DatabaseError, Unit>
}