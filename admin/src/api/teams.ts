import api from './api'
import type {
    AddParticipantRequest,
    CreateTeamRequest,
    ParticipantResponse,
    TeamResponse,
    TeamRoleResponse,
    TeamWithParticipantsResponse,
    UpdateParticipantRoleRequest,
    UpdateTeamRequest
} from './types'

export const teamsApi = {
    getTeams() {
        return api.get<TeamResponse[]>('/teams').then((res) => res.data)
    },
    getTeam(id: number | string) {
        return api.get<TeamResponse>(`/teams/${id}`).then((res) => res.data)
    },
    getTeamWithParticipants(id: number | string) {
        return api
            .get<TeamWithParticipantsResponse>(`/teams/${id}/with-participants`)
            .then((res) => res.data)
    },
    getTeamsByEvent(eventId: number | string) {
        return api.get<TeamResponse[]>(`/teams/event/${eventId}`).then((res) => res.data)
    },
    getTeamsByUser(userId: string) {
        return api.get<TeamResponse[]>(`/teams/user/${userId}`).then((res) => res.data)
    },
    createTeam(payload: CreateTeamRequest) {
        return api.post<TeamResponse>('/teams', payload).then((res) => res.data)
    },
    updateTeam(id: number | string, payload: UpdateTeamRequest) {
        return api.put<TeamResponse>(`/teams/${id}`, payload).then((res) => res.data)
    },
    deleteTeam(id: number | string) {
        return api.delete<void>(`/teams/${id}`).then((res) => res.data)
    },
    // Participants
    addParticipant(teamId: number | string, payload: AddParticipantRequest) {
        return api
            .post<ParticipantResponse>(`/teams/${teamId}/participants`, payload)
            .then((res) => res.data)
    },
    removeParticipant(teamId: number | string, userId: string) {
        return api
            .delete<void>(`/teams/${teamId}/participants/${userId}`)
            .then((res) => res.data)
    },
    updateParticipantRole(
        teamId: number | string,
        userId: string,
        payload: UpdateParticipantRoleRequest
    ) {
        return api
            .put<ParticipantResponse>(`/teams/${teamId}/participants/${userId}/role`, payload)
            .then((res) => res.data)
    },
    getParticipants(teamId: number | string) {
        return api
            .get<ParticipantResponse[]>(`/teams/${teamId}/participants`)
            .then((res) => res.data)
    },
    // Team roles
    getRoles() {
        return api.get<TeamRoleResponse[]>('/teams/roles').then((res) => res.data)
    }
}

