import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    quote:
      "I was nervous about recovering at home after surgery, but mRehab made it feel like I had a personal trainer guiding me every step. The exercises were easy to follow, and the tools actually made rehab something I looked forward to.",
    name: "Amanda Lee",
    role: "Patient, Post-Op Recovery",
  },
  {
    quote:
      "As a physical therapist, I love how mRehab supports my patients outside the clinic. The adaptive routines and progress tracking help them stay engaged and on target between visits.",
    name: "Dr. Marcus Bennett",
    role: "Physical Therapist, Buffalo Rehab Group",
  },
  {
    quote:
      "The app helped me regain strength in my hand after an injury at work. I could actually see my progress week by week, and that kept me motivated.",
    name: "Carlos M.",
    role: "Patient, Hand Injury Recovery",
  },
  {
    quote:
      "I’ve tried other recovery apps, but mRehab is by far the most intuitive and effective. The AI suggestions felt personalized, and the feedback was spot on.",
    name: "Sarah Nguyen",
    role: "Home User, Daily Rehab",
  },
  {
    quote:
      "mRehab is exactly what modern rehab should look like — affordable, personalized, and accessible. The 3D tools are innovative and patients love using them.",
    name: "Dr. Nina Feldman",
    role: "Rehabilitation Specialist",
  },
  {
    quote:
      "Between the smart tools and the easy-to-use app, I felt like I was in control of my recovery. I’ve already recommended mRehab to two of my friends.",
    name: "David R.",
    role: "Patient, Knee Injury",
  },
];

export function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>Customer Testimonials</h2>
        <p>mRehab changed my recovery journey for the better!</p>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((t, index) => (
          <div className="testimonial-card" key={index}>
            <div className="stars">★★★★★</div>
            <p className="quote">“{t.quote}”</p>
            <div className="author">
              <div className="avatar-placeholder" />
              <div className="author-info">
                <div className="name">{t.name}</div>
                <div className="role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
