import React from "react";

function AboutPage() {
  return (
    <section className="section">
      <div className="hero" style={{ gap: "32px", gridTemplateColumns: "0.8fr 1.2fr" }}>
        <div style={{ textAlign: "center" }}>
          <img 
            src="/founder-kevin.png" 
            alt="Kevin Kipkoech Kimutai" 
            style={{ 
              width: "100%", 
              maxWidth: "280px", 
              borderRadius: "24px", 
              border: "2px solid var(--border)", 
              boxShadow: "var(--shadow)" 
            }} 
          />
          <div style={{ marginTop: "16px" }}>
            <h3 style={{ margin: "8px 0 4px" }}>Kevin Kipkoech Kimutai</h3>
            <p style={{ color: "var(--accent-2)", fontWeight: "600", margin: 0 }}>Founder & Lead Engineer</p>
            <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: "4px 0" }}>Eldoret, Kenya</p>
          </div>
        </div>

        <div>
          <span className="eyebrow">MEET THE FOUNDER</span>
          <h2 style={{ fontSize: "2.4rem", marginTop: "8px" }}>Driving Innovation at Hauzral</h2>
          <p className="hero-text">
            Kevin Kipkoech Kimutai is a highly motivated and passionate Software Engineering student at the University of Eastern Africa Baraton with a strong background in software development, artificial intelligence, and modern web technologies. 
          </p>
          <p className="hero-text">
            As the founder of <strong>Hauzral Technologies</strong>, Kevin demonstrates leadership, creativity, and entrepreneurial thinking. Through his startup, he aims to create scalable digital solutions, intelligent software systems, and AI-powered technologies that can contribute to the growth of businesses and the digital transformation of society.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
            <a href="mailto:kipkoechkev6@gmail.com" className="btn btn-secondary">
              Email Founder
            </a>
            <a href="https://www.linkedin.com/in/kevin-kipkoech-a10b11228" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              LinkedIn Profile
            </a>
            <a href="https://github.com/kevin10x" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              GitHub Profile
            </a>
            <a href="https://portfolio-2-flask-production.up.railway.app" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              View Portfolio
            </a>
            <a href="https://github.com/kevin-10x/HAUZRAL-TECHNOLOGIES" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              GitHub Repository
            </a>
          </div>
        </div>
      </div>

      <div className="split-section" style={{ marginTop: "48px" }}>
        <article className="info-card">
          <h3>Education</h3>
          <ul style={{ paddingLeft: "20px", color: "var(--muted)", lineHeight: "1.8" }}>
            <li>
              <strong>B.S. in Software Engineering</strong> (Expected 2026)<br />
              University of Eastern Africa Baraton
            </li>
            <li>
              <strong>Secondary Education</strong> (Grade B)<br />
              St. Peter's Marakwet High School
            </li>
            <li>
              <strong>Primary Education</strong> (Grade B+)<br />
              Salaba Academy
            </li>
          </ul>
        </article>

        <article className="info-card">
          <h3>Core Technical Skills</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", color: "var(--muted)" }}>
            <p><strong>Languages:</strong> Python, Java, JavaScript, C++, PHP, Kotlin, R, Dart</p>
            <p><strong>Web Tech:</strong> HTML5, CSS3, Bootstrap, React.js, Angular, Vue.js, Node.js, Express.js</p>
            <p><strong>Databases:</strong> MySQL, MongoDB</p>
            <p><strong>Tools:</strong> Git, GitHub, VS Code, REST APIs, Postman</p>
            <p><strong>AI & Data:</strong> LLMs, AI Architecture, Function Calling, ML Workflows, AI Automation</p>
          </div>
        </article>
      </div>

      <div style={{ marginTop: "32px" }}>
        <article className="info-card" style={{ width: "100%" }}>
          <h3>Certifications</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[
              "Front-End Development", "Back-End Development", "Java Programming", 
              "Bootstrap Framework", "React.js Development", "Angular Development", 
              "Vue.js Development", "Python Programming", "SQL Database Management", 
              "MongoDB NoSQL", "PHP Web Development", "Machine Learning Fundamentals", 
              "Kotlin Mobile Development", "R Programming for Data Analysis", 
              "Dart & Flutter Development"
            ].map(cert => (
              <span key={cert} style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                borderRadius: "999px",
                padding: "4px 12px",
                fontSize: "0.85rem",
                color: "var(--text)"
              }}>{cert}</span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default AboutPage;

