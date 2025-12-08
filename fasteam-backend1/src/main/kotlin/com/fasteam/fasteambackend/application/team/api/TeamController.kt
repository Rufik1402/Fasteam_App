package com.fasteam.fasteambackend.application.team.api

import com.fasteam.fasteambackend.application.team.api.model.*
import com.fasteam.fasteambackend.application.team.service.TeamService
import com.fasteam.fasteambackend.application.team.service.dto.DeleteTeamCommand
import com.fasteam.fasteambackend.application.team.service.dto.RemoveParticipantCommand
import com.fasteam.fasteambackend.application.user.dao.UserEntity
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/teams")
class TeamController(
    private val teamService: TeamService
) {

    @PostMapping
    @PreAuthorize("hasAuthority('TEAM_CREATE')")
    fun createTeam(
        @RequestBody request: CreateTeamRequest,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return teamService.createTeam(request.toCommand()).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { team ->
                ResponseEntity.status(HttpStatus.CREATED).body(team)
            }
        )
    }

    @PutMapping("/{id}")
    fun updateTeam(
        @PathVariable id: Long,
        @RequestBody request: UpdateTeamRequest,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return teamService.updateTeam(request.toCommand(id)).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { team ->
                ResponseEntity.ok(team)
            }
        )
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('TEAM_DELETE')")
    fun deleteTeam(
        @PathVariable id: Long,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return teamService.deleteTeam(DeleteTeamCommand(id)).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            {
                ResponseEntity.noContent().build()
            }
        )
    }

    @GetMapping("/{id}")
    fun getTeamById(@PathVariable id: Long): ResponseEntity<out Any> {
        return teamService.getTeamById(id).fold(
            { error ->
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(error)
            },
            { team ->
                ResponseEntity.ok(team)
            }
        )
    }

    @GetMapping("/{id}/with-participants")
    fun getTeamWithParticipants(@PathVariable id: Long): ResponseEntity<out Any> {
        return teamService.getTeamWithParticipants(id).fold(
            { error ->
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(error)
            },
            { response ->
                ResponseEntity.ok(response)
            }
        )
    }

    @GetMapping
    fun getAllTeams(): ResponseEntity<out Any> {
        return teamService.getAllTeams().fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { teams ->
                ResponseEntity.ok(teams)
            }
        )
    }

    @GetMapping("/event/{eventId}")
    fun getTeamsByEvent(@PathVariable eventId: Long): ResponseEntity<out Any> {
        return teamService.getTeamsByEvent(eventId).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { teams ->
                ResponseEntity.ok(teams)
            }
        )
    }

    @GetMapping("/my")
    fun getMyTeams(@AuthenticationPrincipal user: UserEntity): ResponseEntity<out Any> {
        return teamService.getTeamsByUser(user.id!!).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { teams ->
                ResponseEntity.ok(teams)
            }
        )
    }

    @GetMapping("/user/{userId}")
    fun getTeamsByUser(@PathVariable userId: UUID): ResponseEntity<out Any> {
        return teamService.getTeamsByUser(userId).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { teams ->
                ResponseEntity.ok(teams)
            }
        )
    }

    // Participant endpoints
    @PostMapping("/{teamId}/participants")
    @PreAuthorize("hasAuthority('TEAM_MANAGE_PARTICIPANTS')")
    fun addParticipant(
        @PathVariable teamId: Long,
        @RequestBody request: AddParticipantRequest,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return teamService.addParticipant(request.toCommand(teamId)).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { participant ->
                ResponseEntity.status(HttpStatus.CREATED).body(participant)
            }
        )
    }

    @DeleteMapping("/{teamId}/participants/{userId}")
    @PreAuthorize("hasAuthority('TEAM_MANAGE_PARTICIPANTS')")
    fun removeParticipant(
        @PathVariable teamId: Long,
        @PathVariable userId: UUID,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return teamService.removeParticipant(RemoveParticipantCommand(teamId, userId)).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            {
                ResponseEntity.noContent().build()
            }
        )
    }

    @PutMapping("/{teamId}/participants/{userId}/role")
    @PreAuthorize("hasAuthority('TEAM_MANAGE_PARTICIPANTS')")
    fun updateParticipantRole(
        @PathVariable teamId: Long,
        @PathVariable userId: UUID,
        @RequestBody request: UpdateParticipantRoleRequest,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return teamService.updateParticipantRole(request.toCommand(teamId, userId)).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { participant ->
                ResponseEntity.ok(participant)
            }
        )
    }

    @GetMapping("/{teamId}/participants")
    fun getParticipantsByTeam(@PathVariable teamId: Long): ResponseEntity<out Any> {
        return teamService.getParticipantsByTeam(teamId).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { participants ->
                ResponseEntity.ok(participants)
            }
        )
    }

    // Team roles
    @GetMapping("/roles")
    fun getAllTeamRoles(): ResponseEntity<out Any> {
        return teamService.getAllTeamRoles().fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { roles ->
                ResponseEntity.ok(roles)
            }
        )
    }
}