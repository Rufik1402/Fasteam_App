import { useState } from 'react';
import styles from './NotificationsPage.module.css';

type TabType = 'all' | 'unread' | 'read';

const NotificationPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  
  const notifications = [
    {
      id: '1',
      type: 'team_application',
      title: 'Новая заявка в команду',
      message: 'Кирилл Бледный подал заявку на вступление в вашу команду "AI Masters"',
      isRead: false,
      createdAt: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      type: 'application_accepted',
      title: 'Заявка принята',
      message: 'Ваша заявка в команду "FinTech Warriors" была принята',
      isRead: true,
      createdAt: new Date('2024-01-14T15:45:00'),
    },
    {
      id: '3',
      type: 'team_invitation',
      title: 'Приглашение в команду',
      message: 'Алексей Петров пригласил вас в команду "Web Developers"',
      isRead: false,
      createdAt: new Date('2024-01-13T09:20:00'),
    },
    {
      id: '4',
      type: 'application_rejected',
      title: 'Заявка отклонена',
      message: 'Ваша заявка в команду "Mobile Experts" была отклонена',
      isRead: true,
      createdAt: new Date('2024-01-12T14:10:00'),
    },
    {
      id: '5',
      type: 'team_application',
      title: 'Новая заявка в команду',
      message: 'Мария Иванова подала заявку на вступление в вашу команду "AI Masters"',
      isRead: true,
      createdAt: new Date('2024-01-11T11:05:00'),
    },
  ];

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `сегодня в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffHours < 48) {
      return `вчера в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Уведомления</h1>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount}</span>
        )}
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          все
          <span className={styles.tabCount}>{notifications.length}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'unread' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          непрочитанные
          <span className={styles.tabCount}>{unreadCount}</span>
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'read' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('read')}
        >
          прочитанные
          <span className={styles.tabCount}>{notifications.length - unreadCount}</span>
        </button>
      </div>

      <div className={styles.notificationsList}>
        {filteredNotifications.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              {activeTab === 'all' 
                ? 'Нет уведомлений'
                : activeTab === 'unread'
                ? 'Нет непрочитанных уведомлений'
                : 'Нет прочитанных уведомлений'
              }
            </p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div 
              key={notification.id} 
              className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
            >
              <div className={styles.notificationContent}>
                <div className={styles.notificationHeader}>
                  <h3 className={styles.notificationTitle}>{notification.title}</h3>
                  {!notification.isRead && (
                    <span className={styles.unreadDot}>●</span>
                  )}
                </div>
                <p className={styles.notificationMessage}>{notification.message}</p>
                <span className={styles.notificationTime}>
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              <div className={styles.notificationActions}>
                {!notification.isRead && (
                  <button className={styles.markAsReadButton}>✓</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;