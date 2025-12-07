package com.fasteam.fasteambackend.application.common

sealed class DomainError<out T> {

    data class UseCaseError<T>(val cause: T) : DomainError<T>()

    data class DatabaseError(val throwable: Throwable) : DomainError<Nothing>()
}

fun <T> errorOf(cause: T) = DomainError.UseCaseError(cause)
