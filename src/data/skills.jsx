import {
  FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJs,
  FaPython, FaGitAlt, FaDocker, FaDatabase, FaNpm
} from 'react-icons/fa';
import {
  SiTypescript, SiMongodb, SiPostgresql, SiRedis,
  SiTailwindcss, SiVite, SiWebpack, SiFigma,
  SiNextdotjs, SiExpress, SiJest, SiGraphql
} from 'react-icons/si';

export const skills = {
  'Frontend': [
    { name: 'React', icon: <FaReact />, level: 90 },
    { name: 'TypeScript', icon: <SiTypescript />, level: 85 },
    { name: 'JavaScript', icon: <FaJs />, level: 95 },
    { name: 'HTML5', icon: <FaHtml5 />, level: 95 },
    { name: 'CSS3', icon: <FaCss3Alt />, level: 90 },
    { name: 'Tailwind CSS', icon: <SiTailwindcss />, level: 85 },
    { name: 'Next.js', icon: <SiNextdotjs />, level: 80 },
  ],
  'Backend': [
    { name: 'Node.js', icon: <FaNodeJs />, level: 85 },
    { name: 'Express', icon: <SiExpress />, level: 85 },
    { name: 'Python', icon: <FaPython />, level: 80 },
    { name: 'GraphQL', icon: <SiGraphql />, level: 75 },
    { name: 'MongoDB', icon: <SiMongodb />, level: 80 },
    { name: 'PostgreSQL', icon: <SiPostgresql />, level: 75 },
    { name: 'Redis', icon: <SiRedis />, level: 70 },
  ],
  'Tools & Others': [
    { name: 'Git', icon: <FaGitAlt />, level: 90 },
    { name: 'Docker', icon: <FaDocker />, level: 70 },
    { name: 'Vite', icon: <SiVite />, level: 85 },
    { name: 'Webpack', icon: <SiWebpack />, level: 75 },
    { name: 'npm', icon: <FaNpm />, level: 85 },
    { name: 'Jest', icon: <SiJest />, level: 80 },
    { name: 'Figma', icon: <SiFigma />, level: 75 },
  ],
};
