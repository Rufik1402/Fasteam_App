package com.fasteam.fasteambackend.application.event.service.dto

import java.time.OffsetDateTime

data class UpdateEventCommand(
    val id: Long,
    val name: String?,
    val description: String?,
    val startTime: OffsetDateTime?,
    val endTime: OffsetDateTime?
)