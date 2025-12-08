export interface JwtResponse {
    token: string
}

export interface LoginRequest {
    username: string
    password: string
}

// Event (hackathon) models
export interface EventResponse {
    id: number
    name: string
    description?: string
    startTime: string
    endTime: string
    ownerId: string
    ownerUsername: string
    createdAt: string
    isDeleted: boolean
}

export interface CreateEventRequest {
    name: string
    description?: string
    startTime: string
    endTime: string
}

export interface UpdateEventRequest {
    name?: string
    description?: string
    startTime?: string
    endTime?: string
}

// Team models
export interface TeamResponse {
    id: number
    name: string
    eventId: number
    eventName: string
    createdAt: string
    isDeleted: boolean
    participantCount: number
}

export interface CreateTeamRequest {
    name: string
    eventId: number
}

export interface UpdateTeamRequest {
    name?: string
}

export interface ParticipantResponse {
    teamId: number
    teamName: string
    userId: string
    username: string
    firstName: string
    lastName: string
    teamRoleName: string
    teamRoleDescription?: string
    joinedAt: string
}

export interface TeamWithParticipantsResponse {
    team: TeamResponse
    participants: ParticipantResponse[]
}

export interface AddParticipantRequest {
    userId: string
    teamRoleName: string
}

export interface UpdateParticipantRoleRequest {
    newTeamRoleName: string
}

export interface TeamRoleResponse {
    id: number
    name: string
    description?: string
}

