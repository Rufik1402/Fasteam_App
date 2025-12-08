import api from './api'
import type {
    CreateEventRequest,
    EventResponse,
    UpdateEventRequest
} from './types'

export const eventsApi = {
    getEvents() {
        return api.get<EventResponse[]>('/events').then((res) => res.data)
    },
    getEvent(id: number | string) {
        return api.get<EventResponse>(`/events/${id}`).then((res) => res.data)
    },
    createEvent(payload: CreateEventRequest) {
        return api.post<EventResponse>('/events', payload).then((res) => res.data)
    },
    updateEvent(id: number | string, payload: UpdateEventRequest) {
        return api.put<EventResponse>(`/events/${id}`, payload).then((res) => res.data)
    },
    deleteEvent(id: number | string) {
        return api.delete<void>(`/events/${id}`).then((res) => res.data)
    }
}

