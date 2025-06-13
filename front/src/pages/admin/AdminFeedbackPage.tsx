import React, { useEffect, useState } from 'react';
import './AdminFeedbackPage.scss';

interface Feedback {
    id: number;
    full_name: string;
    email: string;
    message: string;
    additinoal_information: string;
    created_at: string;
}

const AdminFeedbackPage: React.FC = () => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [orderBy, setOrderBy] = useState<'created_at' | '-created_at'>('-created_at');
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const limit = 100;

    const fetchFeedbacks = async (reset = false) => {
        if(reset) setPage(0);
        if(reset) setLoading(true);
        else setLoadingMore(true);

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://127.0.0.1:1111/admin/feedbacks/?order_by=${orderBy}&offset=${reset ? 0 : page * limit}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Ошибка при загрузке обратной связи');
            const data = await res.json();

            if (reset) setFeedbacks(data);
            else setFeedbacks(prev => [...prev, ...data]);

            setError(null);
            if(reset) setPage(1);
            else setPage(prev => prev + 1);
        } catch (e) {
            setError((e as Error).message);
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

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы действительно хотите удалить эту обратную связь?')) return;

        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`http://127.0.0.1:1111/admin/feedbacks/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error('Ошибка при удалении');

            setFeedbacks(prev => prev.filter(f => f.id !== id));
        } catch (e) {
            alert((e as Error).message);
        }
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
                            <div className="feedback-card" key={item.id}>
                                <p><b>Имя:</b> {item.full_name}</p>
                                <p><b>Email:</b> {item.email}</p>
                                <div className="feedback-text">{item.message}</div>
                                {item.additinoal_information && (
                                    <div className="additional-info">{item.additinoal_information}</div>
                                )}
                                <p className="feedback-date">{new Date(item.created_at).toLocaleString()}</p>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(item.id)}
                                    title="Удалить обратную связь"
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>

                    {feedbacks.length >= limit * page && (
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
        </div>
    );
};

export default AdminFeedbackPage;
