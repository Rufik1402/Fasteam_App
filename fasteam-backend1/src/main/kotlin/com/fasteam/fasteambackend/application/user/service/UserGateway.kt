package com.fasteam.fasteambackend.application.user.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.user.dao.UserEntity
import java.util.UUID

interface UserGateway {

    fun findByUsername(username: String): Either<DatabaseError, UserEntity?>

    fun findByUUID(uuid: UUID): Either<DatabaseError, UserEntity?>

    fun existsByUsername(username: String): Either<DatabaseError,Boolean>

    fun save(user: UserEntity): Either<DatabaseError, Unit>
}