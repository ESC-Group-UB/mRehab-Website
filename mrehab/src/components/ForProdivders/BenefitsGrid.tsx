const benefits = [
  "📈 Track adherence and form in real time",
  "🤖 AI ensures proper technique and alerts you",
  "📊 Visualize recovery progress via charts",
  "🔒 HIPAA-compliant and secure",
  "📱 Device-free setup (just a phone)",
  "🕒 Reduce unnecessary in-person visits",
];

export const BenefitsGrid = () => (
  <section className="benefits">
    <h2>Why Providers Choose mRehab</h2>
    <div className="grid">
      {benefits.map((b, i) => (
        <div key={i} className="benefit-box">
          {b}
        </div>
      ))}
    </div>
  </section>
);
