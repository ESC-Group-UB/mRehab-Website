import React from "react";
import { Navbar } from "../../components/Navbar";
import SplitSection from "../../components/SplitSection";
import StepCard from "../../components/StepCard";
import GradientCTA from "../../components/GradientCTA";
import FeatureGridSection from "../../components/FeatureGridSection";
import styles from "./HowItWorks.module.css";

export function HowItWorks() {
  return (
    <>
      <Navbar />

      {/* Hero CTA */}
      <GradientCTA
        title="Smarter Rehab Starts Here"
        description="Get clinically proven results with expert-designed plans, AI guidance, and smart 3D-printed tools — all from the comfort of your home."
        buttonText="Get Started"
        buttonLink="/buy-now"
      />

      {/* Overview */}
      <SplitSection
        title="Rehabilitation, Simplified"
        description="mRehab blends custom 3D-printed hardware, licensed therapist protocols, and real-time AI feedback — all accessible through a seamless mobile app. No guesswork. No clinic scheduling. Just smarter, proven recovery."
        imageSrc="/logo512.png"
        imageOnLeft={false}
        primaryButtonText="Learn More"
      />

      {/* Step-by-step process */}
      <section className={styles.grid}>
        <StepCard
          iconPath="/logo512.png"
          title="Personalized Assessment"
          description="Get evaluated in minutes using guided movements and questions. Our AI engine analyzes your mobility to personalize your plan."
          actionText="Start Assessment"
          onActionClick={() => {}}
        />
        <StepCard
          iconPath="/logo512.png"
          title="Tailored Recovery Plan"
          description="Receive a custom exercise routine and precision-fit 3D-printed tools designed for your current abilities and therapy goals."
        />
        <StepCard
          iconPath="/logo512.png"
          title="AI-Guided Sessions"
          description="Use the mRehab app to follow your plan with real-time feedback and visual progress tracking. Stay engaged and accountable."
          actionText="See Demo"
          onActionClick={() => {}}
        />
      </section>

      {/* Why It Works */}
      <section className={styles.whyItWorks}>
        <h2>Clinically Proven to Improve Recovery</h2>
        <p className={styles.whySubtitle}>
          In a 6-week clinical study, patients using mRehab showed a
          <strong> 30% improvement in motor control</strong> compared to traditional home exercise programs.
        </p>
        <ul className={styles.benefits}>
          <li>✓ Designed in collaboration with licensed therapists</li>
          <li>✓ Tailored tools and plans, unique to each patient</li>
          <li>✓ Real-time guidance and progress tracking via AI</li>
          <li>✓ All-in-one kit shipped to your door</li>
        </ul>
      </section>

      {/* Coach Section */}
      <section className={styles.coachSection}>
        <div className={styles.coachText}>
          <h2>Your AI-Powered Rehab Coach</h2>
          <p>
            Your journey doesn’t end after setup. Our built-in AI assistant provides real-time motivation,
            counts reps, tracks precision, and gives you encouragement every step of the way.
          </p>
          <ul>
            <li>🎯 Tracks your sets & reps automatically</li>
            <li>📈 Alerts you to improvements and patterns</li>
            <li>🧠 Gives personalized encouragement</li>
            <li>🔔 Reminds you to stay consistent</li>
          </ul>
        </div>
        <div className={styles.coachImage}>
          <img src="/images/coach.png" alt="AI Rehab Coach" />
        </div>
      </section>

      {/* Feature Grid */}
      <FeatureGridSection
        sectionTitle="Why mRehab Works"
        features={[
          {
            icon: "/icons/sensor.png",
            title: "Smart Motion Tracking",
            description: "Your phone’s sensors monitor every movement with precision to ensure form and progress.",
          },
          {
            icon: "/icons/ai.png",
            title: "AI-Powered Feedback",
            description: "Our engine analyzes data in real time and adapts your recovery plan instantly.",
          },
          {
            icon: "/icons/tools.png",
            title: "3D-Printed Tools",
            description: "Custom-made tools designed to match your exact mobility needs — shipped to your door.",
          },
          {
            icon: "/icons/coach.png",
            title: "Built-in Virtual Coach",
            description: "Stay motivated and consistent with gentle nudges, tips, and milestone badges.",
          },
        ]}
      />

      {/* Final CTA */}
      <section className={styles.cta}>
        <h2>Your recovery journey starts today.</h2>
        <p className={styles.ctaSubtitle}>
          Get your personalized rehab kit and join thousands accelerating their progress with mRehab.
        </p>
        <button className={styles.ctaButton}>Order Your mRehab Kit</button>
      </section>
    </>
  );
}
