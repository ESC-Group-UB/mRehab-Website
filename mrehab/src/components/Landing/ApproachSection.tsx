import React from "react";
import "./ApproachSection.css";

export function ApproachSection() {
  return (
    <section className="approach-section">
      <div className="approach-container">
        <div className="approach-text">
          <h2>A Smarter, Simpler Way to Recover</h2>
          <p>
            Feel confident and supported every step of the way. mRehab makes it
            easy to stay on track with your recovery, right from home.
          </p>
          <div className="approach-features">
            <div className="feature">
              <div>
                <h4>Easy Setup</h4>
                <p>
                  Get started in minutes with simple tools and clear instructions.
                </p>
              </div>
            </div>
            <div className="feature">
              <div>
                <h4>Track Your Progress</h4>
                <p>
                  Stay motivated with personalized routines and visible progress.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="approach-image">
          <img src={"/bowl.png"} alt="User using mRehab kit" />
        </div>
      </div>
    </section>
  );
}
