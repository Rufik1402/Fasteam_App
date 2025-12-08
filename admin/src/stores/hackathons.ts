
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { eventsApi } from '../api'
import type { EventResponse } from '../api'

export type HackathonStatus = 'upcoming' | 'active' | 'finished' | 'draft'

export interface Hackathon {
    id: string
    name: string
    description?: string
    image?: string
    status: HackathonStatus
    startDate: string
    endDate: string
    participants: number
    teams: number
    tracks: string[]
    maxTeamSize?: number
    location?: 'online' | 'offline' | 'hybrid'
    address?: string
    prize?: string
    ownerId?: string
    ownerUsername?: string
    createdAt?: string
    isDeleted?: boolean
}

const deriveStatus = (startDate: string, endDate: string): HackathonStatus => {
    const now = Date.now()
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()

    if (Number.isNaN(start) || Number.isNaN(end)) return 'draft'
    if (start > now) return 'upcoming'
    if (end < now) return 'finished'
    return 'active'
}

const mapEventToHackathon = (event: EventResponse): Hackathon => ({
    id: String(event.id),
    name: event.name,
    description: event.description ?? '',
    startDate: event.startTime,
    endDate: event.endTime,
    status: deriveStatus(event.startTime, event.endTime),
    participants: 0,
    teams: 0,
    tracks: [],
    location: 'online',
    prize: '',
    ownerId: event.ownerId,
    ownerUsername: event.ownerUsername,
    createdAt: event.createdAt,
    isDeleted: event.isDeleted
})

export const useHackathonsStore = defineStore('hackathons', () => {
    const hackathons = ref<Hackathon[]>([])
    const loading = ref(false)

    const fetchHackathons = async () => {
        loading.value = true
        try {
            const events = await eventsApi.getEvents()
            hackathons.value = events.map(mapEventToHackathon)
        } finally {
            loading.value = false
        }
    }

    const fetchHackathon = async (id: string) => {
        const existing = hackathons.value.find((h) => h.id === id)
        if (existing) return existing

        const event = await eventsApi.getEvent(id)
        const mapped = mapEventToHackathon(event)
        hackathons.value = [mapped, ...hackathons.value]
        return mapped
    }

    const addHackathon = async (hackathon: {
        name: string
        description?: string
        startDate: string
        endDate: string
    }) => {
        const created = await eventsApi.createEvent({
            name: hackathon.name,
            description: hackathon.description,
            startTime: hackathon.startDate,
            endTime: hackathon.endDate
        })
        const mapped = mapEventToHackathon(created)
        hackathons.value.unshift(mapped)
        return mapped
    }

    const updateHackathon = async (id: string, updates: Partial<Hackathon>) => {
        const updated = await eventsApi.updateEvent(id, {
            name: updates.name,
            description: updates.description,
            startTime: updates.startDate,
            endTime: updates.endDate
        })

        const mapped = mapEventToHackathon(updated)
        const index = hackathons.value.findIndex((h) => h.id === id)
        if (index !== -1) {
            hackathons.value[index] = mapped
        } else {
            hackathons.value.push(mapped)
        }
        return mapped
    }

    const deleteHackathon = async (id: string) => {
        await eventsApi.deleteEvent(id)
        hackathons.value = hackathons.value.filter((h) => h.id !== id)
    }

    const getHackathon = (id: string) => hackathons.value.find((h) => h.id === id)

    return {
        hackathons,
        loading,
        fetchHackathons,
        fetchHackathon,
        addHackathon,
        updateHackathon,
        deleteHackathon,
        getHackathon
    }
})