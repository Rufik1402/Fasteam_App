package com.fasteam.fasteambackend.application.team.service.dto

import java.time.OffsetDateTime
import java.util.UUID

data class TeamResponse(
    val id: Long?,
    val name: String,
    val eventId: Long,
    val eventName: String,
    val createdAt: OffsetDateTime,
    val isDeleted: Boolean,
    val participantCount: Int = 0
)

data class ParticipantResponse(
    val teamId: Long?,
    val teamName: String,
    val userId: UUID,
    val username: String,
    val firstName: String,
    val lastName: String,
    val teamRoleName: String,
    val teamRoleDescription: String?,
    val joinedAt: OffsetDateTime
)

data class TeamWithParticipantsResponse(
    val team: TeamResponse,
    val participants: List<ParticipantResponse>
)