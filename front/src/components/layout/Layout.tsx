import React from 'react';
import Header from './Header';
import Footer from './Footer'
import './Layout.scss';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Header />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
