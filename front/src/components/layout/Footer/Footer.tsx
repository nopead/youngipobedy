import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="contacts-social-wrapper">
                    <div className="contacts-section">
                        <h2 className="contacts-title">Контакты для связи</h2>
                        <div className="contact-methods">
                            <div className="contact-item">
                                <a href="tel:+74942313132" className="social-link" aria-label="Телефон">
                                    <img
                                        src="https://cdn-icons-png.freepik.com/512/9699/9699854.png"
                                        alt="Телефон"
                                        className="social-icon"
                                    />
                                </a>
                                <span>+7-910-950-03-93 / (4942) 55-16-21</span>
                            </div>

                            <div className="contact-item">
                                <a href="mailto:navigator.dmc@yandex.ru " className="social-link" aria-label="Email">
                                    <img
                                        src="https://cdn-icons-png.freepik.com/512/9244/9244713.png"
                                        alt="Email"
                                        className="social-icon"
                                    />
                                </a>
                                <span>navigator.dmc@yandex.ru</span>
                            </div>
                        </div>
                    </div>

                    <div className="social-section">
                        <h2 className="contacts-title">Мы в социальных сетях</h2>
                        <div className="social-links">
                            <a
                                href="https://vk.com/kym_dmc44"
                                className="social-link"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Группа ВКонтакте"
                            >
                                <img
                                    src="https://housegu.ru/local/templates/pets/images/vk.png"
                                    alt="ВКонтакте"
                                    className="social-icon"
                                />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="partners-section">
                    <h2 className="contacts-title">Участники</h2>
                    <div className="partners-logos">
                        <a
                            href="https://sites.google.com/view/dmc44"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Веб-сайт Детского морского центра"
                        >
                            <img
                                src="https://sun9-33.userapi.com/impg/c841627/v841627248/1faeb/FMd0W9RCI7w.jpg?size=2000x2000&quality=96&sign=5c269ca21b0c3513011fae1552440e8c&type=album"
                                alt="Логотип Детского морского центра"
                                className="partner-logo"
                            />
                        </a>
                    </div>
                </div>
            </div>

            <div className="policy-link">
                <Link to="/privacy-policy">Политика конфиденциальности</Link>
            </div>

            <div className="signature">
                С уважением,<br />
                Муниципальное бюджетное учреждение дополнительного образования города Костромы <b>«Детский морской центр»</b>
                <br />
                Этот проект принадлежит Детскому морскому центру.
            </div>

            <div className="copyright">
                © 2025 ЮНГИ ПОБЕДЫ ЗЕМЛИ КОСТРОМСКОЙ. Все права защищены.
            </div>
        </footer>
    );
};

export default Footer;
