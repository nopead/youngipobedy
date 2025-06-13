import React, { useEffect, useState } from 'react';
import './SailorsPage.scss';
import SailorCard from '../../components/sailors/SailorCard';
import { useDebouncedQuery } from '../../hooks/useDebouncedQuery';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Sailor {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  photo_url: string;
  birth_day: number | null;
  birth_month: number | null;
  birth_year: number | null;
  death_day: number | null;
  death_month: number | null;
  death_year: number | null;
  admission: number;
  biography: string;
}

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
  const query = useDebouncedQuery(search, admissions);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && location.pathname.startsWith('/admin');

  useEffect(() => {
    document.title = title;
  }, []);

  useEffect(() => {
    const fetchSailors = async () => {
      try {
        const params = new URLSearchParams();
        if (query.search) {
          params.append('search', query.search);
        }
        if (query.admissions.length > 0) {
          params.append('filters', JSON.stringify({ admission: query.admissions }));
        }

        const response = await fetch(`http://127.0.0.1:1111/sailors/?${params.toString()}`);
        const data = await response.json();
        setSailors(data);
      } catch (error) {
        console.error('Ошибка загрузки юнг:', error);
      }
    };

    fetchSailors();
  }, [query]);

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
      } else {
        alert('Не удалось удалить юнгу');
      }
    } catch (err) {
      console.error('Ошибка при удалении:', err);
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

      <motion.div
        className="sailor-cards-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sailors.map(sailor => (
          <motion.div key={sailor.id} variants={cardVariants}>
            <SailorCard
              {...sailor}
              onDelete={isAdmin ? handleDelete : undefined}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default SailorsPage;
