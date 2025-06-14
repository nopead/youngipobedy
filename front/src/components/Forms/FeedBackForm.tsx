import React, { useState, useRef, useEffect } from 'react';
import '../../styles/CommonForm.scss';
import { useToast } from '../../context/ToastContext'; 

type FormData = {
  fullName: string;
  email: string;
  message: string;
  additionalInfo: string;
};

type Errors = Partial<Record<keyof FormData, string>>;

export default function FeedBackForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    message: '',
    additionalInfo: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const additionalInfoRef = useRef<HTMLTextAreaElement | null>(null);

  const { showToast } = useToast();

  const autoResize = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = ref.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoResize(messageRef);
    autoResize(additionalInfoRef);
  }, [formData.message, formData.additionalInfo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormSubmitted(false);
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Поле обязательно для заполнения';
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = 'Максимум 100 символов';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Поле обязательно для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    } else if (formData.email.length > 255) {
      newErrors.email = 'Максимум 255 символов';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Поле обязательно для заполнения';
    } else if (formData.message.length > 5000) {
      newErrors.message = 'Максимум 5000 символов';
    }

    if (formData.additionalInfo.length > 500) {
      newErrors.additionalInfo = 'Максимум 500 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setFormSubmitted(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:1111/feedbacks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          message: formData.message,
          additional_information: formData.additionalInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        showToast(`Ошибка сервера: ${errorData.detail || response.statusText}`, 'error');
        setFormSubmitted(false);
        return;
      }

      await response.json();

      setFormSubmitted(true);
      showToast('Спасибо! Ваше сообщение отправлено.', 'success');

      setFormData({
        fullName: '',
        email: '',
        message: '',
        additionalInfo: '',
      });
      setErrors({});

      if (messageRef.current) messageRef.current.style.height = 'auto';
      if (additionalInfoRef.current) additionalInfoRef.current.style.height = 'auto';
    } catch {
      showToast('Ошибка сети или сервера. Попробуйте позже.', 'error');
      setFormSubmitted(false);
    }
  };

  return (
    <section className="contact-section">
      <h2>Здесь вы можете оставить обратную связь для нас.</h2>
      <form onSubmit={handleSubmit} className="common-form" noValidate>
        <div className="input-group">
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            placeholder="ФИО*"
            autoComplete="name"
            maxLength={100}
            aria-invalid={!!errors.fullName}
            aria-describedby="fullName-error"
          />
          {errors.fullName && (
            <p id="fullName-error" className="error-message">
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Email*"
            autoComplete="email"
            maxLength={255}
            aria-invalid={!!errors.email}
            aria-describedby="email-error"
          />
          {errors.email && (
            <p id="email-error" className="error-message">
              {errors.email}
            </p>
          )}
        </div>

        <div className="input-group">
          <textarea
            ref={messageRef}
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Сообщение*"
            rows={1}
            maxLength={5000}
            aria-invalid={!!errors.message}
            aria-describedby="message-error"
          />
          {errors.message && (
            <p id="message-error" className="error-message">
              {errors.message}
            </p>
          )}
        </div>

        <div className="input-group">
          <textarea
            ref={additionalInfoRef}
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Дополнительная информация (телефон, соцсети)"
            rows={1}
            maxLength={500}
            aria-invalid={!!errors.additionalInfo}
            aria-describedby="additionalInfo-error"
          />
          {errors.additionalInfo && (
            <p id="additionalInfo-error" className="error-message">
              {errors.additionalInfo}
            </p>
          )}
        </div>

        <p className="privacy-note small-text">
          Отправляя данные, вы соглашаетесь на их обработку. Подробнее об использовании личных данных вы
          можете ознакомиться в&nbsp;
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            <b>Политике конфиденциальности</b>
          </a>
          .
        </p>

        <button type="submit">Отправить</button>
      </form>
    </section>
  );
}
