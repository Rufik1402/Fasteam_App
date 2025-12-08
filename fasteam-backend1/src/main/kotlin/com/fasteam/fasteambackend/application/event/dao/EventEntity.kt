package com.fasteam.fasteambackend.application.event.dao

import com.fasteam.fasteambackend.application.user.dao.UserEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.OffsetDateTime

@Entity
@Table(name = "event")
class EventEntity(
    @Id
    @GeneratedValue(GenerationType.IDENTITY)
    var id: Long,
    var name: String,
    var description: String?,
    var startTime: OffsetDateTime,
    var endTime: OffsetDateTime,
    @ManyToOne
    val owner: UserEntity,
    @Column(updatable = false, nullable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    var isDeleted: Boolean = false
)