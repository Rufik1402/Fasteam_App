package com.fasteam.fasteambackend.application.event.dao

import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface EventRepository : JpaRepository<EventEntity, Long> {

    fun findByIdAndIsDeletedFalse(id: Long): EventEntity?

    fun findAllByIsDeletedFalse(): List<EventEntity>

    fun findAllByOwnerIdAndIsDeletedFalse(ownerId: UUID): List<EventEntity>

    fun existsByIdAndIsDeletedFalse(id: Long): Boolean
}