import type { User, Hackathon, HackathonRegistration } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    telegramId: '123456789',
    username: '@kkhryyst',
    fullName: 'Александра Ускова', 
    role: 'Фронтендер', 
    wins: 2, 
    hackathonsCount: 4, 
    bio: 'Ищу классную команду для реализации проектов',
    skills: ['React', 'TypeScript', 'UI/UX', 'Figma'],
    hasFilledProfile: true,
  },
  {
    id: '2',
    telegramId: '987654321',
    username: '@frontend_dev',
    fullName: 'Иван Петров',
    role: 'Фронтендер',
    wins: 1,
    hackathonsCount: 2,
    bio: 'Люблю создавать красивые интерфейсы',
    skills: ['Vue.js', 'JavaScript', 'CSS'],
    hasFilledProfile: true,
  },
];

export const fakeHackathons: Hackathon[] = [
  {
    id: '1',
    title: 'AI Challenge 2025',
    description: 'Хакатон по искусственному интеллекту и машинному обучению',
    startDate: '2025-12-15',
    endDate: '2025-12-17',
    location: 'Москва',
    isActive: true,
    prize: '2.000.000 ₽',
    duration: '48ч',
    format: 'гибрид',
    status: 'активный',
    directions: ['AI/ML'],
    registrationDeadline: '2025-12-10',
  },
  {
    id: '2',
    title: 'FinTech Hack',
    description: 'Финансовые технологии и инновации',
    startDate: '2025-11-20',
    endDate: '2025-11-22',
    location: 'Онлайн',
    isActive: true,
    prize: '1.000.000 ₽',
    duration: '72ч',
    format: 'онлайн',
    status: 'активный',
    directions: ['финансовые', 'игровые'],
    registrationDeadline: '2025-11-18',
  },
  {
    id: '3',
    title: 'Mobile App Hackathon',
    description: 'Разработка мобильных приложений',
    startDate: '2025-10-01',
    endDate: '2025-10-03',
    location: 'Санкт-Петербург',
    isActive: false,
    prize: '500.000 ₽',
    duration: '48ч',
    format: 'офлайн',
    status: 'завершенный',
    directions: ['соц проекты', 'экология'],
    registrationDeadline: '2025-09-25',
  },
  {
    id: '4',
    title: 'Happy New Year Hack',
    description: 'Хакатон для начинающих разработчиков',
    startDate: '2025-12-30',
    endDate: '2025-12-31',
    location: 'Онлайн',
    isActive: true,
    duration: '24ч',
    format: 'онлайн',
    status: 'активный',
    directions: ['для начинающих'],
    registrationDeadline: '2025-12-20',
  },
];

const fakeRegistrations: HackathonRegistration[] = [
  {
    hackathonId: '1',
    userId: '1',
    registeredAt: new Date('2025-11-01'),
    hasTeam: true,
    teamMembers: ['@teammate1', '@teammate2'],
    userRole: 'Backend',
    teamStatus: 'в команде',
  },
  {
    hackathonId: '2',
    userId: '1',
    registeredAt: new Date('2025-10-15'),
    hasTeam: true,
    teamMembers: ['@teammate3'],
    userRole: 'Backend',
    teamStatus: 'в команде',
  },
  {
    hackathonId: '3',
    userId: '1',
    registeredAt: new Date('2025-09-20'),
    hasTeam: false,
    userRole: 'Frontend',
    teamStatus: 'в поиске',
  },
];

export const hackathonService = {
  getAllHackathons: async (): Promise<Hackathon[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(fakeHackathons), 300);
    });
  },

  registerForHackathon: async (
    hackathonId: string,
    userId: string,
    hasTeam: boolean,
    teamMembers?: string[]
  ): Promise<HackathonRegistration> => {
    const registration: HackathonRegistration = {
      hackathonId,
      userId,
      registeredAt: new Date(),
    };

    if (hasTeam && teamMembers && teamMembers.length > 0) {
      registration.teamMembers = teamMembers;
    }

    fakeRegistrations.push(registration);
    
    return new Promise(resolve => {
      setTimeout(() => resolve(registration), 500);
    });
  },

  getUserRegistrations: async (userId: string): Promise<HackathonRegistration[]> => {
    const userRegistrations = fakeRegistrations.filter(
      reg => reg.userId === userId || reg.teamMembers?.includes(userId)
    );
    
    return new Promise(resolve => {
      setTimeout(() => resolve(userRegistrations), 300);
    });
  },
};