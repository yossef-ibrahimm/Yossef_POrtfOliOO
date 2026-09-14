import { memo } from 'react'
import { ExternalLink, Github, ArrowUpRight, Star, Zap } from 'lucide-react'

import appDietToDoor from '../assets/app diet to door.png'
import youss from '../assets/Youss.png'
import weatherApp from '../assets/weather app.png'
import cardValidation from '../assets/card validation.jpg'
import analogClock from '../assets/analog clock.png'
import quizApp from '../assets/quiz app.png'
import hangman from '../assets/hangman.png'
import typingSpeed from '../assets/typingSpeed.png'
import connect_four from '../assets/connect four.png'

const PROJECTS = [
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
      'An advanced typing speed game built with React that measures WPM, accuracy, and typing consistency.',
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
      'A modern Connect Four game built with React and Vite, featuring animated tokens, AI opponent mode, and responsive design.',
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
    description: 'A fully responsive weather app supporting multi-language display.',
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
    description: 'A responsive analog clock and stopwatch with smooth animations.',
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
    description: 'A responsive quiz app that loads questions dynamically from JSON.',
    image: quizApp,
    alt: 'Quiz App — dynamic JSON-powered quiz',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    liveUrl: 'https://yossef-ibrahimm.github.io/quiz-app/',
    githubUrl: 'https://github.com/yossef-ibrahimm/quiz-app',
    featured: false,
    color: '140, 70%, 45%',
  },
]

const ProjectCard = memo(({ project, index }) => {
  const cardNumber = String(index + 1).padStart(2, '0')

  return (
    <article
      aria-label={`Project: ${project.title}`}
      className="group relative h-full rounded-3xl overflow-hidden border bg-card flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-[transform,box-shadow] duration-200"
      style={{ borderColor: 'hsl(var(--border) / 0.5)' }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={project.image}
          alt={project.alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div
          className="absolute top-5 left-5 w-14 h-14 rounded-2xl border flex items-center justify-center"
          style={{
            backgroundColor: `hsl(${project.color}, 0.12)`,
            borderColor: `hsl(${project.color}, 0.4)`,
          }}
          aria-hidden="true"
        >
          <span className="text-xl font-black" style={{ color: `hsl(${project.color})` }}>
            {cardNumber}
          </span>
        </div>

        {project.featured && (
          <div
            className="absolute top-5 right-5 px-3 py-1.5 rounded-full border flex items-center gap-2"
            style={{
              backgroundColor: 'hsl(var(--primary) / 0.15)',
              borderColor: 'hsl(var(--primary) / 0.4)',
            }}
          >
            <Star className="w-3.5 h-3.5" style={{ color: 'hsl(var(--primary))' }} fill="currentColor" aria-hidden="true" />
            <span className="text-xs font-bold" style={{ color: 'hsl(var(--primary))' }}>Featured</span>
          </div>
        )}

        <div
          className="absolute inset-0 flex items-center justify-center gap-4 bg-black/40 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200"
          role="group"
          aria-label="Project links"
        >
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live demo`}
              className="p-3 rounded-2xl border border-white/20 bg-card/90 hover:bg-card transition-colors"
            >
              <ExternalLink className="w-5 h-5" style={{ color: 'hsl(var(--foreground))' }} aria-hidden="true" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub`}
              className="p-3 rounded-2xl border border-white/20 bg-card/90 hover:bg-card transition-colors"
            >
              <Github className="w-5 h-5" style={{ color: 'hsl(var(--foreground))' }} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col space-y-4">
        <h3 className="text-2xl font-black">{project.title}</h3>

        <p className="text-sm leading-relaxed line-clamp-2 flex-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              role="listitem"
              className="px-3 py-1.5 text-xs font-semibold rounded-full border"
              style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-3 py-1.5 text-xs font-semibold" style={{ color: 'hsl(var(--muted-foreground))' }}>
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </article>
  )
})

ProjectCard.displayName = 'ProjectCard'

export const ProjectsSection = () => {
  return (
    <section id="work" aria-labelledby="projects-heading" className="relative py-24 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border mb-8"
            style={{
              backgroundColor: 'hsl(var(--primary) / 0.1)',
              borderColor: 'hsl(var(--primary) / 0.2)',
            }}
          >
            <Zap className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} aria-hidden="true" />
            <span className="text-sm font-bold uppercase tracking-widest" style={{ color: 'hsl(var(--primary))' }}>
              Selected Work
            </span>
          </div>

          <h2 id="projects-heading" className="text-5xl md:text-7xl font-black mb-6">
            Featured Projects
          </h2>

          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: 'hsl(var(--muted-foreground))' }}>
            A collection of projects that showcase my passion for creating exceptional digital experiences
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Portfolio projects">
          {PROJECTS.map((project, index) => (
            <div key={project.title} role="listitem">
              <ProjectCard project={project} index={index} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-16">
          <a
            href="https://github.com/yossef-ibrahimm"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View all projects on GitHub"
            className="group px-8 py-4 rounded-2xl border flex items-center gap-3 font-bold text-lg hover:bg-primary/10 transition-colors"
            style={{ borderColor: 'hsl(var(--primary) / 0.3)', color: 'hsl(var(--foreground))' }}
          >
            View All Projects
            <ArrowUpRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default ProjectsSection
