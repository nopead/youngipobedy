import React, { useEffect, useState } from 'react';
import FeedbackCard from '../../../components/Cards/Feedbacks/Feedback';
import { Feedback } from '../../../types/feedback';
import { useToast } from '../../../context/ToastContext';
import ConfirmModal from '../../../components/modals/Confirm/Confirm';
import './Feedbacks.scss';

const LIMIT = 100;

const AdminFeedbackPage: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [orderBy, setOrderBy] = useState<'created_at' | '-created_at'>('-created_at');
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { showToast } = useToast();

  const fetchFeedbacks = async (reset = false) => {
    if (reset) {
      setPage(0);
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const token = localStorage.getItem('access_token');
      const offset = reset ? 0 : page * LIMIT;

      const response = await fetch(
        `http://127.0.0.1:1111/admin/feedbacks/?order_by=${orderBy}&offset=${offset}&limit=${LIMIT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Ошибка при загрузке обратной связи');

      const data: Feedback[] = await response.json();
      setFeedbacks(prev => (reset ? data : [...prev, ...data]));
      setError(null);
      setPage(prev => (reset ? 1 : prev + 1));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks(true);
  }, [orderBy]);

  const toggleSortOrder = () => {
    setOrderBy(prev => (prev === '-created_at' ? 'created_at' : '-created_at'));
  };

  const onDeleteClick = (id: number) => {
    setDeleteId(id);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(
        `http://127.0.0.1:1111/admin/feedbacks/delete/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Ошибка при удалении');

      setFeedbacks(prev => prev.filter(f => f.id !== deleteId));
      showToast('Обратная связь успешно удалена', 'success');
    } catch (err) {
      showToast((err as Error).message, 'error');
    } finally {
      setDeleteId(null);
      setModalVisible(false);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setModalVisible(false);
  };

  return (
    <div className="admin-feedback-page">
      <div className="header-row">
        <h1>Обратная связь</h1>
        <button onClick={toggleSortOrder} className="sort-button">
          Сортировать по дате: {orderBy === '-created_at' ? '↓' : '↑'}
        </button>
      </div>

      {loading ? (
        <p className="loading">Загрузка...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="feedback-list">
            {feedbacks.map(item => (
              <FeedbackCard key={item.id} item={item} onDeleteClick={onDeleteClick} />
            ))}
          </div>

          {feedbacks.length >= LIMIT * page && (
            <button
              onClick={() => fetchFeedbacks(false)}
              className="load-more-button"
              disabled={loadingMore}
            >
              {loadingMore ? 'Загрузка...' : 'Показать ещё'}
            </button>
          )}
        </>
      )}

      {modalVisible && (
        <ConfirmModal
          message="Вы действительно хотите удалить эту обратную связь?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          confirmText="Удалить"
          cancelText="Отмена"
        />
      )}
    </div>
  );
};

export default AdminFeedbackPage;
