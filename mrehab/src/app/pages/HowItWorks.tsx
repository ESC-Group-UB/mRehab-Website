import React from "react";
import { Navbar } from "../../components/Navbar";
import SplitSection from "../../components/SplitSection";
import StepCard from "../../components/StepCard";
import GradientCTA from "../../components/GradientCTA";
// import FeatureGridSection from "../../components/FeatureGridSection";
import styles from "./HowItWorks.module.css";

export function HowItWorks() {
  return (
    <>
      <Navbar />

      {/* Hero CTA */}
      <GradientCTA
        title="Smarter Rehab Starts Here"
        description="Get clinically proven results with expert-designed plans, instant guidance, and smart 3D-printed tools, all from the comfort of your home."
        buttonText="Get Started"
        buttonLink="/buy-now"
      />

      {/* Overview */}
      <SplitSection
        title="Rehabilitation, Simplified"
        description="mRehab blends custom 3D-printed hardware, functional therapy protocols, and real-time, all accessible through a seamless mobile app. No guesswork. No clinic scheduling. Just smarter, proven recovery."
        imageSrc="/images/product/product image 1.png"
        imageOnLeft={false}
      />

      {/* Step-by-step process */}
      <section className={styles.grid}>
        <StepCard
          title="Smart Motion Tracking"
          description="Your phone’s sensors monitor every movement with precision to ensure form and progress."
        />
        <StepCard
          title="Tailored Recovery Plan"
          description="Custom-made tools designed to specifically for your device, shipped to your door."
        />
        <StepCard
          title="Adaptive Rehab Tasks"
          description="Functional rehab activities designed to improve your specific mobility challenges"
          actionText="See Demo"
          onActionClick={() => {
        const videoSection = document.querySelector(`.${styles.whyItWorks}`);
        if (videoSection) {
          videoSection.scrollIntoView({ behavior: "smooth" });
        }
          }}
        />
      </section>

      {/* Why It Works */}
      <section className={styles.whyItWorks}>
        <h2>Clinically Proven to Improve Recovery</h2>
        <p className={styles.whySubtitle}>
          In a 6-week clinical study, patients using mRehab showed
          <strong> statistically significant improvements </strong> in motor control compared in stroke patients.
        </p>
        <video width="500" height="300" controls className={styles.demoVideo}>
          <source src="/images/product/Demo Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className={styles.caption}>
          Usability Demo of mRehab kit in clinical studys
        </p>
      </section>

      {/* Coach Section
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
      </section> */}

      {/* Feature Grid */}
      {/* <FeatureGridSection
        sectionTitle="Why mRehab Works"
        features={[
          {
            icon: "/icons/sensor.png",
            title: "Smart Motion Tracking",
            description: "Your phone’s sensors monitor every movement with precision to ensure form and progress.",
          },
          // {
          //   icon: "/icons/ai.png",
          //   title: "AI-Powered Feedback",
          //   description: "Our engine analyzes data in real time and adapts your recovery plan instantly.",
          // },
          {
            icon: "/icons/tools.png",
            title: "3D-Printed Tools",
            description: "Custom-made tools designed to specifically for your device, shipped to your door.",
          },
          {
            icon: "/icons/coach.png",
            title: "Adaptive Rehab Tasks",
            description: "Functional rehab activities designed to improve your specific mobility challenges",
          },
        ]}
      /> */}

      {/* Final CTA */}
      <section className={styles.cta}>
        <h2>Your recovery journey starts today.</h2>
        <p className={styles.ctaSubtitle}>
          Get your personalized rehab kit and join thousands accelerating their progress with mRehab.
        </p>
        <button
          className={styles.ctaButton}
          onClick={() => window.location.href = "/buy-now"}
        >
          Order Your mRehab Kit
        </button>
      </section>
    </>
  );
}
