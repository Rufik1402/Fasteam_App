import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "../../../store/userStore";
import { useHackathonStore } from "../../../store/hackathonStore";
import { useTeamStore } from "../../../store/teamStore";
import { fakeHackathons } from "../../../data/mockData";
import { Link } from "react-router-dom";
import type { HackathonRegistration, Hackathon } from "../../../types/index";
import ProfileTeamCard from "../../features/ProfileTeamCard/ProfileTeamCard";
import ProfileHackathonCard from "../../features/ProfileHackathonCard/ProfileHackathonCard";
import styles from "./ProfilePage.module.css";
import AddingIcon from "../../../assets/icons/Add.svg";

const ProfilePage = () => {
  const { currentUser } = useUserStore();
  const { getUserRegistrations } = useHackathonStore();
  const { getUserTeams } = useTeamStore();

  const [userHackathons, setUserHackathons] = useState<HackathonRegistration[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);

  const myTeams = currentUser ? getUserTeams(currentUser.id) : [];

  const loadUserData = useCallback(async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);

      const registrations = getUserRegistrations(currentUser.id);
      setUserHackathons(registrations);
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, getUserRegistrations]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleTeamCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };

  const handleTeamsSectionClick = () => {
    setIsTeamsOpen(!isTeamsOpen);
  };

  if (!currentUser) {
    return (
      <div className={styles.container}>
        <h2>Профиль не найден</h2>
        <p>Пожалуйста, заполните анкету</p>
        <Link to="/register">Заполнить анкету</Link>
      </div>
    );
  }

  if (!currentUser.hasFilledProfile) {
    return (
      <div className={styles.container}>
        <h2>Профиль не заполнен</h2>
        <p>Пожалуйста, заполните анкету</p>
        <Link to="/register">Заполнить анкету</Link>
      </div>
    );
  }

  const getHackathonById = (id: string): Hackathon | undefined => {
    return fakeHackathons.find((h) => h.id === id);
  };

  const getAllRoles = () => {
    if (!currentUser.customRole) return [];
    return currentUser.customRole.split(", ").filter(role => role.trim());
  };

  const roles = getAllRoles();

  return (
    <div className={styles.container}>
      <div className={styles.centerColumn}>
        <div className={styles.profileCard}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}></div>
            <div className={styles.profileInfo}>
              <h2 className={styles.name}>
                {currentUser.fullName || currentUser.username}
              </h2>
              <p className={styles.username}>
                @{currentUser.username.replace("@", "")}
              </p>
            </div>
          </div>
        </div>

        <div
          className={styles.profileCard}
          onClick={handleTeamsSectionClick}
        >
          <h2 className={styles.teamTitle}>
            мои команды
            <span
              className={`${styles.teamArrow} ${
                isTeamsOpen ? styles.open : ""
              }`}
            >
              ▼
            </span>
          </h2>

          <div
            className={`${styles.teamsContainer} ${
              isTeamsOpen ? styles.open : ""
            }`}
          >
            {myTeams.length === 0 ? (
              <div className={styles.noTeamsMessage} onClick={handleTeamCardClick}>
                <p>У вас пока нет команд</p>
                <Link to="/teams" className={styles.browseButton}>
                  найти команду
                </Link>
              </div>
            ) : (
              myTeams.map((team) => (
                <div key={team.id} onClick={handleTeamCardClick}>
                  <ProfileTeamCard 
                    team={team} 
                    onTeamUpdate={loadUserData} 
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.currentHackathons}>
          <h3 className={styles.sectionTitle}>текущие хакатоны</h3>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : userHackathons.length === 0 ? (
            <div className={styles.noTeamsMessage}>
              <p>Вы еще не зарегистрированы ни на один хакатон</p>
              <Link to="/hackathons" className={styles.browseButton}>
                найти хакатоны
              </Link>
            </div>
          ) : (
            userHackathons.map((registration) => {
              const hackathon = getHackathonById(registration.hackathonId);
              if (!hackathon) return null;

              return (
                <ProfileHackathonCard
                  key={registration.hackathonId}
                  hackathon={hackathon}
                  registration={registration}
                />
              );
            })
          )}
        </div>
      </div>

      <div className={styles.rightColumn}>
        <div className={styles.profileForm}>
          <div className={styles.formHeader}>
            <h3>Анкета</h3>
            <Link to="/register" className={styles.editButton}>
              <img src={AddingIcon} alt="" className={styles.metaIcon} />
            </Link>
          </div>

          {roles.length > 0 && (
            <div className={styles.formSection}>
              <label className={styles.formLabel}>роли:</label>
              <div className={styles.tags}>
                {roles.map((role, index) => (
                  <span key={index} className={styles.tag}>
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(currentUser.wins !== undefined ||
            currentUser.hackathonsCount !== undefined) && (
            <div className={styles.formSection}>
              <label className={styles.formLabel}>опыт:</label>
              <div className={styles.tags}>
                {currentUser.wins !== undefined && (
                  <span className={styles.tag}> побед: {currentUser.wins}</span>
                )}
                {currentUser.hackathonsCount !== undefined && (
                  <span className={styles.tag}>
                    хакатонов: {currentUser.hackathonsCount}
                  </span>
                )}
              </div>
            </div>
          )}

          {currentUser.bio && (
            <div className={styles.formSection}>
              <label className={styles.formLabel}>о себе:</label>
              <p className={styles.bioText}>{currentUser.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;