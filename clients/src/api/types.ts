export interface EventResponse {
  id: number;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  ownerId: string;
  ownerUsername: string;
  createdAt: string;
  isDeleted: boolean;
}

