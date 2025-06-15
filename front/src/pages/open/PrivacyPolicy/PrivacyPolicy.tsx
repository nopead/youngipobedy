import React, { useEffect, useState } from 'react';
import './PrivacyPolicy.scss';

const sections = [
  { id: 'general', title: 'Общие положения' },
  { id: 'data', title: 'Какие данные мы собираем' },
  { id: 'why', title: 'Зачем нам нужны ваши данные' },
  { id: 'rights', title: 'Права пользователей' },
  { id: 'security', title: 'Как мы защищаем ваши данные' },
  { id: 'features', title: 'Ваши возможности на сайте' },
  { id: 'storage', title: 'Хранение данных' },
  { id: 'changes', title: 'Изменения в Политике конфиденциальности' },
  { id: 'contacts', title: 'Контакты' },
];

const TITLE = "Политика конфиденциальности";

const PrivacyPolicy: React.FC = () => {
  const [activeSection, setActiveSection] = useState(sections[0].id);

  useEffect (() => {
        document.title = TITLE;
      }, []);

  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
  
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px 0px -80% 0px', 
      threshold: 0,
    });
  
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  
    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="privacy-policy-container" role="main">
      <nav
        className="privacy-nav"
        aria-label="Навигация по разделам политики конфиденциальности"
      >
        <ul>
          {sections.map(({ id, title }) => (
            <li key={id}>
              <button
                onClick={() => scrollToSection(id)}
                tabIndex={0}
                aria-current={activeSection === id ? 'true' : undefined}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="privacy-content" tabIndex={-1}>
        <section id="general">
          <h1>Общие положения</h1>
          <p>
            Данный сайт предназначен для информирования пользователей о деятельности
            проекта и предоставления доступа к различным разделам: «О проекте»,
            «Юнги», «Биография», «Политика конфиденциальности» и др.
          </p>
          <p>
            Используя сайт, вы соглашаетесь с настоящей Политикой конфиденциальности и
            условиями использования.
          </p>
        </section>

        <section id="data">
          <h2>Какие данные мы собираем</h2>
          <p>Мы собираем минимальные данные для обеспечения работы сайта и взаимодействия с пользователем:</p>
          <ul>
            <li>Данные, которые вы добровольно предоставляете, например, при отправке заявки на добавление юнги или обратной связи;</li>
            <li>Технические данные об использовании сайта (например, IP-адрес, тип браузера) для улучшения сервиса.</li>
          </ul>
        </section>

        <section id="why">
          <h2>Зачем нам нужны ваши данные</h2>
          <p>Ваши данные необходимы для:</p>
          <ul>
            <li>Обработки заявок на добавление юнги;</li>
            <li>Обеспечения работы форм обратной связи;</li>
            <li>Обратной связи с вами для улучшения качества сервиса и ответа на ваши вопросы.</li>
          </ul>
        </section>

        <section id="rights">
          <h2>Права пользователей</h2>
          <p>Вы имеете право:</p>
          <ul>
            <li>Запрашивать информацию о ваших данных, которые мы храним;</li>
            <li>Требовать исправления или удаления ваших данных;</li>
            <li>Отозвать согласие на обработку данных в любое время;</li>
            <li>Обращаться с вопросами и жалобами по вопросам защиты данных.</li>
          </ul>
        </section>

        <section id="security">
          <h2>Как мы защищаем ваши данные</h2>
          <p>
            Мы принимаем технические и организационные меры для защиты ваших данных от
            несанкционированного доступа, утраты или искажения. Все персональные данные
            обрабатываются в соответствии с действующим законодательством.
          </p>
        </section>

        <section id="features">
          <h2>Ваши возможности на сайте</h2>
          <ul>
            <li>Просматривать страницы «О проекте», «Юнги», «Биография», «Политика конфиденциальности»;</li>
            <li>Добавлять новых юнг, отправляя заявку через форму;</li>
            <li>Отправлять обратную связь о работе ресурса через форму обратной связи.</li>
          </ul>
        </section>

        <section id="storage">
          <h2>Хранение данных</h2>
          <p>
            Данные, предоставленные вами через формы, хранятся на защищенных серверах в
            течение срока, необходимого для обработки ваших запросов и поддержки работы сайта.
          </p>
        </section>

        <section id="changes">
          <h2>Изменения в Политике конфиденциальности</h2>
          <p>
            Мы оставляем за собой право вносить изменения в Политику конфиденциальности.
            Актуальная версия всегда доступна на странице сайта. Рекомендуем регулярно
            проверять обновления.
          </p>
        </section>

        <section id="contacts">
          <h2>Контакты</h2>
          <p>По всем вопросам, связанным с защитой данных и работой сайта, вы можете обращаться к нам:</p>
          <ul>
            <li>Телефон: +7-910-950-03-93 / (4942) 55-16-21</li>
            <li>Email: <a href="mailto:navigator.dmc@yandex.ru">navigator.dmc@yandex.ru</a></li>
            <li>
              Социальные сети: <a href="https://vk.com/kym_dmc44" target="_blank" rel="noopener noreferrer">ВКонтакте</a>
            </li>
          </ul>
          <p>Муниципальное бюджетное учреждение дополнительного образования города Костромы «Детский морской центр»</p>
        </section>

        <div style={{ height: '300px' }} aria-hidden="true" />
      </main>
    </div>
  );
};

export default PrivacyPolicy;
