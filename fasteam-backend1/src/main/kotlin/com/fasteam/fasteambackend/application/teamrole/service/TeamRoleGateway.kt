package com.fasteam.fasteambackend.application.teamrole.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.teamrole.dao.TeamRoleEntity


interface TeamRoleGateway {

    fun findById(id: Int): Either<DatabaseError, TeamRoleEntity?>

    fun findByName(name: String): Either<DatabaseError, TeamRoleEntity?>

    fun findAll(): Either<DatabaseError, List<TeamRoleEntity>>

    fun existsByName(name: String): Either<DatabaseError, Boolean>

    fun save(teamRole: TeamRoleEntity): Either<DatabaseError, TeamRoleEntity>
}