package com.fasteam.fasteambackend.application.team.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError
import com.fasteam.fasteambackend.application.common.safeEitherWrap
import com.fasteam.fasteambackend.application.team.dao.TeamEntity
import com.fasteam.fasteambackend.application.team.dao.TeamRepository
import org.springframework.stereotype.Component

@Component
class TeamPersistenceAdapter(
    private val repository: TeamRepository,
) : TeamGateway {

    override fun findById(id: Long): Either<DomainError.DatabaseError, TeamEntity?> = safeEitherWrap {
        repository.findByIdAndIsDeletedFalse(id)
    }

    override fun findAll(): Either<DomainError.DatabaseError, List<TeamEntity>> = safeEitherWrap {
        repository.findAllByIsDeletedFalse()
    }

    override fun findAllByEventId(eventId: Long): Either<DomainError.DatabaseError, List<TeamEntity>> = safeEitherWrap {
        repository.findAllByEventIdAndIsDeletedFalse(eventId)
    }

    override fun existsById(id: Long): Either<DomainError.DatabaseError, Boolean> = safeEitherWrap {
        repository.existsByIdAndIsDeletedFalse(id)
    }

    override fun save(team: TeamEntity): Either<DomainError.DatabaseError, TeamEntity> = safeEitherWrap {
        repository.save(team)
    }

    override fun delete(team: TeamEntity): Either<DomainError.DatabaseError, Unit> = safeEitherWrap {
        team.isDeleted = true
        repository.save(team)
    }
}