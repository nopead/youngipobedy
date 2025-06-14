import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SailorAddForm from '../../../components/Forms/SailorAddForm';
import { FormDataType } from '../../../types/sailor-form-types';
import './SailorCreate.scss';
import { useToast } from '../../../context/ToastContext';

const ADMIN_API_URL = 'http://127.0.0.1:1111/admin/sailors/create';
const PUBLIC_API_URL = 'http://127.0.0.1:1111/sailor-create-requests/add';

const buildBasePayload = (data: FormDataType) => ({
  name: data.name.trim(),
  surname: data.surname.trim(),
  patronymic: data.patronymic.trim(),
  photo_url: data.photo_url,
  birth_day: data.birth_day || null,
  birth_month: data.birth_month || null,
  birth_year: data.birth_year || null,
  death_day: data.death_day || null,
  death_month: data.death_month || null,
  death_year: data.death_year || null,
  admission: Number(data.admission),
  biography: data.biography?.trim() || null,
});

const buildAdminPayload = (data: FormDataType) => ({
  data: buildBasePayload(data),
  locations: ['headers'],
});

const buildPublicPayload = (data: FormDataType) => ({
  ...buildBasePayload(data),
  user_fullname: data.user_fullname,
  user_email: data.user_email,
  additional_information: data.additional_information || null,
});

const postData = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || response.statusText);
  }
  return response.json();
};

const TITLE = "Добавление юнги";

const SailorAddPage: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);

  useEffect (() => {
        document.title = TITLE;
      }, []);

  const handleSubmit = async (data: FormDataType) => {
    setLoading(true);
    try {
      if (isAdmin) {
        const payload = buildAdminPayload(data);
        const token = localStorage.getItem('access_token') || '';
        await postData(ADMIN_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        showToast('Юнга успешно добавлен (админский режим)', 'success');
      } else {
        const payload = buildPublicPayload(data);
        await postData(PUBLIC_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        showToast('Заявка успешно отправлена на рассмотрение', 'success');
      }
    } catch (error) {
      showToast(String(error) || 'Произошла ошибка при отправке', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="sailor-add-page">
      <SailorAddForm
        mode={isAdmin ? 'edit' : 'create'}
        showSenderFields={!isAdmin}
        onSubmit={handleSubmit}
        disabled={loading}
      />
    </section>
  );
};

export default SailorAddPage;
