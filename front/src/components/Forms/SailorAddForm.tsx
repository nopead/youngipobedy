import React, { useState, useRef, useEffect } from 'react';
import '../../styles/CommonForm.scss';
import TextInput from './UI/TextInput';
import DateInputGroup from './UI/DateInput';
import PhotoUpload from './UI/PhotoUpload';
import { FormDataType, SailorFormProps, FormErrors } from '../../types/sailor-form-types'

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

  const handleFileSelected = (file: File) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setErrors(prev => ({ ...prev, photo_url: validationError }));
    } else {
      uploadPhoto(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
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
    prefix: 'birth' | 'death',
    part: 'day' | 'month' | 'year',
    value: string
  ) => {
    const numValue = value ? parseInt(value, 10) : null;

    const fieldKey = `${prefix}_${part}` as keyof FormErrors;
    if (errors[fieldKey]) {
      setErrors(prev => ({ ...prev, [fieldKey]: undefined }));
    }

    setFormData(prev => ({
      ...prev,
      [`${prefix}_${part}`]: numValue
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

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

    if (formData.birth_year && formData.birth_month && formData.birth_day) {
      const birthDate = new Date(
        formData.birth_year,
        formData.birth_month - 1,
        formData.birth_day
      );

      if (isNaN(birthDate.getTime())) {
        newErrors.birth_day = 'Некорректная дата рождения';
        isValid = false;
      }
    }

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

        if (mode === 'create') {
          clearForm();
        }
      }
    } catch (e) {
      const error = e as Error;
      setFormStatus('error');
    }
  };

  return (
    <form className="common-form" onSubmit={handleSubmit} noValidate>
      {showSenderFields && (
        <>
          <TextInput
            label="Ваше ФИО*"
            name="user_fullname"
            value={formData.user_fullname || ''}
            onChange={handleChange}
            placeholder="Введите ФИО"
            required
            autoComplete="name"
            error={errors.user_fullname}
          />

          <TextInput
            label="Ваш email*"
            name="user_email"
            type="email"
            value={formData.user_email || ''}
            onChange={handleChange}
            placeholder="example@mail.com"
            required
            autoComplete="email"
            error={errors.user_email}
          />
        </>
      )}

      <TextInput
        label="Фамилия*"
        name="surname"
        value={formData.surname}
        onChange={handleChange}
        placeholder="Фамилия"
        required
        autoComplete="family-name"
        error={errors.surname}
      />

      <TextInput
        label="Имя*"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Имя"
        required
        autoComplete="given-name"
        error={errors.name}
      />

      <TextInput
        label="Отчество*"
        name="patronymic"
        value={formData.patronymic}
        onChange={handleChange}
        placeholder="Отчество"
        required
        error={errors.patronymic}
      />

      <DateInputGroup
        label="Дата рождения"
        prefix="birth"
        values={{
          day: formData.birth_day,
          month: formData.birth_month,
          year: formData.birth_year
        }}
        errors={{
          day: errors.birth_day,
          month: errors.birth_month,
          year: errors.birth_year,
          date: errors.birth_date
        }}
        onChange={handleDateChange}
      />

      <DateInputGroup
        label="Дата смерти"
        prefix="death"
        values={{
          day: formData.death_day,
          month: formData.death_month,
          year: formData.death_year
        }}
        errors={{
          day: errors.death_day,
          month: errors.death_month,
          year: errors.death_year,
          date: errors.death_date
        }}
        onChange={handleDateChange}
      />

      <TextInput
        label="Номер набора (1-3)*"
        name="admission"
        value={formData.admission}
        onChange={handleChange}
        placeholder="Номер набора"
        inputMode="numeric"
        pattern="\d*"
        error={errors.admission}
      />

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

      <PhotoUpload
        photoUrl={normalizePhotoUrl(formData.photo_url)}
        uploading={uploadingPhoto}
        error={errors.photo_url}
        dragOver={dragOver}
        onFileChange={handleFileSelected}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      />

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