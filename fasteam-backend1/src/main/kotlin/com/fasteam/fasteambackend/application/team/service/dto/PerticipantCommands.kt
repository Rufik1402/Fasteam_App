package com.fasteam.fasteambackend.application.team.service.dto

import java.util.UUID

data class AddParticipantCommand(
    val teamId: Long,
    val userId: UUID,
    val teamRoleName: String
)

data class RemoveParticipantCommand(
    val teamId: Long,
    val userId: UUID
)

data class UpdateParticipantRoleCommand(
    val teamId: Long,
    val userId: UUID,
    val newTeamRoleName: String
)