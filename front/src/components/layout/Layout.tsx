import React from 'react';
import Header from './Headers/Header';
import Footer from './Footer/Footer';
import './Layout.scss';
import { Outlet } from 'react-router-dom';
import ScrollToTopButton from './ScrollToTopButton/ScrollToTopButton';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Header />
      <main className="content">
        <Outlet />
        <ScrollToTopButton />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
