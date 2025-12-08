package com.fasteam.fasteambackend.application.team.service.error

import com.fasteam.fasteambackend.application.common.DomainError
import java.util.UUID

sealed class TeamError {

    data class TeamNotFound(val teamId: Long) : TeamError()

    data class EventNotFound(val eventId: Long) : TeamError()

    data class TeamNameEmpty(val name: String) : TeamError()

    data class UserNotFound(val userId: UUID) : TeamError()

    data class TeamRoleNotFound(val roleName: String) : TeamError()

    data class ParticipantAlreadyExists(val teamId: Long, val userId: UUID) : TeamError()

    data class ParticipantNotFound(val teamId: Long, val userId: UUID) : TeamError()

    data class UnauthorizedTeamAccess(val teamId: Long, val userId: UUID) : TeamError()
}

typealias TeamFailure = DomainError<TeamError>