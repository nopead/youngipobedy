import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Biography.scss';

function formatFullDate(day: number | null, month: number | null, year: number | null): string {
    if (!day && !month && !year) return '—';
    const dd = day ? String(day).padStart(2, '0') : '__';
    const mm = month ? String(month).padStart(2, '0') : '__';
    const yyyy = year ? String(year) : '____';
    return `${dd}.${mm}.${yyyy}`;
}

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

const BiographyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const stateSailor = location.state as Sailor | undefined;

    const [sailor, setSailor] = useState<Sailor | null>(stateSailor || null);
    const [loading, setLoading] = useState(!stateSailor);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sailor && id) {
            setLoading(true);
            fetch(`http://51.250.27.60/api/sailors/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Ошибка загрузки данных моряка');
                    return res.json();
                })
                .then(data => {
                    setSailor(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [id, sailor]);

    useEffect(() => {
        if (sailor?.name && sailor.surname && sailor.patronymic) {
            document.title = `${sailor.surname} ${sailor.name} ${sailor.patronymic}`;
        }
    }, [sailor]);

    if (loading) return <div className="biography-page">Загрузка...</div>;
    if (error) return <div className="biography-page">Ошибка: {error}</div>;
    if (!sailor) return <div className="biography-page">Данные не найдены</div>;
 
    const birthDate = formatFullDate(sailor.birth_day, sailor.birth_month, sailor.birth_year);
    const deathDate = formatFullDate(sailor.death_day, sailor.death_month, sailor.death_year);

    return (
        <div className="biography-page">
            <div className="biography-container">
                <img
                    className="biography-photo"
                    src={`${sailor.photo_url}`}
                    alt={`${sailor.surname} ${sailor.name}`}
                />
                <div className="biography-main-info">
                    <h1 className="biography-name">
                        {`${sailor.surname} ${sailor.name} ${sailor.patronymic}`}
                    </h1>
                    <p className="biography-dates">{`${birthDate} — ${deathDate}`}</p>
                    <p className="biography-admission">Набор: {sailor.admission}</p>
                </div>
            </div>

            <div className="biography-text">
                <h2>Биография</h2>
                <p>{sailor.biography}</p>
            </div>
        </div>
    );
};

export default BiographyPage;
