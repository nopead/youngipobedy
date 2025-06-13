import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SailorCard.scss';
import { useAuth } from '../../context/AuthContext';

export function getPublicPhotoUrl(fullPath: string): string {
  const publicIndex = fullPath.indexOf('public');
  if (publicIndex === -1) return fullPath;
  const relativePath = fullPath.substring(publicIndex + 6).replace(/\\/g, '/');
  return relativePath.startsWith('/') ? relativePath : '/' + relativePath;
}

function formatFullDate(day: number | null, month: number | null, year: number | null): string {
  if (!day && !month && !year) return '—';

  const dd = day ? String(day).padStart(2, '0') : '__';
  const mm = month ? String(month).padStart(2, '0') : '__';
  const yyyy = year ? String(year) : '____';

  return `${dd}.${mm}.${yyyy}`;
}

interface SailorCardProps {
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
  onDelete?: (id: string) => void;
}

const SailorCard: React.FC<SailorCardProps> = ({
  id,
  name,
  surname,
  patronymic,
  photo_url,
  birth_day,
  birth_month,
  birth_year,
  death_day,
  death_month,
  death_year,
  admission,
  biography,
  onDelete,
}) => {
  const safePhotoUrl = getPublicPhotoUrl(photo_url);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && location.pathname.startsWith('/admin');

  const handleClick = () => {
    if (isAdmin) return;
    navigate(`/biography/${id}`, {
      state: {
        id,
        name,
        surname,
        patronymic,
        photo_url,
        birth_day,
        birth_month,
        birth_year,
        death_day,
        death_month,
        death_year,
        admission,
        biography,
      },
    });
  };

  const handleEdit = () => {
    navigate(`/admin/sailors/edit/${id}`);
  };

  const handleDelete = () => {
    if (window.confirm(`Удалить моряка ${surname} ${name}?`)) {
      onDelete?.(id);
    }
  };

  return (
    <div
      className="sailor-card"
      onClick={handleClick}
      style={{ cursor: isAdmin ? 'default' : 'pointer' }}
    >
      <img src={safePhotoUrl} alt={`${surname} ${name}`} />
      <div className="sailor-info">
        <div className="sailor-name">{`${surname} ${name} ${patronymic}`}</div>
        <div className="sailor-dates">
          {formatFullDate(birth_day, birth_month, birth_year)} — {formatFullDate(death_day, death_month, death_year)}
        </div>
        <div className="sailor-admission">Набор {admission}</div>
        {isAdmin && (
          <div className="admin-buttons">
            <button onClick={handleEdit}>Редактировать</button>
            <button className="danger" onClick={handleDelete}>Удалить</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SailorCard;
