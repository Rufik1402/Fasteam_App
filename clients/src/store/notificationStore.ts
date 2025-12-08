// store/notificationStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  userId: string;
  type: 'team_application' | 'team_application_accepted' | 'team_application_rejected' | 'team_invitation' | 'system';
  title: string;
  message: string;
  data?: {
    teamId?: string;
    teamName?: string;
    hackathonId?: string;
    hackathonName?: string;
    applicationId?: string;
  };
  read: boolean;
  createdAt: Date;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => Notification;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
  removeNotification: (notificationId: string) => void;
  clearAllNotifications: (userId: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `notification_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          read: false,
          createdAt: new Date(),
        };

        set((state) => ({
          notifications: [...state.notifications, newNotification],
        }));

        return newNotification;
      },

      markAsRead: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          ),
        }));
      },

      markAllAsRead: (userId) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.userId === userId && !notification.read
              ? { ...notification, read: true }
              : notification
          ),
        }));
      },

      getUserNotifications: (userId) => {
        return get().notifications
          .filter((notification) => notification.userId === userId)
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter(
          (notification) => notification.userId === userId && !notification.read
        ).length;
      },

      removeNotification: (notificationId) => {
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.id !== notificationId
          ),
        }));
      },

      clearAllNotifications: (userId) => {
        set((state) => ({
          notifications: state.notifications.filter(
            (notification) => notification.userId !== userId
          ),
        }));
      },
    }),
    {
      name: "notification-storage",
    }
  )
);