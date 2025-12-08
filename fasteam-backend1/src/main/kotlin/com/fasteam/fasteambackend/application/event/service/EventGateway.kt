package com.fasteam.fasteambackend.application.event.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.event.dao.EventEntity
import java.util.UUID

interface EventGateway {

    fun findById(id: Long): Either<DatabaseError, EventEntity?>

    fun findAll(): Either<DatabaseError, List<EventEntity>>

    fun findAllByOwnerId(ownerId: UUID): Either<DatabaseError, List<EventEntity>>

    fun existsById(id: Long): Either<DatabaseError, Boolean>

    fun save(event: EventEntity): Either<DatabaseError, EventEntity>

    fun delete(event: EventEntity): Either<DatabaseError, Unit>
}