import React, { useEffect, useState } from 'react';
import './SailorEdit.scss'
import { useParams, useNavigate } from 'react-router-dom';
import SailorAddForm from '../../../components/Forms/SailorAddForm';
import { FormDataType } from '../../../types/sailor-form-types';
import { useToast } from '../../../context/ToastContext';

const AdminSailorEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast(); 
  const [initialData, setInitialData] = useState<Partial<FormDataType> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSailor = async () => {
      try {
        const res = await fetch(`http://51.250.27.60/api/sailors/${id}`);
        if (!res.ok) throw new Error('Не удалось загрузить данные');

        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        showToast('Ошибка при загрузке: ' + (err as Error).message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSailor();
  }, [id, showToast]);

  const handleSubmit = async (formData: FormDataType) => {
    try {
      const payload = {
        data: {
          surname: formData.surname.trim(),
          name: formData.name.trim(),
          patronymic: formData.patronymic.trim(),
          birth_day: formData.birth_day || null,
          birth_month: formData.birth_month || null,
          birth_year: formData.birth_year || null,
          death_day: formData.death_day || null,
          death_month: formData.death_month || null,
          death_year: formData.death_year || null,
          admission: Number(formData.admission),
          biography: formData.biography,
          photo_url: formData.photo_url,
        },
        locations: ['headers'],
      };

      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://51.250.27.60/api/admin/sailors/update/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Ошибка обновления');

      showToast('Данные успешно обновлены', 'success');
      navigate('/admin/sailors');
    } catch (error) {
      showToast('Ошибка при отправке: ' + (error as Error).message, 'error');
    }
  };

  if (loading || !initialData) return <p>Загрузка...</p>;

  return (
    <div className="admin-sailor-edit-page">
      <h2>Редактировать моряка</h2>
      <div className="form-container">
        <SailorAddForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleSubmit}
          showSenderFields={false}
        />
      </div>
    </div>
  );
};

export default AdminSailorEditPage;
