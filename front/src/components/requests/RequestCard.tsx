import React, { useState } from 'react';
import './RequestCard.scss';

export interface SailorRequest {
    id: string;
    name: string;
    surname: string;
    patronymic: string;
    photo_url: string;
    birth_day: number | null,
    birth_month: number | null,
    birth_year: number | null,
    death_day: number | null,
    death_month: number | null,
    death_year: number | null,
    admission: number;
    biography: string;
    user_fullname: string;
    user_email: string;
    additional_information: string | null;
    created_at: string;
}

interface SailorRequestCardProps {
    request: SailorRequest;
    showButtons: boolean;
    onApprove?: () => void;
    onReject?: () => void;
    onDelete?: () => void;
}

function getPublicPhotoUrl(fullPath: string): string {
    const publicIndex = fullPath.indexOf('public');
    if (publicIndex === -1) return fullPath;
    const relativePath = fullPath.substring(publicIndex + 6).replace(/\\/g, '/');
    return relativePath.startsWith('/') ? relativePath : '/' + relativePath;
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
        created_at
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
            second: undefined,
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

    const safePhotoUrl = getPublicPhotoUrl(photo_url);

    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <>
            <div className="sailor-request-card" onClick={openModal} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && openModal()}>
                {showButtons && (
                    <div className="admin-buttons" onClick={e => e.stopPropagation()}>
                        <button className="approve" onClick={onApprove}>Одобрить</button>
                        <button className="reject" onClick={onReject}>Отклонить</button>
                        <button className="delete" onClick={onDelete}>Удалить</button>
                    </div>
                )}

                <div className="image-wrapper">
                    {safePhotoUrl ? (
                        <img src={safePhotoUrl} alt={`${surname} ${name}`} />
                    ) : (
                        <div className="image-placeholder">Нет фото</div>
                    )}
                </div>

                <div className="info">
                    <h2>{surname} {name} {patronymic}</h2>
                    <p className="sailor-dates">
                        {formatPartialDate(birth_day, birth_month, birth_year)} – {formatPartialDate(death_day, death_month, death_year)}
                    </p>
                    <p className="sailor-admission">Набор {admission}</p>

                    <hr />

                    <div className="request-info">
                        <div><b>Отправитель:</b> {user_fullname}</div>
                        <div><b>Email:</b> {user_email}</div>
                        {additional_information && (
                            <div><b>Доп. информация:</b> {additional_information}</div>
                        )}
                        <div><b>Дата создания:</b> {formatDate(created_at)}</div>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={closeModal} aria-label="Закрыть модальное окно">&times;</button>

                        <div className="modal-image-wrapper">
                            {safePhotoUrl ? (
                                <img src={safePhotoUrl} alt={`${surname} ${name}`} />
                            ) : (
                                <div className="image-placeholder">Нет фото</div>
                            )}
                        </div>

                        <h2>{surname} {name} {patronymic}</h2>
                        <p><b>Дата рождения:</b> {formatPartialDate(birth_day, birth_month, birth_year)}</p>
                        <p><b>Дата смерти:</b> {formatPartialDate(death_day, death_month, death_year)}</p>
                        <p><b>Набор:</b> {admission}</p>
                        <p><b>Биография:</b> {biography || '-'}</p>

                        <hr />

                        <div>
                            <p><b>Отправитель:</b> {user_fullname}</p>
                            <p><b>Email:</b> {user_email}</p>
                            {additional_information && (
                                <p><b>Дополнительная информация:</b> {additional_information}</p>
                            )}
                            <p><b>Дата создания:</b> {formatDate(created_at)}</p>
                        </div>

                        {showButtons && (
                            <div className="admin-buttons-modal">
                                <button className="approve" onClick={onApprove}>Одобрить</button>
                                <button className="reject" onClick={onReject}>Отклонить</button>
                                <button className="delete" onClick={onDelete}>Удалить</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default SailorRequestCard;
