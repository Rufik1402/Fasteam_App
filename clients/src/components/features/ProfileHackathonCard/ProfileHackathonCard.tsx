import type { Hackathon, HackathonRegistration } from '../../../types';
import styles from './ProfileHackathonCard.module.css';
import CalendarIcon from '../../../assets/icons/calendar.svg';
import LocationIcon from '../../../assets/icons/Place.svg';

interface ProfileHackathonCardProps {
  hackathon: Hackathon;
  registration: HackathonRegistration;
}

const ProfileHackathonCard = ({ hackathon, registration }: ProfileHackathonCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusLabel = () => {
    if (hackathon.status === 'активный') return 'в данный момент';
    if (hackathon.status === 'предстоящий') return 'регистрация';
    return 'завершен';
  };

  const getStatusColor = () => {
    if (hackathon.status === 'активный') return '#FFF9C4';
    if (hackathon.status === 'предстоящий') return '#FFE0B2';
    return '#E0E0E0';
  };

  const getTeamStatusLabel = () => {
    return registration.teamStatus === 'в команде' ? 'вы в команде' : 'в поиске';
  };

  const getTeamStatusColor = () => {
    return registration.teamStatus === 'в команде' ? '#B2DFDB' : '#FFCDD2';
  };

  const formatLocation = () => {
    if (hackathon.format === 'онлайн') {
      return 'Онлайн';
    } else if (hackathon.format === 'гибрид') {
      return `${hackathon.location} + Онлайн`;
    }
    return hackathon.location;
  };

  return (
    <div className={styles.card}>
      <div className={styles.leftSection}>
        <h3 className={styles.title}>{hackathon.title}</h3>
        
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <img src={CalendarIcon} alt="" className={styles.metaIcon} />
            <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)} года</span>
          </div>
          <div className={styles.metaItem}>
            <img src={LocationIcon} alt="" className={styles.metaIcon} />
            <span>{formatLocation()}</span>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.statusRow}>
          <span className={styles.label}>статус:</span>
          <span 
            className={styles.statusBadge}
            style={{ background: getStatusColor() }}
          >
            {getStatusLabel()}
          </span>
        </div>

        <div className={styles.roleRow}>
          <span className={styles.label}>роль:</span>
          <div className={styles.roleInfo}>
            <span 
              className={styles.teamStatusBadge}
              style={{ background: getTeamStatusColor() }}
            >
              {getTeamStatusLabel()}
            </span>
            {registration.userRole && (
              <span className={styles.userRoleBadge}>
                {registration.userRole}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHackathonCard;
