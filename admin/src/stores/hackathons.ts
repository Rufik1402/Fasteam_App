
import { defineStore } from 'pinia'
import { ref } from 'vue'


export interface Hackathon {
    id: string
    name: string
    description: string
    image?: string
    status: 'upcoming' | 'active' | 'finished' | 'draft'
    startDate: string
    endDate: string
    participants: number
    teams: number
    tracks: string[]
    maxTeamSize?: number
    location: 'online' | 'offline' | 'hybrid'
    address?: string
    prize?: string
}

export const useHackathonsStore = defineStore('hackathons', () => {
    // Список всех хакатонов
    const hackathons = ref<Hackathon[]>([
        {
            id: '1',
            name: 'ITAM AI Hack 2024',
            description: 'Хакатон по искусственному интеллекту и машинному обучению с призовым фондом 500 000 ₽',
            image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400',
            status: 'upcoming',
            startDate: '2024-03-15T10:00:00',
            endDate: '2024-03-17T18:00:00',
            participants: 127,
            teams: 24,
            tracks: ['AI/ML', 'Computer Vision', 'NLP'],
            maxTeamSize: 5,
            location: 'hybrid',
            address: 'Москва, ул. Льва Толстого, 16',
            prize: '500 000 ₽ + стажировки в ITAM'
        },
        {
            id: '2',
            name: 'Web3 Hackathon Online',
            description: 'Онлайн хакатон по блокчейну и Web3 технологиям',
            status: 'active',
            startDate: '2024-02-01T12:00:00',
            endDate: '2024-02-03T20:00:00',
            participants: 89,
            teams: 18,
            tracks: ['Blockchain', 'Smart Contracts', 'DeFi'],
            maxTeamSize: 4,
            location: 'online',
            prize: 'Главный приз: MacBook Pro'
        }

    ])

    // Добавить новый хакатон
    const addHackathon = (hackathon: Omit<Hackathon, 'id' | 'participants' | 'teams'>) => {
        const newHackathon: Hackathon = {
            ...hackathon,
            id: Date.now().toString(), // Генерация ID
            participants: 0,
            teams: 0
        }

        hackathons.value.unshift(newHackathon) // Добавляем в начало
        return newHackathon
    }

    // Обновить хакатон
    const updateHackathon = (id: string, updates: Partial<Hackathon>) => {
        const index = hackathons.value.findIndex(h => h.id === id)
        if (index !== -1) {
            hackathons.value[index] = { ...hackathons.value[index], ...updates }
        }
    }

    // Удалить хакатон
    const deleteHackathon = (id: string) => {
        hackathons.value = hackathons.value.filter(h => h.id !== id)
    }

    // Получить хакатон по ID
    const getHackathon = (id: string) => {
        return hackathons.value.find(h => h.id === id)
    }



    return {
        hackathons,
        addHackathon,
        updateHackathon,
        deleteHackathon,
        getHackathon
    }
})