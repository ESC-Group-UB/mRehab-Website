import React from "react";
import styles from "./TestimonialCarousel.module.css";

interface Testimonial {
  image: string;
  quote: string;
  name?: string;
}

interface Props {
  testimonials: Testimonial[];
}

const TestimonialCarousel: React.FC<Props> = ({ testimonials }) => {
  // Duplicate the testimonials to make seamless looping easier
  const duplicated = [...testimonials, ...testimonials];

  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselTrack}>
        {duplicated.map((t, i) => (
          <div className={styles.card} key={i}>
            <img src={t.image} alt="Testimonial" className={styles.image} />
            <blockquote className={styles.quote}>“{t.quote}”</blockquote>
            {t.name && <p className={styles.name}>– {t.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
