import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.scss';
import AdminHeader from './Headers/AdminHeader';
import ScrollToTopButton from './ScrollToTopButton/ScrollToTopButton';

const LayoutAdmin: React.FC = () => {
  return (
    <div className="layout">
      <AdminHeader />
      <main className="content">
        <Outlet />
        <ScrollToTopButton />
      </main>
    </div>
  );
};

export default LayoutAdmin;
