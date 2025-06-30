import React from 'react';
import './landing.css';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
  return (
    <>
      <Header />
      <div className="landing-hero">
        <video autoPlay loop muted playsInline className="hero-video">
          <source src="/videos/rehab-motion.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay">
          <h1>Revolutionizing Stroke Rehab</h1>
          <p>AI-driven therapy meets affordable 3D-printed recovery tools—all from home.</p>
          <Link to="/technologies/mobileapp" className="cta-button">Explore the App</Link>
        </div>
      </div>

      <section className="landing-features">
        <div className="feature">
          <img src="/icons/ai.png" alt="AI Icon" />
          <h3>AI-Guided Recovery</h3>
          <p>Real-time feedback and adaptive routines customized to your progress.</p>
        </div>
        <div className="feature">
          <img src="/icons/3dprint.png" alt="3D Print Icon" />
          <h3>3D-Printed Tools</h3>
          <p>Personalized rehab devices for just $15—designed for everyday use.</p>
        </div>
        <div className="feature">
          <img src="/icons/cloud.png" alt="Cloud Icon" />
          <h3>Remote Monitoring</h3>
          <p>Clinicians track recovery data seamlessly, enabling better outcomes.</p>
        </div>
      </section>

      <section className="impact-section">
        <h2>Why It Matters</h2>
        <p>Stroke survivors need more than routines—they need motivation, visibility, and tools that actually fit their lives. mRehab delivers just that.</p>
        <div className="stats">
          <div><h3>+30%</h3><p>Improvement in motor control</p></div>
          <div><h3>10x</h3><p>Cheaper than traditional rehab kits</p></div>
          <div><h3>98%</h3><p>User satisfaction with progress</p></div>
        </div>
      </section>

      <div>
        
      </div>

      <section className="cta-section">
        <h2>Start Your Recovery Journey</h2>
        <p>Discover how mRehab brings hospital-grade therapy into your living room.</p>
        <Link to="/contact" className="cta-button">Get In Touch</Link>
      </section>
    </>
  );
};

export default Landing;
