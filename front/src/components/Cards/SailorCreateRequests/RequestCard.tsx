import React, { useState } from 'react';
import './RequestCard.scss';
import { SailorRequest } from '../../../types/sailor-create-request';

interface SailorRequestCardProps {
    request: SailorRequest;
    showButtons: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onDelete?: () => void;
}

const SailorRequestCard: React.FC<SailorRequestCardProps> = ({
    request,
    showButtons,
    onApprove,
    onReject,
    onDelete,
}) => {
    const {
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
        user_fullname,
        user_email,
        additional_information,
        created_at,
    } = request;

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const formatPartialDate = (
        day: number | null,
        month: number | null,
        year: number | null
    ): string => {
        const dd = day !== null ? String(day).padStart(2, '0') : '__';
        const mm = month !== null ? String(month).padStart(2, '0') : '__';
        const yyyy = year !== null ? String(year) : '____';
        return `${dd}.${mm}.${yyyy}`;
    };

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <>
            <div
                className="sailor-request-card"
                onClick={openModal}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && openModal()}
            >
                {showButtons && (
                    <div
                        className="admin-buttons"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="approve" onClick={onApprove}>
                            Одобрить
                        </button>
                        <button className="reject" onClick={onReject}>
                            Отклонить
                        </button>
                        <button className="delete" onClick={onDelete}>
                            Удалить
                        </button>
                    </div>
                )}

                <div className="image-wrapper">
                    {photo_url ? (
                        <img src={`${photo_url}`} alt={`${surname} ${name}`} />
                    ) : (
                        <div className="image-placeholder">Нет фото</div>
                    )}
                </div>

                <div className="info">
                    <h2>
                        {surname} {name} {patronymic}
                    </h2>
                    <p className="sailor-dates">
                        {formatPartialDate(birth_day, birth_month, birth_year)} –{' '}
                        {formatPartialDate(death_day, death_month, death_year)}
                    </p>
                    <p className="sailor-admission">Набор {admission}</p>

                    <hr />

                    <div className="request-info">
                        <div>
                            <b>Отправитель:</b> {user_fullname}
                        </div>
                        <div>
                            <b>Email:</b> {user_email}
                        </div>
                        {additional_information && (
                            <div>
                                <b>Доп. информация:</b> {additional_information}
                            </div>
                        )}
                        <div>
                            <b>Дата создания:</b> {formatDate(created_at)}
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div
                    className="modal-overlay"
                    onClick={closeModal}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close-btn"
                            onClick={closeModal}
                            aria-label="Закрыть модальное окно"
                        >
                            &times;
                        </button>

                        <div className="modal-image-wrapper">
                            {photo_url ? (
                                <img src={photo_url} alt={`${surname} ${name}`} />
                            ) : (
                                <div className="image-placeholder">Нет фото</div>
                            )}
                        </div>

                        <h2>
                            {surname} {name} {patronymic}
                        </h2>
                        <p>
                            <b>Дата рождения:</b>{' '}
                            {formatPartialDate(birth_day, birth_month, birth_year)}
                        </p>
                        <p>
                            <b>Дата смерти:</b>{' '}
                            {formatPartialDate(death_day, death_month, death_year)}
                        </p>
                        <p>
                            <b>Набор:</b> {admission}
                        </p>
                        <p>
                            <b>Биография:</b> {biography || '-'}
                        </p>

                        <hr />

                        <div>
                            <p>
                                <b>Отправитель:</b> {user_fullname}
                            </p>
                            <p>
                                <b>Email:</b> {user_email}
                            </p>
                            {additional_information && (
                                <p>
                                    <b>Дополнительная информация:</b> {additional_information}
                                </p>
                            )}
                            <p>
                                <b>Дата создания:</b> {formatDate(created_at)}
                            </p>
                        </div>

                        {showButtons && (
                            <div className="admin-buttons-modal">
                                <button className="approve" onClick={onApprove}>
                                    Одобрить
                                </button>
                                <button className="reject" onClick={onReject}>
                                    Отклонить
                                </button>
                                <button className="delete" onClick={onDelete}>
                                    Удалить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SailorRequestCard;
