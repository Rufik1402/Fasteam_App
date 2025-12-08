export interface User {
  id: string;
  telegramId: string;
  username: string;
  fullName?: string;
  role?: string;
  customRole?: string;
  wins?: number;
  hackathonsCount?: number;
  bio?: string;
  skills?: string[];
  hasFilledProfile: boolean;
  city?: string;
  experience?: 'новичок' | 'есть опыт' | 'эксперт' | 'профессионал';
  isPopular?: boolean;
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  prize?: string; 
  participants?: number; 
  duration?: string; 
  format?: 'онлайн' | 'офлайн' | 'гибрид';
  status?: 'предстоящий' | 'активный' | 'завершенный';
  directions?: ('AI/ML' | 'финансовые' | 'игровые' | 'соц проекты' | 'экология' | 'для начинающих')[];
  registrationDeadline: string;
}

export interface HackathonRegistration {
  hackathonId: string;
  userId: string;
  teamName?: string;
  teamMembers?: string[]; 
  registeredAt: Date;
  hasTeam?: boolean;
  teamSize?: number;
  neededRoles?: string[];
  teamLevel?: 'новички' | 'опытные' | 'смешанная' | 'профессиональная';
  city?: string;
  userRole?: string; 
  teamStatus?: 'в команде' | 'в поиске'; 
}
export interface TeamRequest {
  hackathonId: string;
  userId: string; 
  neededRoles: string[];
  teamLevel: 'новички' | 'опытные' | 'смешанная' | 'профессиональная';
  experience?: string;
  description?: string;
  createdAt: Date;
  applications: string[]; 
}
export interface HackathonFilters {
  status?: ('предстоящий' | 'активный' | 'завершенный')[];
  format?: ('онлайн' | 'офлайн' | 'гибрид')[];
  directions?: ('AI/ML' | 'финансовые' | 'игровые' | 'соц проекты' | 'экология' | 'для начинающих')[];
}

export type RegistrationFormData = Omit<HackathonRegistration, 'registeredAt'>;

export interface TeamMember {
  id: string;
  userId: string;
  username: string;
  fullName?: string;
  role: string;
  isCaptain: boolean;
}

export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  hackathonName: string;
  captainId: string; 
  members: TeamMember[];
  maxMembers: number;
  vacancies: string[];
  inviteToken?: string; 
  createdAt: Date;
}

export interface TeamApplication {
  id: string;
  teamId: string;
  userId: string;
  userName: string;
  userFullName: string;
  role: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}