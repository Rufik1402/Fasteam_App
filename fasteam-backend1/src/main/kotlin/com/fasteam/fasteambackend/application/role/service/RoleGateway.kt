package com.fasteam.fasteambackend.application.role.service

import arrow.core.Either
import com.fasteam.fasteambackend.application.common.DomainError
import com.fasteam.fasteambackend.application.role.dao.RoleEntity


interface RoleGateway {

    fun getRolesByNames(names: List<String>): Either<DomainError.DatabaseError, List<RoleEntity>>
}