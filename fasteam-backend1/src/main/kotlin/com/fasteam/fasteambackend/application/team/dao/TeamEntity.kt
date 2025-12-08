package com.fasteam.fasteambackend.application.team.dao

import com.fasteam.fasteambackend.application.event.dao.EventEntity
import com.fasteam.fasteambackend.application.user.dao.UserEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.OffsetDateTime

@Entity
@Table(name = "team")
class TeamEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    var name: String,
    @ManyToOne
    val event: EventEntity,
    @Column(updatable = false, nullable = false)
    val createdAt: OffsetDateTime = OffsetDateTime.now(),
    var isDeleted: Boolean = false
)