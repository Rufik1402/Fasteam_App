package com.fasteam.fasteambackend.application.event.api

import com.fasteam.fasteambackend.application.event.api.model.CreateEventRequest
import com.fasteam.fasteambackend.application.event.api.model.UpdateEventRequest
import com.fasteam.fasteambackend.application.event.service.EventService
import com.fasteam.fasteambackend.application.event.service.dto.DeleteEventCommand
import com.fasteam.fasteambackend.application.user.dao.UserEntity
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/events")
class EventController(
    private val eventService: EventService
) {

    @PostMapping
    @PreAuthorize("hasAuthority('EVENT_WRITE')")
    fun createEvent(
        @RequestBody request: CreateEventRequest,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return eventService.createEvent(request.toCommand(user.id!!)).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { event ->
                ResponseEntity.status(HttpStatus.CREATED).body(event)
            }
        )
    }

    @PutMapping("/{id}")
    fun updateEvent(
        @PathVariable id: Long,
        @RequestBody request: UpdateEventRequest,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return eventService.updateEvent(request.toCommand(id)).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { event ->
                ResponseEntity.ok(event)
            }
        )
    }

    @DeleteMapping("/{id}")
    fun deleteEvent(
        @PathVariable id: Long,
        @AuthenticationPrincipal user: UserEntity
    ): ResponseEntity<out Any> {
        return eventService.deleteEvent(DeleteEventCommand(id)).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            {
                ResponseEntity.noContent().build()
            }
        )
    }

    @GetMapping("/{id}")
    fun getEventById(@PathVariable id: Long): ResponseEntity<out Any> {
        return eventService.getEventById(id).fold(
            { error ->
                ResponseEntity.status(HttpStatus.NOT_FOUND).body(error)
            },
            { event ->
                ResponseEntity.ok(event)
            }
        )
    }

    @GetMapping
    fun getAllEvents(): ResponseEntity<out Any> {
        return eventService.getAllEvents().fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { events ->
                ResponseEntity.ok(events)
            }
        )
    }

    @GetMapping("/my")
    fun getMyEvents(@AuthenticationPrincipal user: UserEntity): ResponseEntity<out Any> {
        return eventService.getEventsByOwner(user.id!!).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { events ->
                ResponseEntity.ok(events)
            }
        )
    }

    @GetMapping("/user/{ownerId}")
    fun getEventsByOwner(@PathVariable ownerId: UUID): ResponseEntity<out Any> {
        return eventService.getEventsByOwner(ownerId).fold(
            { error ->
                ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error)
            },
            { events ->
                ResponseEntity.ok(events)
            }
        )
    }
}