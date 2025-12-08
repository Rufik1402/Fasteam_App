package com.fasteam.fasteambackend.application.event.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError.DatabaseError
import com.fasteam.fasteambackend.application.common.safeEitherWrap
import com.fasteam.fasteambackend.application.event.dao.EventEntity
import com.fasteam.fasteambackend.application.event.dao.EventRepository
import org.springframework.stereotype.Component
import java.util.UUID

@Component
class EventPersistenceAdapter(
    private val repository: EventRepository,
) : EventGateway {

    override fun findById(id: Long): Either<DatabaseError, EventEntity?> = safeEitherWrap {
        repository.findByIdAndIsDeletedFalse(id)
    }

    override fun findAll(): Either<DatabaseError, List<EventEntity>> = safeEitherWrap {
        repository.findAllByIsDeletedFalse()
    }

    override fun findAllByOwnerId(ownerId: UUID): Either<DatabaseError, List<EventEntity>> = safeEitherWrap {
        repository.findAllByOwnerIdAndIsDeletedFalse(ownerId)
    }

    override fun existsById(id: Long): Either<DatabaseError, Boolean> = safeEitherWrap {
        repository.existsByIdAndIsDeletedFalse(id)
    }

    override fun save(event: EventEntity): Either<DatabaseError, EventEntity> = safeEitherWrap {
        repository.save(event)
    }

    override fun delete(event: EventEntity): Either<DatabaseError, Unit> = safeEitherWrap {
        event.isDeleted = true
        repository.save(event)
    }
}