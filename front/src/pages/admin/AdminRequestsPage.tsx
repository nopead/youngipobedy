import React, { useEffect, useState, useCallback } from 'react';
import SailorRequestCard, { SailorRequest } from '../../components/requests/RequestCard';
import './AdminRequestsPage.scss';

type Tab = 'pending' | 'approved' | 'rejected';

const PAGE_LIMIT = 20;

const AdminRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<SailorRequest[]>([]);
  const [tab, setTab] = useState<Tab>('pending');
  const [search, setSearch] = useState('');
  const [admissions, setAdmissions] = useState<number[]>([]);
  const [orderAsc, setOrderAsc] = useState(false);
  const [offset, setOffset] = useState(0);

  const token = localStorage.getItem('access_token');

  const fetchRequests = useCallback(async () => {
    if (!token) return;

    try {
      const params = new URLSearchParams();
      params.append('limit', PAGE_LIMIT.toString());
      params.append('offset', offset.toString());
      params.append('order_by', orderAsc ? 'created_at' : '-created_at');

      if (search.trim()) {
        params.append('search', search.trim());
      }

      const filters: any = { status: tab };
      if (admissions.length > 0) {
        filters.admission = admissions;
      }
      params.append('filters', JSON.stringify(filters));

      const res = await fetch(`http://127.0.0.1:1111/admin/sailor-create-requests?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Ошибка загрузки заявок');

      const data: SailorRequest[] = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  }, [tab, search, admissions, orderAsc, offset, token]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const toggleAdmission = (num: number) => {
    setAdmissions((prev) =>
      prev.includes(num) ? prev.filter((a) => a !== num) : [...prev, num]
    );
    setOffset(0);
  };

  const handleApprove = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`http://127.0.0.1:1111/admin/sailor-create-requests/approve/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;
    try {
      await fetch(`http://127.0.0.1:1111/admin/sailor-create-requests/reject/${id}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm('Удалить заявку?')) return;
    try {
      await fetch(`http://127.0.0.1:1111/admin/sailor-create-requests/delete/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-requests-page">
      <div className="filters-container">
        <input
          type="search"
          className="search-input"
          placeholder="Поиск..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="checkbox-group">
          {[1, 2, 3].map((num) => (
            <label key={num}>
              <input
                type="checkbox"
                checked={admissions.includes(num)}
                onChange={() => toggleAdmission(num)}
              />
              <span className="checkmark"></span>
              Набор {num}
            </label>
          ))}
        </div>

        <button
          className="sort-button"
          onClick={() => setOrderAsc((prev) => !prev)}
          title="Сортировать по дате создания"
          type="button"
        >
          {orderAsc ? 'Дата создания: по возрастанию' : 'Дата создания: по убыванию'}
        </button>
      </div>

      <div className="tabs-container">
        {(['pending', 'approved', 'rejected'] as Tab[]).map((t) => (
          <button
            key={t}
            className={`tab-btn ${tab === t ? 'tab-btn_active' : ''}`}
            onClick={() => {
              setTab(t);
              setOffset(0);
            }}
            type="button"
          >
            {t === 'pending'
              ? 'Активные'
              : t === 'approved'
                ? 'Одобренные'
                : 'Отклонённые'}
          </button>
        ))}
      </div>

      <div className="cards-grid">
        {requests.length === 0 ? (
          <p className="empty-message">Заявки не найдены</p>
        ) : (
          requests.map((req) => (
            <div key={req.id}>
              <SailorRequestCard
                request={req}
                showButtons={tab === 'pending'}
                onApprove={() => handleApprove(req.id)}
                onReject={() => handleReject(req.id)}
                onDelete={() => handleDelete(req.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminRequestsPage;
