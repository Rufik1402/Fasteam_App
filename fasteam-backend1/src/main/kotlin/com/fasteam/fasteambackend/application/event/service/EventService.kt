package com.fasteam.fasteambackend.application.event.service

import arrow.core.Either
import arrow.core.raise.either
import arrow.core.raise.ensure
import com.fasteam.fasteambackend.application.common.errorOf
import com.fasteam.fasteambackend.application.event.dao.EventEntity
import com.fasteam.fasteambackend.application.event.service.dto.CreateEventCommand
import com.fasteam.fasteambackend.application.event.service.dto.DeleteEventCommand
import com.fasteam.fasteambackend.application.event.service.dto.EventResponse
import com.fasteam.fasteambackend.application.event.service.dto.UpdateEventCommand
import com.fasteam.fasteambackend.application.event.service.error.EventError
import com.fasteam.fasteambackend.application.event.service.error.EventFailure
import com.fasteam.fasteambackend.application.user.service.UserGateway
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class EventService(
    private val eventGateway: EventGateway,
    private val userGateway: UserGateway
) {

    @Transactional
    fun createEvent(command: CreateEventCommand): Either<EventFailure, EventResponse> = either {
        with(command) {
            ensure(name.isNotBlank()) { errorOf(EventError.EventNameEmpty(name)) }
            ensure(startTime.isBefore(endTime)) { errorOf(EventError.InvalidTimeRange(startTime, endTime)) }

            val owner = userGateway.findByUUID(ownerId).bind()
            ensure(owner != null) { errorOf(EventError.OwnerNotFound(ownerId)) }

            val event = EventEntity(
                id = 0L,
                name = name,
                description = description,
                startTime = startTime,
                endTime = endTime,
                owner = owner
            )

            val savedEvent = eventGateway.save(event).bind()
            savedEvent.toResponse()
        }
    }

    @Transactional
    fun updateEvent(command: UpdateEventCommand): Either<EventFailure, EventResponse> = either {
        with(command) {
            val event = eventGateway.findById(id).bind()
            ensure(event != null) { errorOf(EventError.EventNotFound(id)) }

            name?.let {
                ensure(it.isNotBlank()) { errorOf(EventError.EventNameEmpty(it)) }
                event.name = it
            }
            description?.let { event.description = it }
            startTime?.let { event.startTime = it }
            endTime?.let { event.endTime = it }

            ensure(event.startTime.isBefore(event.endTime)) {
                errorOf(EventError.InvalidTimeRange(event.startTime, event.endTime))
            }

            val updatedEvent = eventGateway.save(event).bind()
            updatedEvent.toResponse()
        }
    }

    @Transactional
    fun deleteEvent(command: DeleteEventCommand): Either<EventFailure, Unit> = either {
        val event = eventGateway.findById(command.id).bind()
        ensure(event != null) { errorOf(EventError.EventNotFound(command.id)) }

        eventGateway.delete(event).bind()
    }

    fun getEventById(id: Long): Either<EventFailure, EventResponse> = either {
        val event = eventGateway.findById(id).bind()
        ensure(event != null) { errorOf(EventError.EventNotFound(id)) }

        event.toResponse()
    }

    fun getAllEvents(): Either<EventFailure, List<EventResponse>> = either {
        val events = eventGateway.findAll().bind()
        events.map { it.toResponse() }
    }

    fun getEventsByOwner(ownerId: UUID): Either<EventFailure, List<EventResponse>> = either {
        val events = eventGateway.findAllByOwnerId(ownerId).bind()
        events.map { it.toResponse() }
    }

    private fun EventEntity.toResponse() = EventResponse(
        id = id,
        name = name,
        description = description,
        startTime = startTime,
        endTime = endTime,
        ownerId = owner.id!!,
        ownerUsername = owner.username,
        createdAt = createdAt,
        isDeleted = isDeleted
    )
}