import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import CardSwap, { Card } from '../ui/CardSwap';
import { FiX, FiExternalLink, FiGithub } from 'react-icons/fi';
import styles from './Projects.module.css';

const workCards = [
  {
    id: 1,
    label: 'Beruf',
    icon: '◆',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=400&fit=crop',
    number: '1',
    title: 'Berufserfahrung',
    description: 'Professionelle Erfahrung in der Softwareentwicklung und IT-Branche.',
    fullDescription: 'Meine berufliche Laufbahn umfasst verschiedene Positionen in der Softwareentwicklung. Von der Konzeption bis zur Umsetzung komplexer Projekte bringe ich fundierte Erfahrung mit.',
    technologies: ['Full-Stack Development', 'Team Lead', 'Agile/Scrum', 'Code Reviews'],
    link: '#',
    github: '#'
  },
  {
    id: 2,
    label: 'Praktika',
    icon: '○',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&h=400&fit=crop',
    number: '2',
    title: 'Praktika & Praxis',
    description: 'Praktische Erfahrungen und Einblicke in verschiedene Unternehmen.',
    fullDescription: 'Durch verschiedene Praktika und Praxisphasen habe ich wertvolle Einblicke in unterschiedliche Arbeitsumgebungen und Technologien gewonnen.',
    technologies: ['Web Development', 'UI/UX', 'Datenbanken', 'API Design'],
    link: '#',
    github: '#'
  },
  {
    id: 3,
    label: 'Creatives',
    icon: '✦',
    image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&h=400&fit=crop',
    number: '3',
    title: 'Kreative Arbeiten',
    description: 'Design, Animationen und visuelle Projekte die begeistern.',
    fullDescription: 'Kreativität trifft auf Technologie. Meine kreativen Projekte umfassen UI/UX Design, Motion Graphics und experimentelle Webprojekte die Grenzen verschieben.',
    technologies: ['Figma', 'After Effects', 'Blender', 'Creative Coding'],
    link: '#',
    github: '#'
  },
  {
    id: 4,
    label: 'Projekte',
    icon: '≡',
    image: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&h=400&fit=crop',
    number: '4',
    title: 'Eigene Projekte',
    description: 'Persönliche Projekte und Open-Source Beiträge.',
    fullDescription: 'Neben meiner beruflichen Arbeit entwickle ich eigene Projekte und trage zu Open-Source bei. Diese Projekte ermöglichen es mir, neue Technologien zu erkunden und kreative Ideen umzusetzen.',
    technologies: ['React', 'Node.js', 'TypeScript', 'Open Source'],
    link: '#',
    github: '#'
  }
];

const Projects = () => {
  const { t } = useLanguage();
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
