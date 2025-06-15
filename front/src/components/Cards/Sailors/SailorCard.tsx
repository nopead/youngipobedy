import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './SailorCard.scss';
import { useAuth } from '../../../context/AuthContext';
import ConfirmModal from '../../modals/Confirm/Confirm';
import { getPublicPhotoUrl } from '../../../utils/photoUtils';
import { Sailor } from '../../../types/sailor';

function formatFullDate(day: number | null, month: number | null, year: number | null): string {
  if (!day && !month && !year) return '—';

  const dd = day ? String(day).padStart(2, '0') : '__';
  const mm = month ? String(month).padStart(2, '0') : '__';
  const yyyy = year ? String(year) : '____';

  return `${dd}.${mm}.${yyyy}`;
}

interface SailorCardProps extends Sailor {
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
  const safePhotoUrl = window.location.origin + "/" + getPublicPhotoUrl(photo_url);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const isAdmin = isAuthenticated && location.pathname.startsWith('/admin');

  const [modalVisible, setModalVisible] = useState(false);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalVisible(true);
  };

  const confirmDelete = () => {
    setModalVisible(false);
    onDelete?.(id);
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div
        className="sailor-card"
        onClick={handleClick}
        style={{ cursor: isAdmin ? 'default' : 'pointer' }}
      >
        <img src={`${photo_url}`} alt={`${surname} ${name}`} />
        <div className="sailor-info">
          <div className="sailor-name">{`${surname} ${name} ${patronymic}`}</div>
          <div className="sailor-dates">
            {formatFullDate(birth_day, birth_month, birth_year)} — {formatFullDate(death_day, death_month, death_year)}
          </div>
          <div className="sailor-admission">Набор {admission}</div>
          {isAdmin && (
            <div className="admin-buttons">
              <button onClick={handleEdit}>Редактировать</button>
              <button className="danger" onClick={handleDeleteClick}>Удалить</button>
            </div>
          )}
        </div>
      </div>

      {modalVisible && (
        <ConfirmModal
          message={`Удалить моряка ${surname} ${name}?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText="Удалить"
          cancelText="Отмена"
        />
      )}
    </>
  );
};

export default SailorCard;
