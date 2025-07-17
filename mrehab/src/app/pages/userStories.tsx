import React from "react";
import { Navbar } from "../../components/Navbar";
import { Testimonials } from "../../components/Landing/Testimonials";
import SplitSection from "../../components/SplitSection";
import styles from "./UserStories.module.css";
import TestimonialCarousel from "../../components/UserStories/TestimonialCarousel";
import GradientCTA from "../../components/GradientCTA";

export function UserStories() {

  const testimonials = [
    {
      image: "/images/people/patient2.jpg",
      quote: "I could finally cook without pain after 3 weeks of mRehab.",
      name: "Sarah L.",
    },
    {
      image: "/images/people/patient3.jpg",
      quote: "mRehab is clinically sound and truly improves patient outcomes.",
      name: "Dr. Ahmed R.",
    },
    {
      image: "/images/people/patient5.webp",
      quote: "The daily reminders and tracking made all the difference for me.",
      name: "Jason M.",
    },
    {
      image: "/images/people/patient4.jpg",
      quote: "I loved being able to rehab from home. So easy to stay consistent.",
      name: "Karen S.",
    },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <GradientCTA
        title="Real Stories. Real Results"
        description="Hear directly from patients and clinicians who trust mRehab to improve recovery outcomes and empower people to move again."
      />

      {/* Doctor Quote */}
      <SplitSection
        title="“A game-changer in at-home rehabilitation.”"
        description="As a licensed physical therapist, I’ve seen firsthand how mRehab increases patient adherence and accelerates progress — especially among those recovering from orthopedic injuries."
        imageSrc="/images/people/Therapist1.jpg"
        imageOnLeft={false}
        primaryButtonText="Read Clinical Results"
      />

      {/* Patient Story */}
      <SplitSection
        title="“I regained control of my hand in just weeks.”"
        description="After my stroke, I struggled with basic movement. Using mRehab every day helped me get back to cooking, typing, and even gardening. It’s like having a physical therapist in your pocket."
        imageSrc="/images/people/Patient1.jpg"
        imageOnLeft={true}
        primaryButtonText="Try mRehab"
      />

      {/* Testimonials Carousel or Grid */}
      <section className={styles.testimonialBlock}>


        <h2>More Stories from Our Community</h2>
        <TestimonialCarousel testimonials={testimonials} />

        <Testimonials />
      </section>
    </>
  );
}
