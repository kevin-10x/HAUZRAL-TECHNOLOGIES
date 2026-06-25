import React from "react";

function AboutPage() {
  return (
    <section className="section">
      <h2>About Hauzral</h2>
      <p>
        Hauzral Technologies is a digital studio that partners with ambitious founders, teams, and
        operators to turn strategy into products, brands, and campaigns that feel polished from the
        first impression onward.
      </p>
      <div className="card-grid" style={{ marginTop: "24px" }}>
        <article className="project-card">
          <h3>What we do</h3>
          <p>Brand systems, growth campaigns, web experiences, and delivery operations.</p>
        </article>
        <article className="project-card">
          <h3>How we work</h3>
          <p>Fast discovery, cross-functional collaboration, and clear milestones for each launch.</p>
        </article>
        <article className="project-card">
          <h3>Who we support</h3>
          <p>Founders, startups, and growth-stage companies ready to make an impact.</p>
        </article>
      </div>
    </section>
  );
}

export default AboutPage;
