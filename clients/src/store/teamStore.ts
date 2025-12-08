// store/teamStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Team, TeamMember, TeamApplication } from "../types";

export interface TeamStore {
  teams: Team[];
  applications: TeamApplication[];

  createTeam: (team: Omit<Team, "id" | "inviteToken" | "createdAt">) => Team;
  addTeamMember: (teamId: string, member: TeamMember) => void;
  removeTeamMember: (teamId: string, memberId: string) => void;
  updateTeamVacancies: (teamId: string, vacancies: string[]) => void;
  getUserTeams: (userId: string) => Team[];
  getTeamById: (teamId: string) => Team | undefined;
  getTeamByInviteToken: (token: string) => Team | undefined;
  joinTeamByToken: (token: string, member: TeamMember) => boolean;
  generateInviteToken: (teamId: string) => string;

  applyToTeam: (
    application: Omit<TeamApplication, "id" | "status" | "createdAt">
  ) => TeamApplication;
  getTeamApplications: (teamId: string) => TeamApplication[];
  getUserApplications: (userId: string) => TeamApplication[];
  updateApplicationStatus: (
    applicationId: string,
    status: "pending" | "accepted" | "rejected"
  ) => void;
  hasUserAppliedToTeam: (userId: string, teamId: string) => boolean;
}

const generateToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const useTeamStore = create<TeamStore>()(
  persist(
    (set, get) => ({
      teams: [],
      applications: [],

      createTeam: (teamData) => {
        const newTeam: Team = {
          ...teamData,
          id: `team_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          inviteToken: generateToken(),
          createdAt: new Date(),
        };

        set((state) => ({
          teams: [...state.teams, newTeam],
        }));

        return newTeam;
      },

      addTeamMember: (teamId, member) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: [...team.members, member],
                }
              : team
          ),
        }));
      },

      removeTeamMember: (teamId, memberId) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId
              ? {
                  ...team,
                  members: team.members.filter((m) => m.id !== memberId),
                }
              : team
          ),
        }));
      },

      updateTeamVacancies: (teamId, vacancies) => {
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, vacancies } : team
          ),
        }));
      },

      getUserTeams: (userId) => {
        return get().teams.filter((team) =>
          team.members.some((member) => member.userId === userId)
        );
      },

      getTeamById: (teamId) => {
        return get().teams.find((team) => team.id === teamId);
      },

      getTeamByInviteToken: (token) => {
        return get().teams.find((team) => team.inviteToken === token);
      },

      joinTeamByToken: (token, member) => {
        const team = get().getTeamByInviteToken(token);

        if (!team) return false;

        if (team.members.length >= team.maxMembers) return false;

        if (team.members.some((m) => m.userId === member.userId)) return false;

        get().addTeamMember(team.id, member);
        return true;
      },

      generateInviteToken: (teamId) => {
        const newToken = generateToken();

        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === teamId ? { ...team, inviteToken: newToken } : team
          ),
        }));

        return newToken;
      },

      applyToTeam: (applicationData) => {
        const newApplication: TeamApplication = {
          ...applicationData,
          id: `application_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 9)}`,
          status: "pending",
          createdAt: new Date(),
        };

        set((state) => ({
          applications: [...state.applications, newApplication],
        }));

        return newApplication;
      },

      getTeamApplications: (teamId) => {
        return get().applications.filter(
          (application) =>
            application.teamId === teamId && application.status === "pending"
        );
      },

      getUserApplications: (userId) => {
        return get().applications.filter(
          (application) => application.userId === userId
        );
      },

      updateApplicationStatus: (applicationId, status) => {
        set((state) => ({
          applications: state.applications.map((application) =>
            application.id === applicationId
              ? { ...application, status }
              : application
          ),
        }));
      },

      hasUserAppliedToTeam: (userId, teamId) => {
        return get().applications.some(
          (application) =>
            application.userId === userId &&
            application.teamId === teamId &&
            application.status === "pending"
        );
      },
    }),
    {
      name: "team-storage",
    }
  )
);
