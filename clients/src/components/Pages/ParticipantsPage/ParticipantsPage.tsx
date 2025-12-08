import { useState } from "react";
import UserCard from "../../../components/features/UserCard/UserCard";
import styles from "./ParticipantsPage.module.css";
import FilterIcon from "../../../assets/icons/filter.svg";
import CalendarIcon from "../../../assets/icons/calendar.svg";
import LocationIcon from "../../../assets/icons/Place.svg";

const ParticipantsPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("any");
  const [selectedExperience, setSelectedExperience] = useState<string>("any");
  const [popularOnly, setPopularOnly] = useState(false);
  const [closingSoon, setClosingSoon] = useState(false);
  const [withPrize, setWithPrize] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mockUsers = [
    {
      id: "1",
      telegramId: "@kirillbledny",
      username: "kirillbledny",
      fullName: "Кирилл Бледный",
      role: "Design",
      customRole: "Design Lead",
      wins: 3,
      hackathonsCount: 12,
      bio: "Дизайнер с 5-летним опытом, специализируюсь на UX/UI для финтех проектов",
      skills: [
        "Figma",
        "Adobe XD",
        "UI/UX Design",
        "Prototyping",
        "User Research",
      ],
      hasFilledProfile: true,
      city: "Москва",
      experience: "эксперт" as const,
      isPopular: true,
    },
    {
      id: "2",
      telegramId: "@frontend_master",
      username: "frontend_master",
      fullName: "Мария Иванова",
      role: "Frontend",
      customRole: "Senior Frontend",
      wins: 2,
      hackathonsCount: 8,
      bio: "Frontend разработчик на React, опыт создания сложных SPA приложений",
      skills: ["React", "TypeScript", "Next.js", "Tailwind", "Redux"],
      hasFilledProfile: true,
      city: "Санкт-Петербург",
      experience: "есть опыт" as const,
      isPopular: true,
    },
    {
      id: "3",
      telegramId: "@backend_dev",
      username: "backend_dev",
      fullName: "Александр Петров",
      role: "Backend",
      customRole: "Junior Backend",
      wins: 0,
      hackathonsCount: 1,
      bio: "Начинающий backend разработчик, изучаю Node.js и MongoDB",
      skills: ["Node.js", "MongoDB", "Express", "JavaScript"],
      hasFilledProfile: true,
      city: "Новосибирск",
      experience: "новичок" as const,
      isPopular: false,
    },
  ];

  const roles = [
    "Design",
    "Frontend",
    "Backend",
    "Team Lead",
    "ML/AI",
    "GA",
    "DevOps",
  ];
  const dateRanges = [
    { value: "all", label: "все даты" },
    { value: "week", label: "на этой неделе" },
    { value: "month", label: "в этом месяце" },
  ];
  const cities = [
    { value: "any", label: "любой" },
    { value: "spb", label: "спб" },
    { value: "moscow", label: "москва" },
    { value: "remote", label: "удаленно" },
  ];
  const experienceLevels = [
    { value: "any", label: "любой" },
    { value: "beginner", label: "новичок" },
    { value: "experienced", label: "есть опыт" },
    { value: "expert", label: "эксперт" },
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const clearAllFilters = () => {
    setSelectedRoles([]);
    setSelectedDateRange("all");
    setSelectedCity("any");
    setSelectedExperience("any");
    setPopularOnly(false);
    setClosingSoon(false);
    setWithPrize(false);
    setSearchQuery("");
  };

  const filteredUsers = mockUsers.filter((user) => {
    if (!user.hasFilledProfile) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const fullName = user.fullName?.toLowerCase() || "";
      const username = user.username.toLowerCase();
      const bio = user.bio?.toLowerCase() || "";

      if (
        !fullName.includes(query) &&
        !username.includes(query) &&
        !bio.includes(query)
      ) {
        return false;
      }
    }

    if (selectedRoles.length > 0) {
      const userRole =
        user.role?.toLowerCase() || user.customRole?.toLowerCase() || "";
      if (
        !selectedRoles.some((role) => userRole.includes(role.toLowerCase()))
      ) {
        return false;
      }
    }

    if (selectedCity !== "any") {
      if (selectedCity === "remote" && user.city) return false;
      if (selectedCity === "spb" && user.city !== "Санкт-Петербург")
        return false;
      if (selectedCity === "moscow" && user.city !== "Москва") return false;
    }

    if (selectedExperience !== "any") {
      const userExp = user.experience || "";
      switch (selectedExperience) {
        case "beginner":
          if (userExp !== "новичок") return false;
          break;
        case "experienced":
          if (userExp !== "есть опыт") return false;
          break;
        case "expert":
          if (userExp !== "эксперт") return false;
          break;
      }
    }

    if (popularOnly && !user.isPopular) {
      return false;
    }

    return true;
  });

  const handleInvite = (userId: string) => {
    console.log(`Приглашение отправлено пользователю ${userId}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>найти участника</h1>

        <button
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <img src={FilterIcon} alt="Фильтры" className={styles.filterIcon} />
          Фильтры
          {(selectedRoles.length > 0 ||
            selectedDateRange !== "all" ||
            selectedCity !== "any" ||
            selectedExperience !== "any" ||
            popularOnly ||
            closingSoon ||
            withPrize) && (
            <span className={styles.filterCount}>
              {selectedRoles.length +
                (selectedDateRange !== "all" ? 1 : 0) +
                (selectedCity !== "any" ? 1 : 0) +
                (selectedExperience !== "any" ? 1 : 0) +
                (popularOnly ? 1 : 0) +
                (closingSoon ? 1 : 0) +
                (withPrize ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="Поиск по имени или навыкам..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {showFilters && (
        <div className={styles.filtersBlock}>
          <div className={styles.filtersHeader}>
            <h3 className={styles.filtersTitle}>Фильтры</h3>
            <button className={styles.clearButton} onClick={clearAllFilters}>
              Очистить все
            </button>
          </div>

          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>роли</div>
              <div className={styles.rolesGrid}>
                {roles.map((role) => (
                  <button
                    key={role}
                    className={`${styles.roleButton} ${
                      selectedRoles.includes(role)
                        ? styles.roleButtonActive
                        : ""
                    }`}
                    onClick={() => toggleRole(role)}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>
                <img
                  src={CalendarIcon}
                  alt=""
                  className={styles.filterIconSmall}
                />
                даты проведения
              </div>
              <div className={styles.filterOptions}>
                {dateRanges.map((range) => (
                  <button
                    key={range.value}
                    className={`${styles.filterOption} ${
                      selectedDateRange === range.value
                        ? styles.filterOptionActive
                        : ""
                    }`}
                    onClick={() => setSelectedDateRange(range.value)}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterDivider} />

            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>
                <img
                  src={LocationIcon}
                  alt=""
                  className={styles.filterIconSmall}
                />
                город
              </div>
              <div className={styles.filterOptions}>
                {cities.map((city) => (
                  <button
                    key={city.value}
                    className={`${styles.filterOption} ${
                      selectedCity === city.value
                        ? styles.filterOptionActive
                        : ""
                    }`}
                    onClick={() => setSelectedCity(city.value)}
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterDivider} />

            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>опыт</div>
              <div className={styles.filterOptions}>
                {experienceLevels.map((level) => (
                  <button
                    key={level.value}
                    className={`${styles.filterOption} ${
                      selectedExperience === level.value
                        ? styles.filterOptionActive
                        : ""
                    }`}
                    onClick={() => setSelectedExperience(level.value)}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterDivider} />

            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>популярные</div>
              <div className={styles.checkboxFilters}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={popularOnly}
                    onChange={(e) => setPopularOnly(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxLabel}>популярные</span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={closingSoon}
                    onChange={(e) => setClosingSoon(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxLabel}>
                    регистрация скоро закроется
                  </span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={withPrize}
                    onChange={(e) => setWithPrize(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxLabel}>
                    с призовым фондом
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.resultsInfo}>
        {filteredUsers.length === 0 && (
          <button className={styles.resetButton} onClick={clearAllFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>

      <div className={styles.participantsGrid}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onInvite={handleInvite} />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>Нет участников, соответствующих выбранным фильтрам</p>
            <button
              className={styles.noResultsButton}
              onClick={clearAllFilters}
            >
              Показать всех участников
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipantsPage;
