package com.fasteam.fasteambackend.application.event.service.dto

import java.time.OffsetDateTime
import java.util.UUID

data class CreateEventCommand(
    val name: String,
    val description: String?,
    val startTime: OffsetDateTime,
    val endTime: OffsetDateTime,
    val ownerId: UUID
)