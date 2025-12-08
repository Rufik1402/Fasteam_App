// components/TeamCard/TeamCard.tsx
import type { Team, Hackathon } from '../../../types';
import styles from './TeamPageCard.module.css';

interface TeamCardProps {
  team: Team;
  hackathon: Hackathon;
  onApply: (teamId: string) => void;
  isApplied?: boolean;
  isOwnTeam?: boolean;
}

const TeamPageCard = ({ team, hackathon, onApply, isApplied = false, isOwnTeam = false }: TeamCardProps) => {

  const getTeamSizeText = () => {
    return `${team.members.length}/${team.maxMembers}`;
  };
  const extractSkillsFromMembers = () => {
    const skills = new Set<string>();
    team.members.forEach(member => {
      if (member.role) {
        skills.add(member.role.toLowerCase());
      }
    });
    return Array.from(skills);
  };

  const getCaptain = () => {
    const captain = team.members.find(member => member.userId === team.captainId);
    return captain || team.members[0];
  };

  const skills = extractSkillsFromMembers();
  const captain = getCaptain();

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.teamInfo}>
          <h1 className={styles.name}>{team.name}</h1>
          <div className={styles.teamMeta}>
            <span className={styles.captainLabel}>капитан:</span>
            <span className={styles.captain}>@{captain?.username || 'unknown'}</span>
          </div>
          <div className={styles.teamSize}>
            <span className={styles.sizeText}>участники {getTeamSizeText()}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.cardBody}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Ищем роли</h3>
          <div className={styles.tags}>
            {team.vacancies.map((role) => (
              <span key={role} className={styles.roleTag}>{role}</span>
            ))}
          </div>
        </div>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Навыки</h3>
          <div className={styles.tags}>
            {skills.length > 0 ? (
              skills.slice(0, 4).map((skill, index) => (
                <span key={index} className={styles.skillTag}>{skill}</span>
              ))
            ) : (
              <span className={styles.noSkills}>Навыки не указаны</span>
            )}
            {skills.length > 4 && (
              <span className={styles.moreSkills}>+{skills.length - 4}</span>
            )}
          </div>
        </div>
        
        <div className={styles.hackathonInfo}>
          <span className={styles.hackathonName}>{hackathon.title}</span>
        </div>
        
        <div className={styles.registrationSection}>
          <div className={styles.registrationStatus}>
            <span className={styles.statusText}>Регистрация открыта</span>
          </div>
          <div className={styles.deadline}>
            <span className={styles.deadlineText}>закрытие через: 3 дня</span>
          </div>
        </div>
        
        <button 
          className={`${styles.applyButton} ${isOwnTeam ? styles.ownTeamButton : ''} ${isApplied ? styles.appliedButton : ''}`}
          onClick={() => !isApplied && !isOwnTeam && onApply(team.id)}
          disabled={isApplied || isOwnTeam}
        >
          {isOwnTeam ? 'ВАША КОМАНДА' : isApplied ? 'ЗАЯВКА ОТПРАВЛЕНА' : 'ЗАПРОС НА ВСТУПЛЕНИЕ'}
        </button>
      </div>
    </div>
  );
};

export default TeamPageCard;