import { useEffect, useState, useCallback } from "react";
import { useUserStore } from "../../../store/userStore";
import { useHackathonStore } from "../../../store/hackathonStore";
import { fakeHackathons } from "../../../data/mockData";
import { Link } from "react-router-dom";
import type { HackathonRegistration, Hackathon } from "../../../types/index";
import TeamCard from "../../features/TeamCard/TeamCard";
import styles from "./ProfilePage.module.css";
import CalendarIcon from "../../../assets/icons/calendar.svg";
import LocationIcon from "../../../assets/icons/Place.svg";
import AddingIcon from "../../../assets/icons/Add.svg";

const ProfilePage = () => {
  const { currentUser } = useUserStore();
  const { getUserRegistrations } = useHackathonStore();

  const [userHackathons, setUserHackathons] = useState<HackathonRegistration[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);

  const myTeams = [
    {
      id: 1,
      name: "Dream Team",
      hackathon: "Яндекс Хакатон 2024",
      members: [
        { id: 1, name: "Алексей Иванов", role: "Фронтенд" },
        { id: 2, name: "Мария Петрова", role: "Дизайнер" },
        { id: 3, name: "Иван Сидоров", role: "Бэкенд" },
      ],
      maxMembers: 5,
      vacancies: ["Designer", "QA"],
    },
    {
      id: 2,
      name: "Code Masters",
      hackathon: "AI Challenge 2024",
      members: [
        { id: 1, name: "Дмитрий Козлов", role: "ML инженер" },
        { id: 2, name: "Екатерина Смирнова", role: "Аналитик" },
      ],
      maxMembers: 4,
      vacancies: [],
    },
  ];

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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
          onClick={() => setIsTeamsOpen(!isTeamsOpen)}
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
              <div className={styles.noTeamsMessage}>
                <p>У вас пока нет команд</p>
                <Link to="/hackathons" className={styles.findTeamsLink}>
                  Найти команду
                </Link>
              </div>
            ) : (
              myTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))
            )}
          </div>
        </div>

        <div className={styles.currentHackathons}>
          <h3 className={styles.sectionTitle}>текущие хакатоны</h3>

          {loading ? (
            <div className={styles.loading}>Загрузка...</div>
          ) : userHackathons.length === 0 ? (
            <div className={styles.noHackathons}>
              <p>Вы еще не зарегистрированы ни на один хакатон</p>
              <Link to="/hackathons" className={styles.browseButton}>
                Найти хакатоны
              </Link>
            </div>
          ) : (
            userHackathons.map((registration) => {
              const hackathon = getHackathonById(registration.hackathonId);
              if (!hackathon) return null;

              return (
                <div
                  key={registration.hackathonId}
                  className={styles.hackathonCard}
                >
                  <div className={styles.hackathonHeader}>
                    <h4 className={styles.hackathonTitle}>{hackathon.title}</h4>
                    <div className={styles.hackathonMeta}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={CalendarIcon}
                          alt=""
                          className={styles.metaIcon}
                        />
                        <span>
                          {formatDate(hackathon.startDate)} -{" "}
                          {formatDate(hackathon.endDate)}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={LocationIcon}
                          alt=""
                          className={styles.metaIcon}
                        />
                        <span>{hackathon.location}</span>
                      </div>
                    </div>
                  </div>

                  {registration.hasTeam &&
                  registration.teamMembers &&
                  registration.teamMembers.length > 0 ? (
                    <div className={styles.teamSection}>
                      <div className={styles.teamHeader}>
                        <span>
                          моя команда {registration.teamMembers.length}/5
                        </span>
                      </div>
                      <div className={styles.teamMembers}>
                        {registration.teamMembers.map((member, index) => (
                          <div key={index} className={styles.teamMember}>
                            <div className={styles.memberAvatar}>
                              {member.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.memberInfo}>
                              <p className={styles.memberName}>{member}</p>
                              <p className={styles.memberRole}>Участник</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className={styles.noTeamSection}>
                      <p className={styles.noTeamText}>Команды пока нет</p>
                    </div>
                  )}
                </div>
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

          {currentUser.role && (
            <div className={styles.formSection}>
              <label className={styles.formLabel}>роль:</label>
              <div className={styles.tags}>
                <span className={styles.tag}>
                  {currentUser.customRole || currentUser.role}
                </span>
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
