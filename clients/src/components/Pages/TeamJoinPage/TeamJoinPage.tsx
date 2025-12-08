import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeamStore } from '../../../store/teamStore';
import { useUserStore } from '../../../store/userStore';
import type { Team, TeamMember } from '../../../types';
import styles from './TeamJoinPage.module.css';

const TeamJoinPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { getTeamByInviteToken, joinTeamByToken } = useTeamStore();
  const currentUser = useUserStore((state) => state.currentUser);
  
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Неверная ссылка приглашения');
      setLoading(false);
      return;
    }

    const foundTeam = getTeamByInviteToken(token);
    
    if (!foundTeam) {
      setError('Команда не найдена или ссылка устарела');
      setLoading(false);
      return;
    }

    setTeam(foundTeam);
    setLoading(false);
  }, [token, getTeamByInviteToken]);

  const handleJoinTeam = () => {
    if (!currentUser || !team || !token) {
      alert('Необходимо войти в систему');
      return;
    }

    if (!userRole.trim()) {
      alert('Укажите вашу роль в команде');
      return;
    }

    const newMember: TeamMember = {
      id: `member_${currentUser.id}`,
      userId: currentUser.id,
      username: currentUser.username,
      fullName: currentUser.fullName,
      role: userRole.trim(),
      isCaptain: false,
    };

    const success = joinTeamByToken(token, newMember);

    if (success) {
      alert('Вы успешно присоединились к команде!');
      navigate('/profile');
    } else {
      alert('Не удалось присоединиться к команде. Возможно, команда уже заполнена или вы уже в ней.');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.errorTitle}>Ошибка</h2>
          <p className={styles.errorText}>{error || 'Команда не найдена'}</p>
          <button 
            className={styles.backButton}
            onClick={() => navigate('/hackathons')}
          >
            Вернуться к хакатонам
          </button>
        </div>
      </div>
    );
  }

  const isAlreadyMember = currentUser && team.members.some(
    (m) => m.userId === currentUser.id
  );

  const isFull = team.members.length >= team.maxMembers;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Приглашение в команду</h2>
        
        <div className={styles.teamInfo}>
          <h3 className={styles.teamName}>{team.name}</h3>
          <p className={styles.hackathonName}>{team.hackathonName}</p>
          
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statLabel}>Участников:</span>
              <span className={styles.statValue}>
                {team.members.length}/{team.maxMembers}
              </span>
            </div>
          </div>

          <div className={styles.membersSection}>
            <h4 className={styles.membersTitle}>Текущий состав:</h4>
            <div className={styles.membersList}>
              {team.members.map((member) => (
                <div key={member.id} className={styles.memberCard}>
                  <div className={styles.memberAvatar}>
                    {member.fullName
                      ? member.fullName.charAt(0).toUpperCase()
                      : member.username.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.memberInfo}>
                    <p className={styles.memberName}>
                      {member.fullName || member.username}
                      {member.isCaptain && (
                        <span className={styles.captainBadge}>(капитан)</span>
                      )}
                    </p>
                    <p className={styles.memberRole}>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {team.vacancies && team.vacancies.length > 0 && (
            <div className={styles.vacanciesSection}>
              <h4 className={styles.vacanciesTitle}>Требуются:</h4>
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

        {!currentUser ? (
          <div className={styles.authMessage}>
            <p>Войдите в систему, чтобы присоединиться к команде</p>
            <button 
              className={styles.authButton}
              onClick={() => navigate('/register')}
            >
              Войти
            </button>
          </div>
        ) : isAlreadyMember ? (
          <div className={styles.alreadyMemberMessage}>
            <p>Вы уже состоите в этой команде</p>
            <button 
              className={styles.profileButton}
              onClick={() => navigate('/profile')}
            >
              Перейти в профиль
            </button>
          </div>
        ) : isFull ? (
          <div className={styles.fullMessage}>
            <p>К сожалению, команда уже заполнена</p>
            <button 
              className={styles.backButton}
              onClick={() => navigate('/hackathons')}
            >
              Найти другую команду
            </button>
          </div>
        ) : (
          <div className={styles.joinSection}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ваша роль в команде:</label>
              <input
                type="text"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                placeholder="Например: Frontend, Backend, Designer"
                className={styles.input}
              />
            </div>
            <button 
              className={styles.joinButton}
              onClick={handleJoinTeam}
              disabled={!userRole.trim()}
            >
              Присоединиться к команде
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamJoinPage;
