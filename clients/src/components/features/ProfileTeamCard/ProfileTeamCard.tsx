import { useState } from 'react';
import type { Team } from '../../../types';
import { useUserStore } from '../../../store/userStore';
import { useTeamStore } from '../../../store/teamStore';
import styles from './ProfileTeamCard.module.css';
import TeamIcon from '../../Layout/Sidebar/icons/team.svg'
import PenIcon from '../../../assets/icons/pen.svg'

interface ProfileTeamCardProps {
  team: Team;
  onTeamUpdate?: () => void;
}

const ProfileTeamCard = ({ team, onTeamUpdate }: ProfileTeamCardProps) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const { removeTeamMember } = useTeamStore();
  
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const isCaptain = currentUser?.id === team.captainId;
  const currentMembers = team.members.length;
  const maxMembers = team.maxMembers;

  const handleShareLink = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!team.inviteToken) return;

    const inviteLink = `${window.location.origin}/team/join/${team.inviteToken}`;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert(`Ссылка для приглашения: ${inviteLink}`);
    }
  };

  const toggleEditMode = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (isEditing) {
      setSelectedMembers([]);
    }
    setIsEditing(!isEditing);
  };

  const toggleMemberSelection = (e: React.MouseEvent, memberId: string) => {
    e.stopPropagation(); 
    
    const member = team.members.find(m => m.id === memberId);
    if (member?.isCaptain) {
      alert('Нельзя удалить капитана команды');
      return;
    }

    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleRemoveSelected = async (e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (selectedMembers.length === 0) {
      setIsEditing(false);
      return;
    }

    if (!window.confirm(`Вы уверены, что хотите удалить ${selectedMembers.length} участник(ов) из команды?`)) {
      return;
    }

    try {
      selectedMembers.forEach(memberId => {
        removeTeamMember(team.id, memberId);
      });

      setSelectedMembers([]);
      setIsEditing(false);
      
      if (onTeamUpdate) {
        onTeamUpdate();
      }

      alert('Участники успешно удалены из команды');
    } catch (error) {
      console.error('Ошибка при удалении участников:', error);
      alert('Произошла ошибка при удалении участников');
    }
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setSelectedMembers([]);
    setIsEditing(false);
  };

  return (
    <div className={styles.teamCard} onClick={(e) => e.stopPropagation()}>
      <div onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.teamName}>
          {team.hackathonName}
          {isCaptain && (
            <span className={styles.captainBadge}>(вы - капитан)</span>
          )}
        </h2>

        <div className={styles.infoItem}>
          <img src={TeamIcon} alt="Дата" className={styles.metaIcon} />
          <span className={styles.infoText}>
            {currentMembers}/{maxMembers} участников
            {isEditing && selectedMembers.length > 0 && (
              <span className={styles.selectedCount}> • выбрано: {selectedMembers.length}</span>
            )}
          </span>
        </div>

        <div className={styles.membersSection}>
          <h3 className={styles.membersTitle}>СОСТАВ КОМАНДЫ:</h3>
          <div className={styles.membersList}>
            {team.members.map((member) => (
              <div key={member.id} className={styles.memberCard}>
                <div className={styles.memberName}>
                  {member.fullName || member.username}
                  {member.isCaptain && (
                    <span className={styles.captainLabel}>(капитан)</span>
                  )}
                </div>
                <div className={styles.memberRight}>
                  <span className={styles.memberRole}>{member.role}</span>
                  {isEditing && !member.isCaptain && (
                    <button
                      className={`${styles.removeCheckbox} ${
                        selectedMembers.includes(member.id) ? styles.selected : ''
                      }`}
                      onClick={(e) => toggleMemberSelection(e, member.id)}
                      title={selectedMembers.includes(member.id) ? 'Отменить выбор' : 'Выбрать для удаления'}
                    >
                      {selectedMembers.includes(member.id) ? '✓' : '×'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.shareButton} onClick={handleShareLink}>
            поделиться ссылкой
          </button>
          
          {isCaptain && (
            <div className={styles.editContainer}>
              {isEditing ? (
                <div className={styles.editButtons}>
                  <button
                    className={styles.cancelEditButton}
                    onClick={handleCancelEdit}
                  >
                    отмена
                  </button>
                  <button
                    className={styles.removeButton}
                    onClick={handleRemoveSelected}
                    disabled={selectedMembers.length === 0}
                  >
                    удалить выбранных
                  </button>
                </div>
              ) : (
                <button 
                  className={styles.editButton}
                  onClick={toggleEditMode}
                  title="Редактировать команду"
                >
                  <img src={PenIcon} alt="редактировать" className={styles.metaIcon} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showCopyNotification && (
        <div className={styles.notification}>
          Ссылка скопирована!
        </div>
      )}
    </div>
  );
};

export default ProfileTeamCard;