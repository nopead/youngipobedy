import React, { useEffect } from 'react';
import './AboutPage.scss';
import FeedBackForm from '../../components/layout/FeedBackForm';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const TITLE = 'О проекте';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect (() => {
      document.title = TITLE;
    }, []);

  return (
    <div className="about-container">
      <motion.h1
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        transition={{ duration: 0.6 }}
      >
        ЮНГИ ПОБЕДЫ ЗЕМЛИ КОСТРОМСКОЙ
      </motion.h1>

      <section>
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Школа юнгов ВМФ СССР
        </motion.h2>

        {[
          `Победа в Великой Отечественной войне 1941–1945 годов ковалась на фронте и в тылу не только зрелыми людьми, но и подростками. Мальчишки рвались на фронт, но в ответ слышали: «Подрастите!».`,
          `В 1942 году по приказу Народного комиссара ВМФ СССР Н.Г. Кузнецова были открыты школы юнгов военно-морского флота при Учебном отряде Северного флота на Соловецких островах и юнг вспомогательных судов Беломорской флотилии в г. Архангельске. Школы были укомплектованы 14–16-летними мальчишками, которые мечтали получить морскую специальность, воевать на боевых кораблях и защищать Родину от фашистских захватчиков.`,
          `И воевали юнги достойно! Но вернулись, к сожалению, не все. Бывшие юнги – каждый Личность.`,
          `<b>25 мая 1942 года</b> по приказу народного комиссара Военно-морского флота СССР <b>Николая Герасимовича Кузнецова</b> на Соловецких островах была создана школа юнгов. Занятия начались 1 сентября 1942 года. 7 ноября юнги приняли воинскую присягу, школа стала полноправной воинской частью с боевым знаменем.`,
          `Учились морским наукам, несли караульную службу по уставу. Руководили школой кадровые офицеры. Период с 1942 по 1945 год школа подготовила более <b>4000</b> специалистов — боцманов, рулевых, радистов, мотористов, электриков. Выпускники воевали на Северном, Балтийском, Черноморском и других флотах. <b>Каждый четвёртый</b> юнга погиб при выполнении воинского долга.`,
        ].map((text, i) => (
          <motion.p
            key={i}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariant}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        ))}
      </section>

      <motion.div
        className="video-wrapper"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <iframe
          src="https://vk.com/video_ext.php?oid=-158706371&id=456239086&hd=2&autoplay=1"
          width="1200"
          height="700"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
          frameBorder="0"
          allowFullScreen
          title="Видео о Соловецкой школе юнг"
        ></iframe>
      </motion.div>

      <motion.blockquote
        className="quote-block"
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <p>«Юнги — это особые люди…»</p>
        <footer>— Н.Г. Кузнецов</footer>
      </motion.blockquote>

      <section>
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          Наш проект
        </motion.h2>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          В наше время требуется сохранять историческую память в удобной и доступной форме. Большая часть информации о подвигах костромичей-соловецких юнг хранится на бумажных носителях, выпускаемых, в том числе, Детским морским центром города Кострома. Эти данные ограничены в распространении и изучении. Этот ресурс сделает процесс ведения архивов доступным для всех.
        </motion.p>

        <motion.div
          className="quote-with-photo"
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <img src="/Smirnov_Evgeniy.jpg" alt="Смирнов Евгений Алексеевич" />
          <blockquote className="quote-block">
            <p>Сохранение памяти о соловецких юнгах — наш долг. Этот сайт делает уникальные архивы доступными каждому и помогает передать историю Костромских моряков будущим поколениям.</p>
            <footer>— Смирнов Евгений Алексеевич, старший методист</footer>
          </blockquote>
        </motion.div>
      </section>

      <section className="about-section">
        <motion.h2
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          Призыв к исследовательской работе
        </motion.h2>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          В регионе ещё много имён юнг, о которых пока нет информации. Каждый может помочь в создании Книги памяти соловецких юнг Костромского региона — исследовать биографии юнги-земляка.
        </motion.p>

        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          Обладаете информацией?
          <br />
          <button
            className="add-sailor-button"
            onClick={() => navigate('/add-sailor')}
          >
            ДОБАВИТЬ ЮНГУ
          </button>
        </motion.p>
      </section>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUpVariant}
        transition={{ duration: 0.6, delay: 1.7 }}
      >
        <FeedBackForm />
      </motion.div>
    </div>
  );
};

export default AboutPage;
