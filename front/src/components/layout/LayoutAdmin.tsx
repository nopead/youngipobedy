import React from 'react';
import { Outlet } from 'react-router-dom';
import './Layout.scss';
import AdminHeader from './AdminHeader';

const LayoutAdmin: React.FC = () => {
  return (
    <div className="layout">
      <AdminHeader />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutAdmin;
