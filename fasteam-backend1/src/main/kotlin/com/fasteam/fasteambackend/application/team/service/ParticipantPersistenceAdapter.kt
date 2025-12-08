package com.fasteam.fasteambackend.application.team.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.common.safeEitherWrap
import com.fasteam.fasteambackend.application.team.dao.*
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class ParticipantPersistenceAdapter(
    private val repository: ParticipantRepository,
) : ParticipantGateway {

    override fun findAllByTeamId(teamId: Long): Either<DatabaseError, List<ParticipantEntity>> = safeEitherWrap {
        repository.findAllByTeamId(teamId)
    }

    override fun findAllByUserId(userId: UUID): Either<DatabaseError, List<ParticipantEntity>> = safeEitherWrap {
        repository.findAllByUserId(userId)
    }

    override fun findByTeamIdAndUserId(teamId: Long, userId: UUID): Either<DatabaseError, ParticipantEntity?> = safeEitherWrap {
        repository.findByTeamIdAndUserId(teamId, userId)
    }

    override fun existsByTeamIdAndUserId(teamId: Long, userId: UUID): Either<DatabaseError, Boolean> = safeEitherWrap {
        repository.existsByTeamIdAndUserId(teamId, userId)
    }

    override fun save(participant: ParticipantEntity): Either<DatabaseError, ParticipantEntity> = safeEitherWrap {
        repository.save(participant)
    }

    override fun delete(teamId: Long, userId: UUID): Either<DatabaseError, Unit> = safeEitherWrap {
        repository.deleteByTeamIdAndUserId(teamId, userId)
    }

    override fun findAllByTeamIdAndRoleName(teamId: Long, roleName: String): Either<DatabaseError, List<ParticipantEntity>> = safeEitherWrap {
        repository.findAllByTeamIdAndRoleName(teamId, roleName)
    }
}