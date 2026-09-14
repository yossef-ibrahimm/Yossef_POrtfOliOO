import appDietToDoor from '../assets/app diet to door.png'
import youss from '../assets/Youss.png'
import weatherApp from '../assets/weather app.png'
import cardValidation from '../assets/card validation.jpg'
import analogClock from '../assets/analog clock.png'
import quizApp from '../assets/quiz app.png'
import hangman from '../assets/hangman.png'
import typingSpeed from '../assets/typingSpeed.png'
import connect_four from '../assets/connect four.png'

export const PROJECTS = [
  {
    title: 'Diet To Door App',
    description:
      'Diet To Door is a web application designed to help users select meals based on their caloric needs using MVC architecture.',
    image: appDietToDoor,
    alt: 'Diet To Door App — meal selection interface',
    technologies: ['HTML', 'CSS', 'JavaScript', 'Bootstrap', 'SASS', 'jQuery'],
    liveUrl: 'https://app.diettodoor.com/Login',
    githubUrl: '',
    featured: true,
    color: '175, 80%, 50%',
  },
  {
    title: 'Fit Tracker App',
    description:
      'A fitness app that helps users calculate calories and track daily intake with a clean React UI.',
    image: youss,
    alt: 'Fit Tracker App — calorie tracking dashboard',
    technologies: ['React', 'JavaScript', 'TailwindCSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/My_Fit_App/',
    githubUrl: 'https://github.com/yossef-ibrahimm/My_Fit_App',
    featured: true,
    color: '280, 70%, 60%',
  },
  {
    title: 'Hangman Game',
    description:
      'A classic Hangman game built with React and TailwindCSS, featuring interactive gameplay and responsive UI.',
    image: hangman,
    alt: 'Hangman Game — interactive word guessing game',
    technologies: ['React', 'JavaScript', 'TailwindCSS', 'TypeScript'],
    liveUrl: 'https://yossef-ibrahimm.github.io/Hangman_Pro/',
    githubUrl: 'https://github.com/yossef-ibrahimm/Hangman_Pro',
    featured: true,
    color: '190, 72%, 80%',
  },
  {
    title: 'Typing Speed Game',
    description:
      'An advanced typing speed game built with React that measures WPM, accuracy, and typing consistency, featuring real-time feedback, multiple modes, and a clean modern UI.',
    image: typingSpeed,
    alt: 'Typing Speed Game — WPM and accuracy tracker',
    technologies: ['React', 'TypeScript', 'Vite', 'TailwindCSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/Typing_Speed/',
    githubUrl: 'https://github.com/yossef-ibrahimm/Typing_Speed',
    featured: true,
    color: '120, 60%, 25%',
  },
  {
    title: 'Connect Four Game',
    description:
      'A modern Connect Four game built with React and Vite, featuring drag-and-drop gameplay, animated tokens, customizable player colors, AI opponent mode, and a fully responsive design.',
    image: connect_four,
    alt: 'Connect Four Game — two-player strategy game',
    technologies: ['React', 'TypeScript', 'Vite', 'TailwindCSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/connect-four/',
    githubUrl: 'https://github.com/yossef-ibrahimm/connect-four',
    featured: true,
    color: '200, 70%, 35%',
  },
  {
    title: 'Weather App',
    description:
      'A fully responsive weather app supporting multi-language display.',
    image: weatherApp,
    alt: 'Weather App — multi-language weather forecast',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/Weather_App/',
    githubUrl: 'https://github.com/yossef-ibrahimm/Weather_App',
    featured: true,
    color: '200, 80%, 50%',
  },
  {
    title: 'Card Validation',
    description: 'A website that validates Visa card information dynamically.',
    image: cardValidation,
    alt: 'Card Validation — Visa card number validator',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/visa_card_validation/',
    githubUrl: 'https://github.com/yossef-ibrahimm/visa_card_validation',
    featured: false,
    color: '45, 90%, 50%',
  },
  {
    title: 'Analog Clock',
    description:
      'A responsive analog clock and stopwatch with smooth animations.',
    image: analogClock,
    alt: 'Analog Clock — animated clock and stopwatch',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/analogclock-stopwatch/',
    githubUrl: 'https://github.com/yossef-ibrahimm/analogclock-stopwatch',
    featured: false,
    color: '330, 80%, 60%',
  },
  {
    title: 'Quiz App',
    description:
      'A responsive quiz app that loads questions dynamically from JSON.',
    image: quizApp,
    alt: 'Quiz App — dynamic JSON-powered quiz',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/quiz-app/',
    githubUrl: 'https://github.com/yossef-ibrahimm/quiz-app',
    featured: false,
    color: '140, 70%, 45%',
  },
]
