package com.fasteam.fasteambackend.application.event.api.model

import com.fasteam.fasteambackend.application.event.service.dto.UpdateEventCommand
import java.time.OffsetDateTime

data class UpdateEventRequest(
    val name: String?,
    val description: String?,
    val startTime: OffsetDateTime?,
    val endTime: OffsetDateTime?
) {
    fun toCommand(id: Long): UpdateEventCommand = UpdateEventCommand(
        id = id,
        name = name,
        description = description,
        startTime = startTime,
        endTime = endTime
    )
}