import type { Team } from '../../../types';
import styles from './TeamCard.module.css';

interface TeamCardProps {
  team: Team;
  onEdit?: (teamId: number) => void;
  onShare?: (teamId: number) => void;
}

const TeamCard = ({ team, onEdit, onShare }: TeamCardProps) => {
  const maxMembers = team.maxMembers || 5;
  const currentMembers = team.members.length;

  return (
    <div className={styles.teamCard}>
      <h3 className={styles.teamName}>{team.name}</h3>
      <p className={styles.teamHackathon}>{team.hackathon}</p>

      <div className={styles.teamInfo}>
        <span className={styles.membersCount}>
          {currentMembers}/{maxMembers} участников
        </span>
        {team.vacancies && team.vacancies.length > 0 && (
          <div className={styles.vacanciesSection}>
            <span className={styles.vacanciesLabel}>вакансии:</span>
            <div className={styles.vacanciesTags}>
              {team.vacancies.map((vacancy, index) => (
                <span key={index} className={styles.vacancyTag}>
                  {vacancy}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.membersSection}>
        <h4 className={styles.membersTitle}>СОСТАВ КОМАНДЫ:</h4>
        <div className={styles.membersList}>
          {team.members.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.memberInfo}>
                <p className={styles.memberName}>{member.name}</p>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        {onShare && (
          <button 
            className={styles.shareButton}
            onClick={() => onShare(team.id)}
          >
            <span className={styles.buttonIcon}>🔗</span>
            поделиться ссылкой
          </button>
        )}
        {onEdit && (
          <button 
            className={styles.editButton}
            onClick={() => onEdit(team.id)}
          >
            <span className={styles.buttonIcon}>✏️</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
