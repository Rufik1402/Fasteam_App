package com.fasteam.fasteambackend.application.common

import arrow.core.Either
import arrow.core.Either.Companion.catch

fun <T> safeEitherWrap(action: () -> T): Either<DomainError.DatabaseError, T> = catch(action).mapLeft {
    DomainError.DatabaseError(
        it
    )
}
