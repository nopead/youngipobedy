import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.scss';

interface LinkType {
  to?: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

interface HeaderBaseProps {
  links: LinkType[];
  isAdmin?: boolean;
}

const HeaderBase: React.FC<HeaderBaseProps> = ({ links, isAdmin = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={isAdmin ? 'admin-header' : 'site-header'}>
      <div className={isAdmin ? 'admin-header__container' : 'site-header__container'}>
        {!isAdmin && (
          <a href="/" className="site-logo">
            <span className="site-logo__icon">⚓</span>
            <span className="site-logo__text">
              <span>ЮНГИ ПОБЕДЫ</span>
              <small>ЗЕМЛИ КОСТРОМСКОЙ</small>
            </span>
          </a>
        )}

        <nav className="site-nav">
          {links.map(({ to, label, onClick, className }, index) =>
            to ? (
              <NavLink
                key={index}
                to={to}
                className={({ isActive }) =>
                  `${className ?? 'site-nav__link'}${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ) : (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onClick && onClick();
                  closeMenu();
                }}
                className={className ?? 'site-nav__link'}
              >
                {label}
              </button>
            )
          )}
        </nav>

        <div className="site-burger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`site-burger__line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`site-burger__line ${menuOpen ? 'open' : ''}`}></span>
          <span className={`site-burger__line ${menuOpen ? 'open' : ''}`}></span>
        </div>

        <div className={`site-mobile-menu ${menuOpen ? 'site-mobile-menu--open' : ''}`}>
          {links.map(({ to, label, onClick, className }, index) =>
            to ? (
              <NavLink
                key={index}
                to={to}
                className={({ isActive }) =>
                  `${className ?? 'site-nav__link'}${isActive ? ' active' : ''}`
                }
                onClick={closeMenu}
              >
                {label}
              </NavLink>
            ) : (
              <button
                key={index}
                type="button"
                onClick={() => {
                  onClick && onClick();
                  closeMenu();
                }}
                className={className ?? 'site-nav__link'}
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderBase;
