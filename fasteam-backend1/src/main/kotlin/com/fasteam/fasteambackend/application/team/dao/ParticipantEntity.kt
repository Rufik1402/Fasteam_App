package com.fasteam.fasteambackend.application.team.dao

import com.fasteam.fasteambackend.application.teamrole.dao.TeamRoleEntity
import com.fasteam.fasteambackend.application.user.dao.UserEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.IdClass
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.OffsetDateTime

@Entity
@Table(name = "participants")
@IdClass(ParticipantId::class)
class ParticipantEntity(
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    val team: TeamEntity,

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    val user: UserEntity,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "team_role_id", nullable = false)
    var teamRole: TeamRoleEntity,

    @Column(nullable = false, updatable = false)
    val joinedAt: OffsetDateTime = OffsetDateTime.now()
) {
}

data class  ParticipantId(
    val team: Long = 0L,
    val user: java.util.UUID = java.util.UUID.randomUUID()
) : java.io.Serializable