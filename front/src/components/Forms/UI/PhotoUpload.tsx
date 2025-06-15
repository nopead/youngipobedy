import React, { useRef, useState, useEffect } from 'react';
import '../../../styles/CommonForm.scss';

interface PhotoUploadProps {
  photoUrl: string;
  uploading: boolean;
  error?: string;
  dragOver: boolean;
  onFileChange: (file: File) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({
  photoUrl,
  uploading,
  error,
  dragOver,
  onFileChange,
  onDrop,
  onDragOver,
  onDragLeave
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => setIsMobile(window.innerWidth <= 768);
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleClick = () => fileInputRef.current?.click();

  return (
    <div
      className={`input-group form__photo-drop-zone ${
        dragOver ? 'form__photo-drop-zone--active' : ''
      } ${error ? 'form__photo-drop-zone--error' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Загрузить фото"
      style={{ cursor: 'pointer' }}
    >
      {uploading ? (
        <p>Загрузка фото...</p>
      ) : photoUrl ? (
        <img
          src={`${photoUrl}`}
          alt="Предпросмотр фото"
          style={{ maxWidth: '100%', borderRadius: '6px' }}
        />
      ) : (
        <p>
          {isMobile
            ? 'Кликните для выбора фото (до 5MB, PNG/JPEG)*'
            : 'Перетащите фото или кликните для выбора (до 5MB, PNG/JPEG)*'}
        </p>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={(e) => e.target.files?.[0] && onFileChange(e.target.files[0])}
        style={{ display: 'none' }}
        multiple={false}
        aria-hidden="true"
        tabIndex={-1}
      />
      {error && <div className="error-message" style={{ marginTop: '10px' }}>{error}</div>}
    </div>
  );
};

export default PhotoUpload;