package com.fasteam.fasteambackend.application.user.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.common.safeEitherWrap
import com.fasteam.fasteambackend.application.user.dao.UserEntity
import com.fasteam.fasteambackend.application.user.dao.UserRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class UserPersistenceAdapter(
    private val repository: UserRepository,
) : UserGateway {

    override fun findByUsername(username: String): Either<DatabaseError, UserEntity?> = safeEitherWrap {
        repository.findByUsername(username)
    }

    override fun findByUUID(uuid: UUID): Either<DatabaseError, UserEntity?> = safeEitherWrap {
        repository.findByIdOrNull(uuid)
    }

    override fun existsByUsername(username: String): Either<DatabaseError, Boolean> = safeEitherWrap {
        repository.existsByUsername(username)
    }

    override fun save(user: UserEntity): Either<DatabaseError, Unit> = safeEitherWrap {
        repository.save(user)
    }
}