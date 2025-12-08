import { api } from "./api";
import type { EventResponse } from "./types";

export const eventsApi = {
  async getEvents() {
    const res = await api.get<EventResponse[]>("/events");
    return res.data;
  },
  async getEvent(id: number | string) {
    const res = await api.get<EventResponse>(`/events/${id}`);
    return res.data;
  },
};

