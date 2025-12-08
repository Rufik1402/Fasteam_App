package com.fasteam.fasteambackend.application.teamrole.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.common.safeEitherWrap
import com.fasteam.fasteambackend.application.teamrole.dao.TeamRoleEntity
import com.fasteam.fasteambackend.application.teamrole.dao.TeamRoleRepository
import org.springframework.stereotype.Component

@Component
class TeamRolePersistenceAdapter(
    private val repository: TeamRoleRepository,
) : TeamRoleGateway {

    override fun findById(id: Int): Either<DatabaseError, TeamRoleEntity?> = safeEitherWrap {
        repository.findById(id).orElse(null)
    }

    override fun findByName(name: String): Either<DatabaseError, TeamRoleEntity?> = safeEitherWrap {
        repository.findByName(name)
    }

    override fun findAll(): Either<DatabaseError, List<TeamRoleEntity>> = safeEitherWrap {
        repository.findAll()
    }

    override fun existsByName(name: String): Either<DatabaseError, Boolean> = safeEitherWrap {
        repository.existsByName(name)
    }

    override fun save(teamRole: TeamRoleEntity): Either<DatabaseError, TeamRoleEntity> = safeEitherWrap {
        repository.save(teamRole)
    }
}