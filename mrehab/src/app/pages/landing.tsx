import React from 'react';
import './landing.css';
import {Navbar} from '../../components/Navbar';
import { Hero1 } from '../../components/Landing/Hero1';
import { Features } from '../../components/Landing/Features';
import { ApproachSection } from '../../components/Landing/ApproachSection';
import ImpactSection from '../../components/Landing/ImpactSection';
import GradientCTA from '../../components/GradientCTA';
const Landing: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero1/>
      <Features/>
      {/* <Testimonials/>
      Removed for demo accuracy */}
      <ApproachSection/>
      <ImpactSection/>
      <GradientCTA
        title="Start Your Recovery Journey"
        description="Discover how mRehab brings clincal-grade therapy into your living room."
        buttonText="Buy Now"
        buttonLink="/buy-now"
      />
    </>
  );
};

export default Landing;

