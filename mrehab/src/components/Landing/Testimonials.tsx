import React from "react";
import "./Testimonials.css";

const testimonials = [
  {
    quote:
      "After my stroke, I struggled to stay consistent with exercises. mRehab’s daily reminders and real-time feedback kept me on track — it’s like having a coach in my pocket. I’ve regained more control in my arm than I ever thought possible.",
    name: "Amanda Lee",
    role: "Patient, Stroke Recovery",
  },
  {
    quote:
      "mRehab bridges the gap between clinic visits and at-home therapy. The smart tools mimic real-life tasks, which is crucial for neuro rehab. My patients are not just recovering — they’re regaining independence.",
    name: "Dr. Marcus Bennett",
    role: "Physical Therapist, Buffalo Rehab Group",
  },
  {
    quote:
      "Rebuilding hand movement after my stroke felt overwhelming. But with mRehab, I could actually *see* my progress each week. That visual feedback kept me going, and now I can write again.",
    name: "Carlos M.",
    role: "Patient, Upper Limb Rehab",
  },
  {
    quote:
      "Most apps felt generic, but mRehab felt built just for me. The AI suggestions adapted to how I was doing each day, and the feedback helped me adjust my form without guessing.",
    name: "Sarah Nguyen",
    role: "Patient, Motor Recovery",
  },
  {
    quote:
      "The combination of evidence-based routines, 3D-printed rehab tools, and progress dashboards is unmatched. mRehab empowers both patients and clinicians — and at a fraction of the cost of traditional solutions.",
    name: "Dr. Nina Feldman",
    role: "Rehabilitation Specialist",
  },
  {
    quote:
      "The tools felt natural — like stacking cups or turning a doorknob. That made it easier to transfer what I practiced into everyday tasks. I’ve come a long way since starting mRehab.",
    name: "David R.",
    role: "Patient, Stroke Rehab",
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
