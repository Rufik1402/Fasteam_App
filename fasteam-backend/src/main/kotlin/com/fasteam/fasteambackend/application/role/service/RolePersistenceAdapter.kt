package com.fasteam.fasteambackend.application.role.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError
import com.fasteam.fasteambackend.application.common.safeEitherWrap
import com.fasteam.fasteambackend.application.role.dao.RoleEntity
import com.fasteam.fasteambackend.application.role.dao.RoleRepository
import org.springframework.stereotype.Component

@Component
class RolePersistenceAdapter(
    private val roleRepository: RoleRepository
): RoleGateway {

    override fun getRolesByNames(names: List<String>): Either<DomainError.DatabaseError, List<RoleEntity>> =
        safeEitherWrap { roleRepository.getRolesByNameIn(names) }
}