package com.fasteam.fasteambackend.application.event.api.model

import com.fasteam.fasteambackend.application.event.service.dto.CreateEventCommand
import java.time.OffsetDateTime
import java.util.UUID

data class CreateEventRequest(
    val name: String,
    val description: String?,
    val startTime: OffsetDateTime,
    val endTime: OffsetDateTime
) {
    fun toCommand(ownerId: UUID): CreateEventCommand = CreateEventCommand(
        name = name,
        description = description,
        startTime = startTime,
        endTime = endTime,
        ownerId = ownerId
    )
}