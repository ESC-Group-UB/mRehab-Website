import React from 'react';
import './landing.css';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import {Navbar} from '../../components/Navbar';
import { Hero1 } from '../../components/Landing/Hero1';
import { Features } from '../../components/Landing/Features';
import { Testimonials } from '../../components/Landing/Testimonials';
import { ApproachSection } from '../../components/Landing/ApproachSection';
import ImpactSection from '../../components/Landing/ImpactSection';
const Landing: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero1/>
      <Features/>
      <Testimonials/>
      <ApproachSection/>
      <ImpactSection/>
      <section className="cta-section">
        <h2>Start Your Recovery Journey</h2>
        <p>Discover how mRehab brings hospital-grade therapy into your living room.</p>
        <Link to="/contact" className="cta-button">Get In Touch</Link>
      </section>
    </>
  );
};

export default Landing;
