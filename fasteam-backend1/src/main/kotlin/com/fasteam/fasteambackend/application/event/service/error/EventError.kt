package com.fasteam.fasteambackend.application.event.service.error

import com.fasteam.fasteambackend.application.common.DomainError
import java.time.OffsetDateTime
import java.util.UUID

sealed class EventError {

    data class EventNotFound(val eventId: Long) : EventError()

    data class OwnerNotFound(val ownerId: UUID) : EventError()

    data class InvalidTimeRange(val startTime: OffsetDateTime, val endTime: OffsetDateTime) : EventError()

    data class UnauthorizedAccess(val eventId: Long, val userId: UUID) : EventError()

    data class EventNameEmpty(val name: String) : EventError()
}

typealias EventFailure = DomainError<EventError>