import type { User } from '../../../types';
import styles from './UserCard.module.css';

interface UserCardProps {
  user: User;
  onInvite: (userId: string) => void;
}

const UserCard = ({ user, onInvite }: UserCardProps) => {
  const getDisplayName = () => {
    return user.fullName || user.username;
  };
  if (!user.hasFilledProfile) {
    return (
      <div className={styles.card}>
        <div className={styles.emptyCard}>
          <div className={styles.avatar}></div>
          <div>
            <p className={styles.unfilledText}>Профиль не заполнен</p>
            <p className={styles.username}>@{user.username.replace('@', '')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.avatar}></div>
        
        <div className={styles.userInfo}>
          <h2 className={styles.name}>{getDisplayName()}</h2>
          <p className={styles.username}>@{user.username.replace('@', '')}</p>
          <div className={styles.location}>
            <span className={styles.locationText}>{user.city || 'Москва, Россия'}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>роли:</h3>
          <div className={styles.tags}>
            {user.role && (
              <span className={styles.roleTag}>{user.customRole || user.role}</span>
            )}
            {user.skills?.slice(0, 1).map(skill => (
              <span key={skill} className={styles.roleTag}>{skill}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>навыки:</h3>
          <div className={styles.tags}>
            {user.skills?.slice(0, 3).map(skill => (
              <span key={skill} className={styles.skillTag}>{skill}</span>
            ))}
          </div>
        </div>
        
        <button 
          className={styles.inviteButton}
          onClick={() => onInvite(user.id)}
        >
          <span className={styles.buttonIcon}></span>
          пригласить в команду
        </button>
      </div>
    </div>
  );
};

export default UserCard;