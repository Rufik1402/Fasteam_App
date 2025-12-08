package com.fasteam.fasteambackend.application.event.service.dto

import java.time.OffsetDateTime
import java.util.UUID

data class EventResponse(
    val id: Long,
    val name: String,
    val description: String?,
    val startTime: OffsetDateTime,
    val endTime: OffsetDateTime,
    val ownerId: UUID,
    val ownerUsername: String,
    val createdAt: OffsetDateTime,
    val isDeleted: Boolean
)