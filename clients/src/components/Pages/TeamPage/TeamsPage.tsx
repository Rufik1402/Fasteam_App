import { useState } from "react";
import TeamPageCard from "../../../components/features/TeamPageCard/TeamPageCard";
import { fakeHackathons } from "../../../data/mockData";
import styles from "./TeamPage.module.css";

const TeamPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<string>("all");
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>("any");
  const [selectedLevel, setSelectedLevel] = useState<string>("any");
  const [popularOnly, setPopularOnly] = useState(false);
  const [closingSoon, setClosingSoon] = useState(false);
  const [withPrize, setWithPrize] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const mockTeams = [
    {
      id: "1",
      name: "AI Masters",
      hackathonId: "1",
      hackathonName: "AI Challenge 2024",
      captainId: "1",
      members: [
        {
          id: "1",
          userId: "1",
          username: "kirill",
          fullName: "Кирилл",
          role: "Design",
          isCaptain: true,
        },
        {
          id: "2",
          userId: "2",
          username: "alex",
          fullName: "Алексей",
          role: "Backend",
          isCaptain: false,
        },
        {
          id: "3",
          userId: "3",
          username: "maria",
          fullName: "Мария",
          role: "Frontend",
          isCaptain: false,
        },
      ],
      maxMembers: 5,
      vacancies: ["Design", "Backend"],
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "FinTech Warriors",
      hackathonId: "2",
      hackathonName: "FinTech Hack",
      captainId: "2",
      members: [
        {
          id: "4",
          userId: "4",
          username: "ivan",
          fullName: "Иван",
          role: "Frontend",
          isCaptain: true,
        },
        {
          id: "5",
          userId: "5",
          username: "anna",
          fullName: "Анна",
          role: "ML/AI",
          isCaptain: false,
        },
      ],
      maxMembers: 6,
      vacancies: ["Frontend", "Team Lead", "ML/AI"],
      createdAt: new Date(),
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
  const teamSizes = [
    { value: "any", label: "любой" },
    { value: "small", label: "малый (2-3)" },
    { value: "medium", label: "средний (4-6)" },
    { value: "large", label: "большой (6+)" },
  ];
  const levels = [
    { value: "any", label: "любой" },
    { value: "beginners", label: "новички" },
    { value: "experienced", label: "есть опыт" },
    { value: "experts", label: "эксперты" },
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const clearAllFilters = () => {
    setSelectedRoles([]);
    setSelectedDateRange("all");
    setSelectedTeamSize("any");
    setSelectedLevel("any");
    setPopularOnly(false);
    setClosingSoon(false);
    setWithPrize(false);
    setSearchQuery("");
  };

  const filteredTeams = mockTeams.filter((team) => {
    const hackathon = fakeHackathons.find((h) => h.id === team.hackathonId);

    if (!hackathon) return false;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const teamName = team.name.toLowerCase();
      const hackathonName = hackathon.title.toLowerCase();

      if (!teamName.includes(query) && !hackathonName.includes(query)) {
        return false;
      }
    }

    if (selectedRoles.length > 0) {
      const hasMatchingRole = selectedRoles.some((role) =>
        team.vacancies.some((vacancy) =>
          vacancy.toLowerCase().includes(role.toLowerCase())
        )
      );
      if (!hasMatchingRole) return false;
    }

    if (selectedTeamSize !== "any") {
      const teamSize = team.members.length;
      switch (selectedTeamSize) {
        case "small":
          if (teamSize < 2 || teamSize > 3) return false;
          break;
        case "medium":
          if (teamSize < 4 || teamSize > 6) return false;
          break;
        case "large":
          if (teamSize < 7) return false;
          break;
      }
    }

    return true;
  });

  const handleApply = (teamId: string) => {
    console.log(`Заявка отправлена в команду ${teamId}`);
  };

  const getHackathonForTeam = (team: (typeof mockTeams)[0]) => {
    return (
      fakeHackathons.find((h) => h.id === team.hackathonId) || fakeHackathons[0]
    );
  };
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>найти команду</h1>

        <button
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          Фильтры
          {(selectedRoles.length > 0 ||
            selectedDateRange !== "all" ||
            selectedTeamSize !== "any" ||
            selectedLevel !== "any" ||
            popularOnly ||
            closingSoon ||
            withPrize) && (
            <span className={styles.filterCount}>
              {selectedRoles.length +
                (selectedDateRange !== "all" ? 1 : 0) +
                (selectedTeamSize !== "any" ? 1 : 0) +
                (selectedLevel !== "any" ? 1 : 0) +
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
          placeholder="Поиск по названию команды или хакатону..."
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
              <div className={styles.filterGroupTitle}>ИЩУТ РОЛИ</div>
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
              <div className={styles.filterGroupTitle}>ДАТЫ ПРОВЕДЕНИЯ</div>
              <div className={styles.filterOptions}>
                <button
                  className={`${styles.filterOption} ${
                    selectedDateRange === "all" ? styles.filterOptionActive : ""
                  }`}
                  onClick={() => setSelectedDateRange("all")}
                >
                  все даты
                </button>
                {dateRanges.slice(1).map((range) => (
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
              <div className={styles.dateCustom}>
              </div>
            </div>

            <div className={styles.filterDivider} />

            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Размер команды</div>
              <div className={styles.filterOptions}>
                {teamSizes.map((size) => (
                  <button
                    key={size.value}
                    className={`${styles.filterOption} ${
                      selectedTeamSize === size.value
                        ? styles.filterOptionActive
                        : ""
                    }`}
                    onClick={() => setSelectedTeamSize(size.value)}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterDivider} />

            <div className={styles.filterGroup}>
              <div className={styles.filterGroupTitle}>Уровень</div>
              <div className={styles.filterOptions}>
                {levels.map((level) => (
                  <button
                    key={level.value}
                    className={`${styles.filterOption} ${
                      selectedLevel === level.value
                        ? styles.filterOptionActive
                        : ""
                    }`}
                    onClick={() => setSelectedLevel(level.value)}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.filterDivider} />

            <div className={styles.filterGroup}>
              <div className={styles.checkboxFilters}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={popularOnly}
                    onChange={(e) => setPopularOnly(e.target.checked)}
                    className={styles.checkboxInput}
                  />
                  <span className={styles.checkboxLabel}>Популярные</span>
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
        <span className={styles.resultsCount}>
          Найдено команд: {filteredTeams.length}
        </span>
        {filteredTeams.length === 0 && (
          <button className={styles.resetButton} onClick={clearAllFilters}>
            Сбросить фильтры
          </button>
        )}
      </div>

      <div className={styles.teamsGrid}>
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <TeamPageCard
              key={team.id}
              team={team}
              hackathon={getHackathonForTeam(team)}
              onApply={() => handleApply(team.id)}
            />
          ))
        ) : (
          <div className={styles.noResults}>
            <p>Нет команд, соответствующих выбранным фильтрам</p>
            <button
              className={styles.noResultsButton}
              onClick={clearAllFilters}
            >
              Показать все команды
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;
