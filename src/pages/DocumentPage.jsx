import React from "react";

function DocumentPage() {
  return (
    <section className="section">
      <h2>CV / Resume</h2>
      <p>View the professional details and background of the founder, Kevin Kipkoech Kimutai.</p>
      
      <div className="split-section" style={{ marginTop: "24px", gridTemplateColumns: "0.6fr 1.4fr" }}>
        <article className="info-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <img 
            src="/founder-kevin.png" 
            alt="Kevin Kipkoech Kimutai" 
            style={{ 
              width: "120px", 
              height: "120px", 
              borderRadius: "50%", 
              objectFit: "cover",
              border: "2px solid var(--accent)" 
            }} 
          />
          <h3 style={{ marginTop: "16px", marginBottom: "4px" }}>Kevin Kipkoech Kimutai</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--muted)", margin: 0 }}>Eldoret, Kenya</p>
          <p style={{ fontSize: "0.85rem", color: "var(--accent-2)", margin: "4px 0" }}>Software Engineering Student</p>
          
          <div style={{ marginTop: "16px", width: "100%" }}>
            <a href="/kipkoechkevin.pdf" download className="btn btn-primary" style={{ width: "100%" }}>
              Download PDF CV
            </a>
          </div>
        </article>

        <article className="info-card" style={{ padding: 0, overflow: "hidden", minHeight: "650px", border: "1px solid var(--border)" }}>
          <iframe 
            src="/kipkoechkevin.pdf" 
            title="Kevin Kipkoech Kimutai CV" 
            width="100%" 
            height="650px" 
            style={{ border: "none" }}
          />
        </article>
      </div>
    </section>
  );
}

export default DocumentPage;
