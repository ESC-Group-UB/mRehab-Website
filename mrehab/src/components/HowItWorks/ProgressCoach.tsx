import React from "react";
import styles from "./ProgressCoach.module.css";

export default function ProgressCoach() {
  return (
    <section className={styles.container}>
      <div className={styles.left}>
        <img
          src="/images/streak-badge.png"
          alt="Daily Streak Badge"
          className={styles.badge}
        />
        <div className={styles.banner}>🎉 You completed 3/3 sets today!</div>
      </div>

      <div className={styles.right}>
        <h2 className={styles.title}>Designed for Daily Progress</h2>
        <p className={styles.description}>
          Staying consistent is the key to recovery. mRehab uses daily reminders,
          motivational tracking, and a built-in AI coach that celebrates your milestones
          and keeps you going — every single day.
        </p>
        <blockquote className={styles.quote}>
          “The daily reminders really helped me stay on schedule. I didn’t even need
          a therapist check-in to stay motivated!”
          <span>– mRehab user</span>
        </blockquote>
      </div>
    </section>
  );
}
