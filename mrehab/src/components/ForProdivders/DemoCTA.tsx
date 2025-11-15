export const DemoCTA = ({ onCTA }: { onCTA: () => void }) => (
  <section className="final-cta">
    <h2>Start Guiding Recovery Smarter</h2>
    <p>Log in to your dashboard or reach out to see a live demo of mRehab in action.</p>
    <button onClick={onCTA}>Go to Dashboard</button>
  </section>
);
