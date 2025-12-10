import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import MouseFollower from "@/components/MouseFollower";
import FloatingShapes from "@/components/FloatingShapes";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Youssef Ibrahim - Junior Front-End Developer</title>
        <meta name="description" content="Youssef Ibrahim - Junior Front-End Developer. Building responsive, user-friendly web applications with React.js and modern UI frameworks. Specialized in pixel-perfect designs and performance optimization." />
        <meta name="keywords" content="Frontend Developer, React, JavaScript, Web Development, UI Design, Responsive Design" />
        <meta name="author" content="Youssef Ibrahim" />
        <meta property="og:title" content="Youssef Ibrahim - Junior Front-End Developer" />
        <meta property="og:description" content="Building responsive, user-friendly web applications with React.js and modern UI frameworks." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Youssef Ibrahim - Junior Front-End Developer" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href="https://youssef-ibrahim.dev" />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <MouseFollower />
        <FloatingShapes />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
