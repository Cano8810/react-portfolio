import { useState, useEffect, useRef } from 'react';
import './WelcomeLoader.css';

const greetings = [
  "Hallo", "Hello", "Bonjour", "Hola", "你好",
  "مرحبا", "Привет", "Olá", "नमस्ते",
  "こんにちは", "Merhaba", "안녕하세요",
  "Hallo"
];

// Berechne Dauern einmalig außerhalb der Komponente
function calculateDurations() {
  const totalDuration = 2000;
  const totalWords = greetings.length - 1;
  const firstRel = 0.6;
  const secondRel = 0.5;
  const lastRel = 0.1;

  let relTimes = [firstRel, secondRel];
  for (let i = 2; i < totalWords; i++) {
    const ratio = (i - 2) / (totalWords - 3);
    relTimes.push(secondRel * Math.pow(lastRel / secondRel, ratio));
  }

  const sumRel = relTimes.reduce((a, b) => a + b, 0);
  const durations = relTimes.map(t => t / sumRel * totalDuration);
  durations.push(200);
  return durations;
}

const durations = calculateDurations();

function WelcomeLoader({ onComplete, onFinished }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    // Verhindere doppelte Ausführung durch Strict Mode
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    let timeoutId;
    let currentIdx = 0;

    function showNext() {
      if (currentIdx < greetings.length - 1) {
        setIsVisible(false);

        timeoutId = setTimeout(() => {
          currentIdx++;
          setCurrentIndex(currentIdx);
          setIsVisible(true);

          timeoutId = setTimeout(showNext, durations[currentIdx]);
        }, 50);
      } else {
        // Letztes Wort - Swipe up
        setIsSwiping(true);
        // Content soll jetzt laden während Swipe läuft
        onComplete?.();
        timeoutId = setTimeout(() => {
          setIsComplete(true);
          onFinished?.();
        }, 1150);
      }
    }

    // Starte nach der ersten Dauer
    timeoutId = setTimeout(showNext, durations[0]);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [onComplete, onFinished]);

  if (isComplete) return null;

  return (
    <div className={`welcome-loader ${isSwiping ? 'swiping' : ''}`}>
      <div className={`welcome-word ${isVisible ? 'visible' : 'hidden'}`}>
        • {greetings[currentIndex]}
      </div>
    </div>
  );
}

export default WelcomeLoader;
