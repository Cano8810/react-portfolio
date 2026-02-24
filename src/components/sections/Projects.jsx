import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import CardSwap, { Card } from '../ui/CardSwap';
import { FiX, FiExternalLink, FiGithub } from 'react-icons/fi';
import styles from './Projects.module.css';

const Projects = () => {
  const { t } = useLanguage();

  const workCards = useMemo(() => [
    {
      id: 1,
      label: t('cardWorkLabel'),
      icon: '◆',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
      number: '1',
      title: t('cardWorkTitle'),
      description: t('cardWorkDesc'),
      fullDescription: t('cardWorkFullDesc'),
      technologies: ['Full-Stack Development', 'Team Lead', 'Agile/Scrum', 'Code Reviews'],
      link: '#',
      github: '#'
    },
    {
      id: 2,
      label: t('cardInternLabel'),
      icon: '○',
      image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=400&fit=crop',
      number: '2',
      title: t('cardInternTitle'),
      description: t('cardInternDesc'),
      fullDescription: t('cardInternFullDesc'),
      technologies: ['Web Development', 'UI/UX', 'Datenbanken', 'API Design'],
      link: '#',
      github: '#'
    },
    {
      id: 3,
      label: t('cardCreativeLabel'),
      icon: '✦',
      image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=400&fit=crop',
      number: '3',
      title: t('cardCreativeTitle'),
      description: t('cardCreativeDesc'),
      fullDescription: t('cardCreativeFullDesc'),
      technologies: ['Figma', 'After Effects', 'Blender', 'Creative Coding'],
      link: '#',
      github: '#'
    },
    {
      id: 4,
      label: t('cardProjectsLabel'),
      icon: '≡',
      image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&h=400&fit=crop',
      number: '4',
      title: t('cardProjectsTitle'),
      description: t('cardProjectsDesc'),
      fullDescription: t('cardProjectsFullDesc'),
      technologies: ['React', 'Node.js', 'TypeScript', 'Open Source'],
      link: '#',
      github: '#'
    }
  ], [t]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);

  const currentCard = workCards[activeIndex];

  const handleCardClick = (index) => {
    setSelectedCard(workCards[index]);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  return (
    <section id="work" className={styles.projects}>
      <div className={styles.workContainer}>
        <div className={styles.workContent}>
          <h2 className={styles.workTitle} key={currentCard.title}>
            {currentCard.title}
          </h2>
          <p className={styles.workSubtitle} key={currentCard.description}>
            {currentCard.description}
          </p>
        </div>

        <div className={styles.cardSwapWrapper}>
          <CardSwap
            cardDistance={70}
            verticalDistance={80}
            delay={3500}
            pauseOnHover
            width={550}
            height={400}
            onCardChange={(index) => setActiveIndex(index)}
            onCardClick={handleCardClick}
          >
            {workCards.map((card) => (
              <Card key={card.id}>
                <div className={styles.cardContent}>
                  <div className={styles.cardLabel}>
                    <span className={styles.cardIcon}>{card.icon}</span>
                    <span>{card.label}</span>
                  </div>
                  <div
                    className={styles.cardImage}
                    style={{ backgroundImage: `url(${card.image})` }}
                  >
                    <span className={styles.cardNumber}>{card.number}</span>
                  </div>
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className={styles.closeButton} onClick={closeModal}>
                <FiX size={24} />
              </button>

              <div className={styles.modalContent}>
                <div
                  className={styles.modalImage}
                  style={{ backgroundImage: `url(${selectedCard.image})` }}
                >
                  <span className={styles.modalNumber}>{selectedCard.number}</span>
                </div>

                <div className={styles.modalInfo}>
                  <div className={styles.modalLabel}>
                    <span className={styles.modalIcon}>{selectedCard.icon}</span>
                    <span>{selectedCard.label}</span>
                  </div>

                  <h2 className={styles.modalTitle}>{selectedCard.title}</h2>
                  <p className={styles.modalDescription}>{selectedCard.fullDescription}</p>

                  <div className={styles.modalTech}>
                    {selectedCard.technologies.map((tech) => (
                      <span key={tech} className={styles.techBadge}>{tech}</span>
                    ))}
                  </div>

                  <div className={styles.modalActions}>
                    <a href={selectedCard.link} className={styles.modalButton} target="_blank" rel="noopener noreferrer">
                      <FiExternalLink /> View Project
                    </a>
                    <a href={selectedCard.github} className={styles.modalButtonSecondary} target="_blank" rel="noopener noreferrer">
                      <FiGithub /> Source Code
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;
