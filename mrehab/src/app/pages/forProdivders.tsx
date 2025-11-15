import React from "react";
import { Navbar } from "../../components/Navbar";
import SplitSection from "../../components/SplitSection";
import GradientCTA from "../../components/GradientCTA";
import styles from "./forProdivders.module.css";

export function ForProviders() {

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Section 1 – Core Benefit */}
      <SplitSection
        title="Built for Modern Healthcare Providers"
        description="mRehab empowers clinicians with tools to assign rehab plans, monitor patient progress remotely, and ensure consistency. All without the need for additional equipment. Stay connected to your patients' recovery, wherever they are."
        imageSrc="/images/people/pro3.png"
        imageOnLeft={true}
        primaryButtonText="Explore Dashboard"
      />

      {/* Section 2 – AI + Outcomes
      <SplitSection
        title="Improve Outcomes with AI-Powered Insights"
        description="Our intelligent engine provides real-time feedback on each patient’s technique, adherence, and progress trends — helping you adjust treatment plans and catch issues early."
        imageSrc="/images/ai-feedback.png"
        imageOnLeft={false}
        primaryButtonText="See Example"
      /> */}

      {/* Section 3 – Rehab from Anywhere */}
      <SplitSection
        title="Deliver Effective Rehab from Anywhere"
        description="No clinic visit? No problem. Patients complete guided sessions with their phone while you monitor their movement data, pain reports, and engagement metrics remotely."
        imageSrc="/images/product/Graphs.png"
        imageOnLeft={false}
      />

      {/* Final Custom CTA */}
      <section className={styles.finalCta}>
        <h2>Clinically Proven to Improve Outcomes</h2>
        <p>
          In a recent 6-week study, all stroke patients using mRehab <strong>significantly improved </strong> motor control.
          With real-time data, and personalized tools, mRehab helps clinicians deliver smarter, measurable care.
        </p>
      </section>

      {/* Branded Gradient CTA */}
      <GradientCTA
        title="Your Patients Deserve Better"
        description="Ready to boost patient outcomes and streamline rehab management? Recommend mRehab or try the clinician dashboard now."
        buttonText="Go To Dashboard"
        buttonLink="/dashboard"
      />
    </div>
  );
}
