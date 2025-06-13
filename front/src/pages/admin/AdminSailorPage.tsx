import React, { useEffect, useState } from 'react';
import '../open/SailorsPage.scss';
import { useDebouncedQuery } from '../../hooks/useDebouncedQuery';
import { motion } from 'framer-motion';

interface Sailor {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  photo_url: string;
  birth_date: string;
  death_date: string;
  admission: number;
  biography: string;
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const AdminSailorsPage = () => {
  const [search, setSearch] = useState('');
  const [admissions, setAdmissions] = useState<number[]>([]);
  const [sailors, setSailors] = useState<Sailor[]>([]);
  const query = useDebouncedQuery(search, admissions);

  useEffect(() => {
    const fetchSailors = async () => {
      try {
        const params = new URLSearchParams();
        params.append('limit', '30');
        params.append('offset', '0');
        if (query.search) params.append('search', query.search);
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
      const confirmed = window.confirm('Вы уверены, что хотите удалить этого юнгу?');
      if (!confirmed) return;

      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://127.0.0.1:1111/admin/sailors/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Ошибка при удалении');

      if (res.ok) {
        setSailors(prev => prev.filter(s => s.id !== id));
      } else {
        console.error('Ошибка удаления');
      }
    } catch (err) {
      console.error(err);
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
          onChange={e => setSearch(e.target.value)}
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdminSailorsPage;
