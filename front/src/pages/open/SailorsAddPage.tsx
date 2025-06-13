import React from 'react';
import { useLocation } from 'react-router-dom';
import SailorAddForm from '../../components/sailors/SailorAddForm';
import { FormDataType } from '../../components/sailors/SailorAddForm';
import './SailorAddPage.scss'

const buildAdminPayload = (data: FormDataType) => {
  return {
    data: {
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
    },
    locations: ['headers'],
  };
};

const buildPublicPayload = (data: FormDataType) => {
  return {
    user_fullname: data.user_fullname,
    user_email: data.user_email,
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
    additional_information: data.additional_information || null
  };
};

const SailorAddPage: React.FC = () => {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  const handleSubmit = async (data: FormDataType) => {
    console.log(isAdmin);
    if (isAdmin) {
      const payload = buildAdminPayload(data);
      console.log('Отправка на админский сервер:', payload);
      const token = localStorage.getItem('access_token');
      await fetch('http://127.0.0.1:1111/admin/sailors/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    } else {
      const payload = buildPublicPayload(data);
      console.log(payload);
      console.log('Отправка на публичный сервер:', JSON.stringify(payload));
      await fetch('http://127.0.0.1:1111/sailor-create-requests/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })
    }
  };

  return (
    <section className="sailor-add-page">
      <SailorAddForm
        mode={isAdmin ? 'edit' : 'create'}
        showSenderFields={!isAdmin}
        onSubmit={handleSubmit}
      />
    </section>
  );
};

export default SailorAddPage;
