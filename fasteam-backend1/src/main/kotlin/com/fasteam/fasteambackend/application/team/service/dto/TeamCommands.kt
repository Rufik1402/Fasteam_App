package com.fasteam.fasteambackend.application.team.service.dto

data class CreateTeamCommand(
    val name: String,
    val eventId: Long
)

data class UpdateTeamCommand(
    val id: Long,
    val name: String?
)

data class DeleteTeamCommand(
    val id: Long
)