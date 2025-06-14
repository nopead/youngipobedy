import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page sea-theme">
      <div className="not-found-content">
        <h1>⚓ 404 — Курс потерян</h1>
        <p>Похоже, вы уплыли за пределы навигационной карты...</p>
        <Link to="/">Вернуться в порт</Link>
      </div>

      <div className="ship"></div>

      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </div>
  );
};

export default NotFoundPage;