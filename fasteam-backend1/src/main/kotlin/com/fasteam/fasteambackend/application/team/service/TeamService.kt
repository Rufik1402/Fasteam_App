package com.fasteam.fasteambackend.application.team.service

import arrow.core.Either
import arrow.core.raise.either
import arrow.core.raise.ensure
import com.fasteam.fasteambackend.application.common.errorOf
import com.fasteam.fasteambackend.application.event.service.EventGateway
import com.fasteam.fasteambackend.application.team.dao.ParticipantEntity
import com.fasteam.fasteambackend.application.team.dao.TeamEntity
import com.fasteam.fasteambackend.application.team.service.dto.*
import com.fasteam.fasteambackend.application.team.service.error.TeamError
import com.fasteam.fasteambackend.application.team.service.error.TeamFailure
import com.fasteam.fasteambackend.application.teamrole.service.TeamRoleGateway
import com.fasteam.fasteambackend.application.teamrole.service.dto.TeamRoleResponse
import com.fasteam.fasteambackend.application.user.service.UserGateway
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

@Service
class TeamService(
    private val teamGateway: TeamGateway,
    private val eventGateway: EventGateway,
    private val participantGateway: ParticipantGateway,
    private val teamRoleGateway: TeamRoleGateway,
    private val userGateway: UserGateway
) {

    @Transactional
    fun createTeam(command: CreateTeamCommand): Either<TeamFailure, TeamResponse> = either {
        with(command) {
            ensure(name.isNotBlank()) { errorOf(TeamError.TeamNameEmpty(name)) }

            val event = eventGateway.findById(eventId).bind()
            ensure(event != null) { errorOf(TeamError.EventNotFound(eventId)) }

            val team = TeamEntity(
                name = name,
                event = event
            )

            val savedTeam = teamGateway.save(team).bind()
            savedTeam.toResponse()
        }
    }

    @Transactional
    fun updateTeam(command: UpdateTeamCommand): Either<TeamFailure, TeamResponse> = either {
        with(command) {
            val team = teamGateway.findById(id).bind()
            ensure(team != null) { errorOf(TeamError.TeamNotFound(id)) }

            name?.let {
                ensure(it.isNotBlank()) { errorOf(TeamError.TeamNameEmpty(it)) }
                team.name = it
            }

            val updatedTeam = teamGateway.save(team).bind()
            updatedTeam.toResponse()
        }
    }

    @Transactional
    fun deleteTeam(command: DeleteTeamCommand): Either<TeamFailure, Unit> = either {
        val team = teamGateway.findById(command.id).bind()
        ensure(team != null) { errorOf(TeamError.TeamNotFound(command.id)) }

        teamGateway.delete(team).bind()
    }

    fun getTeamById(id: Long): Either<TeamFailure, TeamResponse> = either {
        val team = teamGateway.findById(id).bind()
        ensure(team != null) { errorOf(TeamError.TeamNotFound(id)) }

        team.toResponse()
    }

    fun getAllTeams(): Either<TeamFailure, List<TeamResponse>> = either {
        val teams = teamGateway.findAll().bind()
        teams.map { it.toResponse() }
    }

    fun getTeamsByEvent(eventId: Long): Either<TeamFailure, List<TeamResponse>> = either {
        val teams = teamGateway.findAllByEventId(eventId).bind()
        teams.map { it.toResponse() }
    }

    fun getTeamWithParticipants(teamId: Long): Either<TeamFailure, TeamWithParticipantsResponse> = either {
        val team = teamGateway.findById(teamId).bind()
        ensure(team != null) { errorOf(TeamError.TeamNotFound(teamId)) }

        val participants = participantGateway.findAllByTeamId(teamId).bind()

        TeamWithParticipantsResponse(
            team = team.toResponse(participants.size),
            participants = participants.map { it.toResponse() }
        )
    }

    @Transactional
    fun addParticipant(command: AddParticipantCommand): Either<TeamFailure, ParticipantResponse> = either {
        with(command) {
            val team = teamGateway.findById(teamId).bind()
            ensure(team != null) { errorOf(TeamError.TeamNotFound(teamId)) }

            val user = userGateway.findByUUID(userId).bind()
            ensure(user != null) { errorOf(TeamError.UserNotFound(userId)) }

            val teamRole = teamRoleGateway.findByName(teamRoleName).bind()
            ensure(teamRole != null) { errorOf(TeamError.TeamRoleNotFound(teamRoleName)) }

            val exists = participantGateway.existsByTeamIdAndUserId(teamId, userId).bind()
            ensure(!exists) { errorOf(TeamError.ParticipantAlreadyExists(teamId, userId)) }

            val participant = ParticipantEntity(
                team = team,
                user = user,
                teamRole = teamRole
            )

            val savedParticipant = participantGateway.save(participant).bind()
            savedParticipant.toResponse()
        }
    }

    @Transactional
    fun removeParticipant(command: RemoveParticipantCommand): Either<TeamFailure, Unit> = either {
        with(command) {
            val exists = participantGateway.existsByTeamIdAndUserId(teamId, userId).bind()
            ensure(exists) { errorOf(TeamError.ParticipantNotFound(teamId, userId)) }

            participantGateway.delete(teamId, userId).bind()
        }
    }

    @Transactional
    fun updateParticipantRole(command: UpdateParticipantRoleCommand): Either<TeamFailure, ParticipantResponse> = either {
        with(command) {
            val participant = participantGateway.findByTeamIdAndUserId(teamId, userId).bind()
            ensure(participant != null) { errorOf(TeamError.ParticipantNotFound(teamId, userId)) }

            val newRole = teamRoleGateway.findByName(newTeamRoleName).bind()
            ensure(newRole != null) { errorOf(TeamError.TeamRoleNotFound(newTeamRoleName)) }

            participant.teamRole = newRole
            val updatedParticipant = participantGateway.save(participant).bind()
            updatedParticipant.toResponse()
        }
    }

    fun getParticipantsByTeam(teamId: Long): Either<TeamFailure, List<ParticipantResponse>> = either {
        val participants = participantGateway.findAllByTeamId(teamId).bind()
        participants.map { it.toResponse() }
    }

    fun getTeamsByUser(userId: UUID): Either<TeamFailure, List<TeamResponse>> = either {
        val participants = participantGateway.findAllByUserId(userId).bind()
        participants.map { it.team.toResponse() }
    }

    fun getAllTeamRoles(): Either<TeamFailure, List<TeamRoleResponse>> = either {
        val roles = teamRoleGateway.findAll().bind()
        roles.map { TeamRoleResponse(it.id, it.name, it.description) }
    }

    private fun TeamEntity.toResponse(participantCount: Int = 0) = TeamResponse(
        id = id,
        name = name,
        eventId = event.id,
        eventName = event.name,
        createdAt = createdAt,
        isDeleted = isDeleted,
        participantCount = participantCount
    )

    private fun ParticipantEntity.toResponse() = ParticipantResponse(
        teamId = team.id,
        teamName = team.name,
        userId = user.id!!,
        username = user.username,
        firstName = user.firstName,
        lastName = user.lastName,
        teamRoleName = teamRole.name,
        teamRoleDescription = teamRole.description,
        joinedAt = joinedAt
    )
}