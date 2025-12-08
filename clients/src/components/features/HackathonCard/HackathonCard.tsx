import { useState } from "react";
import TeamRegistrationModal from "../../Pages/TeamRegistarionModal/TeamRegistrationModal";
import { useUserStore } from "../../../store/userStore";
import { useHackathonStore } from "../../../store/hackathonStore";
import { useTeamStore } from "../../../store/teamStore";
import type {
  Hackathon,
  RegistrationFormData,
  HackathonRegistration,
  TeamMember,
} from "../../../types/index";
import styles from "./HackathonCard.module.css";
import CalendarIcon from "../../../assets/icons/calendar.svg";
import LocationIcon from "../../../assets/icons/Place.svg";

interface HackathonCardProps {
  hackathon: Hackathon;
}

const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentUser = useUserStore((state) => state.currentUser);
  const { registerForHackathon, isUserRegistered } = useHackathonStore();
  const { createTeam } = useTeamStore();

  const isRegistered = currentUser
    ? isUserRegistered(hackathon.id, currentUser.id)
    : false;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getFormatText = (format?: string) => {
    switch (format) {
      case "онлайн":
        return "Онлайн";
      case "офлайн":
        return "Офлайн";
      case "гибрид":
        return "Гибрид";
      default:
        return format || "Не указан";
    }
  };

  const getStatusInfo = () => {
    const now = new Date();
    const startDate = new Date(hackathon.startDate);
    const regEndDate = new Date(hackathon.registrationDeadline);

    if (now > regEndDate) {
      return { text: "Регистрация закрыта", color: "#440d0dff", canRegister: false };
    }
    if (now < startDate) {
      return { text: "Регистрация открыта", color: "#055441", canRegister: true };
    }
    if (hackathon.isActive) {
      return { text: "Идет сейчас", color: "#2196F3", canRegister: false };
    }
    return { text: "Завершен", color: "#757575", canRegister: false };
  };

  const handleRegisterClick = () => {
    const statusInfo = getStatusInfo();
    
    if (!statusInfo.canRegister) {
      alert("Регистрация на этот хакатон закрыта");
      return;
    }

    setIsModalOpen(true);
  };

  const handleTeamRegistration = (formData: RegistrationFormData) => {
    if (!currentUser) return;

    const registrationData: HackathonRegistration = {
      ...formData,
      hackathonId: hackathon.id,
      userId: currentUser.id,
      registeredAt: new Date(),
    };

    registerForHackathon(registrationData);

    if (
      formData.hasTeam &&
      formData.teamMembers &&
      formData.teamMembers.length > 0
    ) {
      const teamName = `Команда ${
        currentUser.fullName || currentUser.username
      }`;

      const captainMember: TeamMember = {
        id: `member_${currentUser.id}`,
        userId: currentUser.id,
        username: currentUser.username,
        fullName: currentUser.fullName,
        role: formData.userRole || "Участник",
        isCaptain: true,
      };

      const otherMembers: TeamMember[] = formData.teamMembers.map(
        (username, index) => ({
          id: `member_${Date.now()}_${index}`,
          userId: `temp_${Date.now()}_${index}`,
          username: username,
          fullName: undefined,
          role: "Участник",
          isCaptain: false,
        })
      );

      createTeam({
        name: teamName,
        hackathonId: hackathon.id,
        hackathonName: hackathon.title,
        captainId: currentUser.id,
        members: [captainMember, ...otherMembers],
        maxMembers: 5,
        vacancies: [],
      });
    }

    setIsModalOpen(false);
  };

  const statusInfo = getStatusInfo();
  const formatText = getFormatText(hackathon.format);

  return (
    <>
      <div className={styles.card}>
        <div className={styles.topSection}>
          <div className={styles.topContent}>
            <h2 className={styles.title}>{hackathon.title}</h2>
            
            <div className={styles.topMeta}>
              <div className={styles.metaRow}>
                <img src={CalendarIcon} alt="Дата" className={styles.metaIcon} />
                <span className={styles.metaText}>
                  {formatDate(hackathon.startDate)}
                  {hackathon.endDate && ` — ${formatDate(hackathon.endDate)}`}
                </span>
              </div>
              
              <div className={styles.metaRow}>
                <img src={LocationIcon} alt="Место" className={styles.metaIcon} />
                <span className={styles.metaText}>{hackathon.location}</span>
                <span className={styles.formatBadge}>{formatText}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <p className={styles.description}>{hackathon.description}</p>
        </div>

        <div className={styles.statsRow}>
          {hackathon.prize && (
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{hackathon.prize}</span>
              <span className={styles.statLabel}>Призовой фонд</span>
            </div>
          )}
          
          {hackathon.duration && (
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{hackathon.duration}</span>
              <span className={styles.statLabel}>Длительность</span>
            </div>
          )}
        </div>

        <div className={styles.divider} />
        {hackathon.directions && hackathon.directions.length > 0 && (
          <div className={styles.skillsSection}>
            <h3 className={styles.skillsTitle}>Требуемые навыки</h3>
            <div className={styles.skillsContainer}>
              {hackathon.directions.map((dir) => (
                <span key={dir} className={styles.skillOval}>
                  {dir}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className={styles.bottomSection}>
          <div className={styles.statusContainer}>
            <div className={styles.statusRow}>
              <span className={styles.statusLabel}>Статус:</span>
              <span 
                className={styles.statusValue}
                style={{ color: statusInfo.color }}
              >
                {statusInfo.text}
              </span>
            </div>
            
            {statusInfo.text === "Регистрация открыта" && (
              <div className={styles.deadlineInfo}>
                <span className={styles.deadlineLabel}>Закрытие через:</span>
                <span className={styles.deadlineValue}>3 дня</span>
              </div>
            )}
          </div>
          
          {isRegistered ? (
            <div className={styles.registeredBadge}>
              Вы зарегистрированы
            </div>
          ) : (
            <button
              className={styles.participateButton}
              onClick={handleRegisterClick}
              disabled={!statusInfo.canRegister}
            >
              УЧАСТВОВАТЬ
            </button>
          )}
        </div>
      </div>

      <TeamRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTeamRegistration}
      />
    </>
  );
};

export default HackathonCard;