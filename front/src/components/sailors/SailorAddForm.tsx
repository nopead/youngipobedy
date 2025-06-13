import React, { useState, useRef, useEffect } from 'react';
import '../../styles/CommonForm.scss';

export interface FormDataType {
  surname: string;
  name: string;
  patronymic: string;
  birth_day?: number | null;
  birth_month?: number | null;
  birth_year?: number | null;
  death_day?: number | null;
  death_month?: number | null;
  death_year?: number | null;
  admission: string;
  biography: string;
  photo: File | null;
  photo_url: string;
  additional_information?: string;
  user_fullname?: string;
  user_email?: string;
}

interface SailorFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<FormDataType>;
  onSubmit?: (data: FormDataType) => Promise<void>;
  showSenderFields?: boolean;
}

interface FormErrors {
  surname?: string;
  name?: string;
  patronymic?: string;
  admission?: string;
  biography?: string;
  photo_url?: string;
  user_fullname?: string;
  user_email?: string;

  birth_day?: string;
  birth_month?: string;
  birth_year?: string;
  death_day?: string;
  death_month?: string;
  death_year?: string;
  death_date?: string;
}

const SailorAddForm: React.FC<SailorFormProps> = ({
  mode,
  initialData,
  onSubmit,
  showSenderFields = false,
}) => {
  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

  const initialState: FormDataType = {
    surname: '',
    name: '',
    patronymic: '',
    birth_day: null,
    birth_month: null,
    birth_year: null,
    death_day: null,
    death_month: null,
    death_year: null,
    admission: '',
    biography: '',
    photo: null,
    photo_url: '',
    additional_information: '',
    user_fullname: '',
    user_email: '',
    ...initialData,
  };

  const [formData, setFormData] = useState<FormDataType>(initialState);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  const bioRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (bioRef.current) {
      bioRef.current.style.height = 'auto';
      bioRef.current.style.height = bioRef.current.scrollHeight + 'px';
    }
  }, [formData.biography]);

  const validateImageFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Разрешены только изображения PNG, JPEG, JPG, WEBP';
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Размер файла не должен превышать ${MAX_FILE_SIZE_MB}MB`;
    }
    return null;
  };

  const normalizePhotoUrl = (url: string): string => {
    if (!url) return '';
    const winPathMatch = url.match(/photos[\\/][^\\/]+$/);
    if (winPathMatch) {
      const fileName = winPathMatch[0].split(/[\\/]/).pop();
      return `/photos/${fileName}`;
    }
    if (url.includes('/public/')) {
      const afterPublic = url.split('/public')[1];
      return afterPublic.startsWith('/') ? afterPublic : '/' + afterPublic;
    }
    return url.startsWith('/') ? url : '/' + url;
  };

  const uploadPhoto = async (file: File) => {
    setUploadingPhoto(true);
    const formDataToSend = new FormData();
    formDataToSend.append('file', file);

    try {
      const res = await fetch('http://127.0.0.1:1111/upload/image', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!res.ok) throw new Error('Ошибка загрузки фото');

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        photo: file,
        photo_url: data.photo_url,
      }));

      setErrors(prev => ({ ...prev, photo_url: undefined }));
    } catch (e) {
      const error = e as Error;
      setErrors(prev => ({ ...prev, photo_url: 'Ошибка при загрузке фото: ' + error.message }));
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setErrors(prev => ({ ...prev, photo_url: validationError }));
      } else {
        uploadPhoto(file);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setErrors(prev => ({ ...prev, photo_url: validationError }));
      } else {
        uploadPhoto(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'admission' ? value.replace(/\D/g, '') : value,
    }));
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'birth' | 'death',
    part: 'day' | 'month' | 'year'
  ) => {
    const value = e.target.value;
    const numValue = value ? parseInt(value, 10) : null;

    const fieldKey = `${field}_${part}` as keyof FormErrors;
    if (errors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: undefined }));
    }

    setFormData(prev => ({
      ...prev,
      [`${field}_${part}`]: numValue
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Обязательные поля
    if (!formData.surname.trim()) {
      newErrors.surname = 'Фамилия обязательна';
      isValid = false;
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
      isValid = false;
    }

    if (!formData.patronymic.trim()) {
      newErrors.patronymic = 'Отчество обязательно';
      isValid = false;
    }

    if (!formData.biography.trim()) {
      newErrors.biography = 'Биография обязательна';
      isValid = false;
    }

    if (!formData.photo_url) {
      newErrors.photo_url = 'Фото обязательно';
      isValid = false;
    }

    if (!formData.admission) {
      newErrors.admission = 'Номер набора обязателен';
      isValid = false;
    } else {
      const admissionNum = parseInt(formData.admission, 10);
      if (isNaN(admissionNum) || admissionNum < 1 || admissionNum > 3) {
        newErrors.admission = 'Номер набора должен быть от 1 до 3';
        isValid = false;
      }
    }

    // Поля отправителя
    if (showSenderFields) {
      if (!formData.user_fullname?.trim()) {
        newErrors.user_fullname = 'Ваше ФИО обязательно';
        isValid = false;
      }

      if (!formData.user_email?.trim()) {
        newErrors.user_email = 'Email обязателен';
        isValid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(formData.user_email)) {
        newErrors.user_email = 'Некорректный email';
        isValid = false;
      }
    }

    // Валидация компонентов дат
    const validateDateComponent = (
      value: number | null | undefined,
      field: keyof FormErrors,
      min: number,
      max: number
    ) => {
      if (value === undefined || value === null) return true;

      if (isNaN(value)) {
        newErrors[field] = `Должно быть числом`;
        return false;
      }

      if (value < min || value > max) {
        newErrors[field] = `Должно быть от ${min} до ${max}`;
        return false;
      }

      return true;
    };

    isValid = validateDateComponent(formData.birth_day, 'birth_day', 1, 31) && isValid;
    isValid = validateDateComponent(formData.birth_month, 'birth_month', 1, 12) && isValid;
    isValid = validateDateComponent(formData.birth_year, 'birth_year', 1800, new Date().getFullYear()) && isValid;

    isValid = validateDateComponent(formData.death_day, 'death_day', 1, 31) && isValid;
    isValid = validateDateComponent(formData.death_month, 'death_month', 1, 12) && isValid;
    isValid = validateDateComponent(formData.death_year, 'death_year', 1800, new Date().getFullYear()) && isValid;

    // Проверка корректности даты рождения
    if (formData.birth_year && formData.birth_month && formData.birth_day) {
      const birthDate = new Date(
        formData.birth_year,
        formData.birth_month - 1,
        formData.birth_day
      );

      // Проверка что дата валидна (например, 31 февраля)
      if (isNaN(birthDate.getTime())) {
        newErrors.birth_day = 'Некорректная дата рождения';
        isValid = false;
      }
    }

    // Проверка корректности даты смерти
    if (formData.death_year && formData.death_month && formData.death_day) {
      const deathDate = new Date(
        formData.death_year,
        formData.death_month - 1,
        formData.death_day
      );

      if (isNaN(deathDate.getTime())) {
        newErrors.death_day = 'Некорректная дата смерти';
        isValid = false;
      }
    }

    // Сравнение дат
    if (
      formData.birth_year && formData.birth_month && formData.birth_day &&
      formData.death_year && formData.death_month && formData.death_day
    ) {
      const birthDate = new Date(
        formData.birth_year,
        formData.birth_month - 1,
        formData.birth_day
      );
      const deathDate = new Date(
        formData.death_year,
        formData.death_month - 1,
        formData.death_day
      );

      if (deathDate < birthDate) {
        newErrors.death_date = 'Дата смерти не может быть раньше даты рождения';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const clearForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setFormStatus('error');
      setFormMessage('Пожалуйста, исправьте ошибки в форме');
      return;
    }

    setFormStatus('submitting');

    const payload: FormDataType = {
      surname: formData.surname,
      name: formData.name,
      patronymic: formData.patronymic,
      birth_day: formData.birth_day,
      birth_month: formData.birth_month,
      birth_year: formData.birth_year,
      death_day: formData.death_day,
      death_month: formData.death_month,
      death_year: formData.death_year,
      admission: formData.admission,
      biography: formData.biography,
      photo: formData.photo,
      photo_url: formData.photo_url,
      additional_information: showSenderFields ? formData.additional_information : undefined,
      user_fullname: showSenderFields ? formData.user_fullname : undefined,
      user_email: showSenderFields ? formData.user_email : undefined,
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
        setFormStatus('success');
        setFormMessage(mode === 'create'
          ? 'Данные успешно отправлены!'
          : 'Данные успешно обновлены!');

        if (mode === 'create') {
          clearForm();
        }
      }
    } catch (e) {
      const error = e as Error;
      setFormStatus('error');
      setFormMessage('Ошибка при отправке формы: ' + error.message);
    }
  };

  return (
    <form className="common-form" onSubmit={handleSubmit} noValidate>
      {formStatus === 'success' && (
        <div className="form-success-message">
          {formMessage}
          {mode === 'create' && !showSenderFields && (
            <button
              type="button"
              className="form-clear-button"
              onClick={clearForm}
            >
              Добавить ещё
            </button>
          )}
        </div>
      )}

      {formStatus === 'error' && (
        <div className="error-message">{formMessage}</div>
      )}

      {showSenderFields && (
        <>
          <div className="input-group">
            <label>
              Ваше ФИО*
              <input
                name="user_fullname"
                value={formData.user_fullname || ''}
                onChange={handleChange}
                placeholder="Введите ФИО"
                required
                autoComplete="name"
                className={errors.user_fullname ? 'input-error' : ''}
              />
              {errors.user_fullname && <div className="error-message">{errors.user_fullname}</div>}
            </label>
          </div>

          <div className="input-group">
            <label>
              Ваш email*
              <input
                name="user_email"
                type="email"
                value={formData.user_email || ''}
                onChange={handleChange}
                placeholder="example@mail.com"
                required
                autoComplete="email"
                className={errors.user_email ? 'input-error' : ''}
              />
              {errors.user_email && <div className="error-message">{errors.user_email}</div>}
            </label>
          </div>
        </>
      )}

      <div className="input-group">
        <label>
          Фамилия*
          <input
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Фамилия"
            required
            autoComplete="family-name"
            className={errors.surname ? 'input-error' : ''}
          />
          {errors.surname && <div className="error-message">{errors.surname}</div>}
        </label>
      </div>

      <div className="input-group">
        <label>
          Имя*
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Имя"
            required
            autoComplete="given-name"
            className={errors.name ? 'input-error' : ''}
          />
          {errors.name && <div className="error-message">{errors.name}</div>}
        </label>
      </div>

      <div className="input-group">
        <label>
          Отчество*
          <input
            name="patronymic"
            value={formData.patronymic}
            onChange={handleChange}
            placeholder="Отчество"
            required
            className={errors.patronymic ? 'input-error' : ''}
          />
          {errors.patronymic && <div className="error-message">{errors.patronymic}</div>}
        </label>
      </div>

      <div className="input-group">
        <label>Дата рождения</label>
        <div className="date-row">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            pattern="\d{1,2}"
            placeholder="День"
            value={formData.birth_day ?? ''}
            onChange={(e) => handleDateChange(e, 'birth', 'day')}
            className={errors.birth_day ? 'input-error' : ''}
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            pattern="\d{1,2}"
            placeholder="Месяц"
            value={formData.birth_month ?? ''}
            onChange={(e) => handleDateChange(e, 'birth', 'month')}
            className={errors.birth_month ? 'input-error' : ''}
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            pattern="\d{4}"
            placeholder="Год"
            value={formData.birth_year ?? ''}
            onChange={(e) => handleDateChange(e, 'birth', 'year')}
            className={errors.birth_year ? 'input-error' : ''}
          />
        </div>
        {errors.birth_day && <div className="error-message">{errors.birth_day}</div>}
        {errors.birth_month && <div className="error-message">{errors.birth_month}</div>}
        {errors.birth_year && <div className="error-message">{errors.birth_year}</div>}
      </div>

      <div className="input-group">
        <label>Дата смерти</label>
        <div className="date-row">
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            pattern="\d{1,2}"
            placeholder="День"
            value={formData.death_day ?? ''}
            onChange={(e) => handleDateChange(e, 'death', 'day')}
            className={errors.death_day ? 'input-error' : ''}
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            pattern="\d{1,2}"
            placeholder="Месяц"
            value={formData.death_month ?? ''}
            onChange={(e) => handleDateChange(e, 'death', 'month')}
            className={errors.death_month ? 'input-error' : ''}
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            pattern="\d{4}"
            placeholder="Год"
            value={formData.death_year ?? ''}
            onChange={(e) => handleDateChange(e, 'death', 'year')}
            className={errors.death_year ? 'input-error' : ''}
          />
        </div>
        {errors.death_day && <div className="error-message">{errors.death_day}</div>}
        {errors.death_month && <div className="error-message">{errors.death_month}</div>}
        {errors.death_year && <div className="error-message">{errors.death_year}</div>}
        {errors.death_date && <div className="error-message">{errors.death_date}</div>}
      </div>

      <div className="input-group">
        <label>
          Номер набора (1-3)*
          <input
            name="admission"
            value={formData.admission}
            onChange={handleChange}
            placeholder="Номер набора"
            inputMode="numeric"
            pattern="\d*"
            className={errors.admission ? 'input-error' : ''}
          />
          {errors.admission && <div className="error-message">{errors.admission}</div>}
        </label>
      </div>

      <div className="input-group">
        <label>
          Биография*
          <textarea
            ref={bioRef}
            name="biography"
            value={formData.biography}
            onChange={handleChange}
            placeholder="Биография"
            rows={1}
            required
            className={errors.biography ? 'input-error' : ''}
          />
          {errors.biography && <div className="error-message">{errors.biography}</div>}
        </label>
      </div>

      <div
        className={`input-group form__photo-drop-zone ${dragOver ? 'form__photo-drop-zone--active' : ''
          } ${errors.photo_url ? 'form__photo-drop-zone--error' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('fileInput')?.click()}
        role="button"
        tabIndex={0}
        aria-label="Загрузить фото"
        style={{ cursor: 'pointer' }}
      >
        {uploadingPhoto ? (
          <p>Загрузка фото...</p>
        ) : formData.photo_url ? (
          <>
            <img
              src={normalizePhotoUrl(formData.photo_url)}
              alt="Предпросмотр фото"
              style={{ maxWidth: '100%', borderRadius: '6px' }}
            />
            {formData.photo && <p>{formData.photo.name}</p>}
          </>
        ) : (
          <p>Перетащите фото или кликните для выбора (до 5MB, PNG/JPEG)*</p>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple={false}
          aria-hidden="true"
          tabIndex={-1}
        />
        {errors.photo_url && <div className="error-message" style={{ marginTop: '10px' }}>{errors.photo_url}</div>}
      </div>

      {showSenderFields && (
        <div className="input-group">
          <label>
            Дополнительная информация
            <textarea
              name="additional_information"
              value={formData.additional_information || ''}
              onChange={handleChange}
              placeholder="Дополнительная информация"
              rows={2}
            />
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={formStatus === 'submitting' || uploadingPhoto}
      >
        {formStatus === 'submitting'
          ? 'Отправка...'
          : mode === 'create' ? 'Отправить' : 'Сохранить'}
      </button>

      {showSenderFields && (
        <p className="small-text">
          Отправляя данные, вы соглашаетесь на их обработку. Подробнее об использовании личных данных вы
          можете ознакомиться в&nbsp;
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#003366' }}>
            Политике конфиденциальности
          </a>
          .
        </p>
      )}
    </form>
  );
};

export default SailorAddForm;