import React from 'react';
import HeaderBase from './HeaderBase';

const Header: React.FC = () => {
  const links = [
    { to: '/about', label: 'О проекте' },
    { to: '/sailors', label: 'Юнги' },
    { to: '/add-sailor', label: 'Добавить юнгу' },
  ];

  return <HeaderBase links={links} />;
};

export default Header;
