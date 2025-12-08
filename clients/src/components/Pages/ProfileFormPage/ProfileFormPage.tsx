import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/userStore";
import styles from "./ProfileFormPage.module.css";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { currentUser, setUser } = useUserStore();

  const predefinedRoles = [
    "Frontend",
    "Backend",
    "Design",
    "Team Lead",
    "ML/AI",
    "Data Scientist",
    "Product Manager",
    "Бизнес-аналитик",
    "DevOps",
    "QA",
  ];

  const experienceLevels = [
    { value: "beginner", label: "новичок (менее 1 года)" },
    { value: "experienced", label: "есть опыт (1-3 года)" },
    { value: "expert", label: "эксперт (3-5 лет)" },
    { value: "professional", label: "профессионал (5+ лет)" },
  ];

  const predefinedSkills = [
    "React",
    "TypeScript",
    "Python",
    "Node.js",
    "Figma",
    "UI/UX",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "Git",
  ];

  const [name, setName] = useState(currentUser?.fullName || "");
  const [telegram, setTelegram] = useState(currentUser?.telegramId || "");
  const [city, setCity] = useState(currentUser?.city || "");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(currentUser?.role ? [currentUser.role] : []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentUser?.skills || []);
  const [customSkill, setCustomSkill] = useState("");
  const [experience, setExperience] = useState<string>(currentUser?.experience || "");
  const [wins, setWins] = useState(currentUser?.wins?.toString() || "0");
  const [hackathonsCount, setHackathonsCount] = useState(currentUser?.hackathonsCount?.toString() || "0");
  const [bio, setBio] = useState(currentUser?.bio || "");

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills([...selectedSkills, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomSkill();
    }
  };

  const handleSave = () => {
    const isNewUser = !currentUser?.hasFilledProfile;

    const userData = {
      id: currentUser?.id || Date.now().toString(),
      telegramId: telegram || currentUser?.telegramId || "",
      username: currentUser?.username || `@${telegram.replace('@', '')}`,
      fullName: name,
      role: selectedRoles.length > 0 ? selectedRoles[0] : undefined,
      customRole: selectedRoles.join(", "),
      wins: parseInt(wins) || 0,
      hackathonsCount: parseInt(hackathonsCount) || 0,
      bio: bio,
      hasFilledProfile: true,
      skills: selectedSkills,
      city: city,
      experience: experience as 'новичок' | 'есть опыт' | 'эксперт' | 'профессионал' | undefined,
      isPopular: currentUser?.isPopular || false,
    };

    setUser(userData);

    if (isNewUser) {
      navigate("/hackathons");
    } else {
      navigate("/profile");
    }
  };

  return (
    <>
      <div className={styles.logoContainer}>
        <div className={styles.logoBackground}>
          <span className={styles.logoText}>fasteam</span>
        </div>
      </div>
      
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>
            {currentUser?.hasFilledProfile
              ? "Редактировать профиль"
              : "Анкета"}
          </h1>
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>фио</label>
              <input
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ваше имя"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Username Telegram:</label>
              <input
                className={styles.input}
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>город</label>
              <input
                className={styles.input}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="ваш город"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>какую роль ищете в команде?</label>
              <div className={styles.checkboxGrid}>
                {predefinedRoles.map((role) => (
                  <div key={role} className={styles.checkboxItem}>
                    <div className={styles.checkboxWrapper}>
                      <div 
                        className={`${styles.checkboxBox} ${selectedRoles.includes(role) ? styles.active : ''}`}
                        onClick={() => toggleRole(role)}
                      />
                      <span className={styles.checkboxText}>{role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>ваши ключевые навки</label>
              
              <div className={styles.skillsInputGroup}>
                <input
                  className={styles.skillsInput}
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="введите навык, если его нет в списке"
                />
                <button 
                  type="button" 
                  className={styles.addSkillButton}
                  onClick={addCustomSkill}
                >
                  Добавить
                </button>
              </div>

              <div className={styles.selectedSkills}>
                {selectedSkills.map((skill) => (
                  <div key={skill} className={styles.selectedSkill}>
                    {skill}
                    <button 
                      type="button" 
                      className={styles.removeSkillButton}
                      onClick={() => toggleSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.skillsGrid}>
                {predefinedSkills.map((skill) => (
                  <div key={skill} className={styles.skillItem}>
                    <div className={styles.checkboxWrapper}>
                      <div 
                        className={`${styles.checkboxBox} ${selectedSkills.includes(skill) ? styles.active : ''}`}
                        onClick={() => toggleSkill(skill)}
                      />
                      <span className={styles.checkboxText}>{skill}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>уровень опыта</label>
              <div className={styles.radioGrid}>
                {experienceLevels.map((level) => (
                  <div key={level.value} className={styles.radioItem}>
                    <div className={styles.radioWrapper}>
                      <div 
                        className={`${styles.radioCircle} ${experience === level.value ? styles.active : ''}`}
                        onClick={() => setExperience(level.value)}
                      />
                      <span className={styles.radioText}>{level.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.statsRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>побед</label>
                <input
                  className={styles.input}
                  type="text"
                  value={wins}
                  onChange={(e) => setWins(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>хакатонов</label>
                <input
                  className={styles.input}
                  type="text"
                  value={hackathonsCount}
                  onChange={(e) => setHackathonsCount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>*комментарий</label>
              <textarea
                className={styles.textarea}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="расскажите о себе..."
              />
            </div>

            <button className={styles.button} onClick={handleSave}>
              {currentUser?.hasFilledProfile
                ? "Сохранить изменения"
                : "Сохранить"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationPage;