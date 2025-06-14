import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBase from './HeaderBase';

const AdminHeader: React.FC = () => {
  const navigate = useNavigate();

  const links = [
    { to: '/admin/sailors', label: 'Юнги' },
    { to: '/admin/add-sailor', label: 'Добавить юнгу' },
    { to: '/admin/feedback', label: 'Обратная связь' },
    { to: '/admin/requests', label: 'Заявки' },
    {
      label: 'Выйти',
      onClick: () => {
        localStorage.removeItem('access_token');
        navigate('/');
      },
      className: 'logout-link site-nav__link',
    },
  ];

  return <HeaderBase links={links} isAdmin />;
};

export default AdminHeader;
