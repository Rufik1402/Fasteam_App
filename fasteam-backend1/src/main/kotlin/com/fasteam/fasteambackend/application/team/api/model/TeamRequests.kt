package com.fasteam.fasteambackend.application.team.api.model

import com.fasteam.fasteambackend.application.team.service.dto.*
import java.util.UUID

data class CreateTeamRequest(
    val name: String,
    val eventId: Long
) {
    fun toCommand(): CreateTeamCommand = CreateTeamCommand(
        name = name,
        eventId = eventId
    )
}

data class UpdateTeamRequest(
    val name: String?
) {
    fun toCommand(id: Long): UpdateTeamCommand = UpdateTeamCommand(
        id = id,
        name = name
    )
}

data class AddParticipantRequest(
    val userId: UUID,
    val teamRoleName: String
) {
    fun toCommand(teamId: Long): AddParticipantCommand = AddParticipantCommand(
        teamId = teamId,
        userId = userId,
        teamRoleName = teamRoleName
    )
}

data class UpdateParticipantRoleRequest(
    val newTeamRoleName: String
) {
    fun toCommand(teamId: Long, userId: UUID): UpdateParticipantRoleCommand = UpdateParticipantRoleCommand(
        teamId = teamId,
        userId = userId,
        newTeamRoleName = newTeamRoleName
    )
}