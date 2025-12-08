import { useState, useMemo, useEffect } from 'react';
import HackathonCard from '../../features/HackathonCard/HackathonCard';
import styles from './HackathonPage.module.css';
import FilterIcon from '../../../assets/icons/filter.svg';
import { eventsApi } from '../../../api';
import type { Hackathon } from '../../../types';

const HackathonsPage = () => {
  const [activeTab, setActiveTab] = useState<'все' | 'популярные' | 'регистрация скоро закроется'>('все');
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [onlyWithPrize, setOnlyWithPrize] = useState(false);
  const [closingSoon, setClosingSoon] = useState(false);
  const [popularOnly, setPopularOnly] = useState(false);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const events = await eventsApi.getEvents();
        const mapped: Hackathon[] = events.map((e) => ({
          id: String(e.id),
          title: e.name,
          description: e.description ?? '',
          startDate: e.startTime,
          endDate: e.endTime,
          location: 'онлайн',
          isActive: true,
          registrationDeadline: e.endTime,
        }));
        setHackathons(mapped);
      } catch (err) {
        console.error('Не удалось загрузить хакатоны', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const roles = [    
    "Design",
    "Frontend",
    "Backend",
    "Team Lead",
    "ML/AI",
    "QA",
    "DevOps"
  ];
  
  const formats = [
    { value: 'онлайн', label: 'онлайн' },
    { value: 'офлайн', label: 'офлайн' },
    { value: 'гибрид', label: 'гибридный' }
  ];
  
  const dateRanges = [
    { value: '', label: 'все даты' },
    { value: 'week', label: 'на этой неделе' },
    { value: 'month', label: 'в этом месяце' }
  ];

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const clearAllFilters = () => {
    setSelectedRoles([]);
    setSelectedFormat('');
    setSelectedLevel('');
    setSelectedDateRange('');
    setOnlyWithPrize(false);
    setClosingSoon(false);
    setPopularOnly(false);
  };

  const getActiveFiltersCount = () => {
    return selectedRoles.length + 
      (selectedFormat ? 1 : 0) + 
      (selectedLevel ? 1 : 0) +
      (selectedDateRange ? 1 : 0) + 
      (onlyWithPrize ? 1 : 0) + 
      (closingSoon ? 1 : 0) +
      (popularOnly ? 1 : 0);
  };

  const filteredHackathons = useMemo(() => {
    return hackathons.filter(hackathon => {
      if (!hackathon.isActive) return false;
      
      if (activeTab === 'популярные' && hackathon.participants && hackathon.participants < 100) {
        return false;
      }
      
      if (activeTab === 'регистрация скоро закроется') {
        if (!hackathon.registrationDeadline) return false;
        const now = new Date();
        const deadline = new Date(hackathon.registrationDeadline);
        const diffHours = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
        if (diffHours > 72) return false;
      }
      if (selectedRoles.length > 0 && hackathon.directions) {
        const hasMatchingRole = selectedRoles.some(role => 
          hackathon.directions?.some(dir => 
            dir.toLowerCase().includes(role.toLowerCase())
          )
        );
        if (!hasMatchingRole) return false;
      }
      if (selectedFormat && hackathon.format !== selectedFormat) {
        return false;
      }

      if (selectedDateRange) {
        const now = new Date();
        const hackathonDate = new Date(hackathon.startDate);
        const diffDays = Math.ceil((hackathonDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (selectedDateRange) {
          case 'week':
            if (diffDays > 7) return false;
            break;
          case 'month':
            if (diffDays > 30) return false;
            break;
        }
      }
      if (onlyWithPrize && !hackathon.prize) {
        return false;
      }
      if (closingSoon && hackathon.registrationDeadline) {
        const now = new Date();
        const deadline = new Date(hackathon.registrationDeadline);
        const diffHours = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60));
        if (diffHours > 72) return false;
      }

      if (popularOnly && hackathon.participants && hackathon.participants < 100) {
        return false;
      }

      return true;
    });
  }, [activeTab, selectedRoles, selectedFormat, selectedDateRange, onlyWithPrize, closingSoon, popularOnly]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'все' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('все')}
          >
            все
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'популярные' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('популярные')}
          >
            популярные
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'регистрация скоро закроется' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('регистрация скоро закроется')}
          >
            регистрация скоро закроется
          </button>
        </div>

        <button 
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <img src={FilterIcon} alt="Фильтры" className={styles.filterIcon} />
          Фильтры
          {getActiveFiltersCount() > 0 && (
            <span className={styles.filterCount}>
              {getActiveFiltersCount()}
            </span>
          )}
        </button>
      </div>

      {showFilters && (
        <div className={styles.filtersBlock}>
          <div className={styles.filtersHeader}>
            <h3 className={styles.filtersTitle}>Фильтры</h3>
            <button 
              className={styles.clearButton}
              onClick={clearAllFilters}
            >
              Очистить все
            </button>
          </div>
          
          <div className={styles.filtersContent}>
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>роли</h4>
              <div className={styles.rolesGrid}>
                {roles.map(role => (
                  <button
                    key={role}
                    className={`${styles.roleButton} ${selectedRoles.includes(role) ? styles.roleButtonActive : ''}`}
                    onClick={() => toggleRole(role)}
                  >
                    <div className={styles.roleButtonWrapper}>
                      <div className={styles.roleCheckbox}></div>
                      <span className={styles.roleText}>{role}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>формат</h4>
              <div className={styles.formatGrid}>
                <button
                  className={`${styles.formatButton} ${!selectedFormat ? styles.formatButtonActive : ''}`}
                  onClick={() => setSelectedFormat('')}
                >
                  <div className={styles.formatButtonWrapper}>
                    <div className={styles.formatRadio}></div>
                    <span className={styles.formatText}>все форматы</span>
                  </div>
                </button>
                {formats.map(format => (
                  <button
                    key={format.value}
                    className={`${styles.formatButton} ${selectedFormat === format.value ? styles.formatButtonActive : ''}`}
                    onClick={() => setSelectedFormat(format.value)}
                  >
                    <div className={styles.formatButtonWrapper}>
                      <div className={styles.formatRadio}></div>
                      <span className={styles.formatText}>{format.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.filterSection}>
              <h4 className={styles.filterSectionTitle}>даты проведения</h4>
              <div className={styles.dateGrid}>
                {dateRanges.map(range => (
                  <button
                    key={range.value}
                    className={`${styles.dateButton} ${selectedDateRange === range.value ? styles.dateButtonActive : ''}`}
                    onClick={() => setSelectedDateRange(range.value)}
                  >
                    <div className={styles.dateButtonWrapper}>
                      <div className={styles.dateRadio}></div>
                      <span className={styles.dateText}>{range.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.resultsInfo}>
        <span className={styles.resultsCount}>
          Найдено хакатонов: {filteredHackathons.length}
        </span>
        {getActiveFiltersCount() > 0 && (
          <button 
            className={styles.resetButton}
            onClick={clearAllFilters}
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      {loading && <div className={styles.resultsCount}>Загрузка...</div>}
      <div className={styles.hackathonsList}>
        {!loading && filteredHackathons.length > 0 ? (
          filteredHackathons.map(hackathon => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} />
          ))
        ) : (
          !loading && (
            <div className={styles.noResults}>
              <p>Нет хакатонов, соответствующих выбранным фильтрам</p>
              <button 
                className={styles.noResultsButton}
                onClick={clearAllFilters}
              >
                Показать все хакатоны
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HackathonsPage;