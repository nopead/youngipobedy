import React, { useEffect, useState } from 'react';
import './Sailors.scss';
import SailorCard from '../../../components/Cards/Sailors/SailorCard';
import { useDebouncedQuery } from '../../../hooks/useDebouncedQuery';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Sailor } from '../../../types/sailor';
import { useToast } from '../../../context/ToastContext';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const SailorsPage = () => {
  const title = 'Юнги';
  const [search, setSearch] = useState('');
  const [admissions, setAdmissions] = useState<number[]>([]);
  const [sailors, setSailors] = useState<Sailor[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const query = useDebouncedQuery(search, admissions);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && location.pathname.startsWith('/admin');
  const { showToast } = useToast();

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    const fetchSailors = async () => {
      setLoading(true);
      setLoadingError(null);
      try {
        const params = new URLSearchParams();
        if (query.search) {
          params.append('search', query.search);
        }
        if (query.admissions.length > 0) {
          params.append('filters', JSON.stringify({ admission: query.admissions }));
        }

        const response = await fetch(`http://127.0.0.1:1111/sailors/?${params.toString()}`);

        if (!response.ok) {
          let errorMsg = `Ошибка загрузки юнг. Код ошибки: ${response.status}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMsg = `Ошибка загрузки юнг: ${errorData.message}`;
            }
          } catch {}
          setLoadingError(errorMsg);
          showToast(errorMsg, 'error');
          setSailors([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setSailors(data);
        setLoading(false);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? `Ошибка загрузки юнг: ${error.message}` : 'Ошибка загрузки юнг';
        setLoadingError(errorMsg);
        setSailors([]);
        showToast(errorMsg, 'error');
        setLoading(false);
      }
    };

    fetchSailors();
  }, [query, showToast]);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://127.0.0.1:1111/admin/sailors/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setSailors(prev => prev.filter(sailor => sailor.id !== id));
        showToast('Юнга успешно удалён', 'success');
      } else if (res.status === 429) {
        showToast('Слишком много запросов, попробуйте позже', 'info');
      } else {
        showToast('Не удалось удалить юнгу', 'error');
      }
    } catch (err) {
      showToast('Ошибка при удалении', 'error');
    }
  };

  return (
    <div className="sailor-page">
      <div className="filters-container">
        <input
          type="text"
          className="search-input"
          placeholder="Поиск по фамилии, имени или описанию"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="checkbox-group">
          {[1, 2, 3].map(setNumber => (
            <label key={setNumber}>
              <input
                type="checkbox"
                checked={admissions.includes(setNumber)}
                onChange={() =>
                  setAdmissions(prev =>
                    prev.includes(setNumber)
                      ? prev.filter(n => n !== setNumber)
                      : [...prev, setNumber]
                  )
                }
              />
              <span className="checkmark"></span>
              Набор {setNumber}
            </label>
          ))}
        </div>
      </div>

      {loading && <p className="loading-text">Загрузка...</p>}

      {loadingError && <p className="error-text">{loadingError}</p>}

      {!loading && !loadingError && sailors.length === 0 && (
        <p className="no-results-text">По вашему запросу ничего не найдено.</p>
      )}

      <motion.div
        className="sailor-cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {!loading && !loadingError &&
          sailors.map(sailor => (
            <motion.div key={sailor.id} variants={cardVariants}>
              <SailorCard {...sailor} onDelete={isAdmin ? handleDelete : undefined} />
            </motion.div>
          ))}
      </motion.div>
    </div>
  );
};

export default SailorsPage;
