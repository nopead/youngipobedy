import React from 'react';
import './Confirm.scss';

interface ConfirmModalProps {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title = 'Подтверждение удаления',
  message,
  onConfirm,
  onCancel,
  confirmText = 'Удалить',
  cancelText = 'Отмена',
}) => {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}>
      <div className="modal">
        <h2 id="modal-title">{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="modal-confirm" onClick={onConfirm}>
            {confirmText}
          </button>
          <button className="modal-cancel" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
