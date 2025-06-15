import React, { useState } from 'react';
import { Feedback } from '../../../types/feedback';

interface Props {
  item: Feedback;
  onDeleteClick: (id: number) => void;
}

const FeedbackCard: React.FC<Props> = ({ item, onDeleteClick }) => {
  const [expandedMessage, setExpandedMessage] = useState(false);
  const [expandedAdditional, setExpandedAdditional] = useState(false);
  const maxLength = 150;

  const getShortText = (text: string) =>
    text.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  return (
    <div className="feedback-card">
      <div className="card-header">
        <button className="delete-button" onClick={() => onDeleteClick(item.id)} title="Удалить">
          Удалить
        </button>
        <span className="feedback-date">{new Date(item.created_at).toLocaleString()}</span>
      </div>

      <p><b>Имя:</b> {item.full_name}</p>
      <p><b>Email:</b> {item.email}</p>

      <div className="feedback-text">
        {expandedMessage ? item.message : getShortText(item.message)}
        {item.message.length > maxLength && (
          <button className="expand-btn" onClick={() => setExpandedMessage(prev => !prev)}>
            {expandedMessage ? 'Скрыть' : 'Читать полностью'}
          </button>
        )}
      </div>

      {item.additional_information && (
        <div className="additional-info">
          {expandedAdditional
            ? item.additional_information
            : getShortText(item.additional_information)}
          {item.additional_information.length > maxLength && (
            <button className="expand-btn" onClick={() => setExpandedAdditional(prev => !prev)}>
              {expandedAdditional ? 'Скрыть' : 'Читать полностью'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackCard;
