import React from "react";

function Footer() {
  return (
    <footer className="footer" style={{ padding: "40px 24px 60px", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "24px", alignItems: "stretch" }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "24px" }}>
        <div style={{ maxWidth: "600px" }}>
          <h2>Let’s build momentum together.</h2>
          <p>
            From strategy and product design to launch campaigns and client delivery, Hauzral helps
            ambitious teams move faster and with more confidence.
          </p>
          <p style={{ marginTop: "16px", fontWeight: "600" }}>
            📧 <a href="mailto:hauzraladamae@gmail.com" style={{ color: "var(--text)", textDecoration: "none" }}>hauzraladamae@gmail.com</a> 
            &nbsp;•&nbsp; 
            📞 <a href="tel:0716606232" style={{ color: "var(--text)", textDecoration: "none" }}>0716606232</a>
          </p>
        </div>

        <div>
          <h3>Connect with us</h3>
          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            {/* YouTube */}
            <a 
              href="https://www.youtube.com/channel/UCUfCiOOTAFhT8bC4E0WC4AQ" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="YouTube"
              style={{
                display: "inline-grid",
                placeItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.104 1.981l-.014.134-.018.162a16.401 16.401 0 0 1-.218 1.5l-.019.102a2.007 2.007 0 0 1-1.415 1.419c-1.121.303-5.289.333-6.11.335h-.09c-.823-.003-4.987-.033-6.11-.335a2.01 2.01 0 0 1-1.415-1.42 16.299 16.299 0 0 1-.223-1.402l-.01-.104-.022-.261-.008-.104c-.065-.914-.073-1.77-.074-1.957v-.075c.001-.194.01-1.108.104-1.981l.014-.134.019-.162a16.386 16.386 0 0 1 .218-1.5l.019-.102A2.007 2.007 0 0 1 2.22 2.334C3.34 2.03 7.51 2 8.05 2h.002zm-.298 5.687L10.082 8 7.753 9.313V7.686z"/>
              </svg>
            </a>

            {/* TikTok */}
            <a 
              href="https://www.tiktok.com/@hauzraltechnologies" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="TikTok"
              style={{
                display: "inline-grid",
                placeItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.1)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.09-1.51-.77-.6-1.39-1.39-1.81-2.3v9.06c.07 1.94-.48 3.97-1.74 5.48-1.32 1.62-3.41 2.66-5.55 2.7-2.2-.02-4.42-1.01-5.74-2.77-1.41-1.84-1.83-4.43-1.07-6.66.65-2.02 2.26-3.76 4.31-4.46 1.14-.38 2.37-.46 3.55-.26v4.02c-.89-.25-1.87-.2-2.7.27-1.12.61-1.87 1.87-1.92 3.16-.02 1.05.34 2.13 1.06 2.87.8.84 2.02 1.25 3.17 1.07 1.18-.15 2.24-1.03 2.53-2.22.1-.41.13-.84.12-1.27v-13.4z"/>
              </svg>
            </a>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/hauzraladamae" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Instagram"
              style={{
                display: "inline-grid",
                placeItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(225, 48, 108, 0.1)",
                color: "#e1306c",
                border: "1px solid rgba(225, 48, 108, 0.2)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
            </a>

            {/* X */}
            <a 
              href="https://x.com/hauzraltech" 
              target="_blank" 
              rel="noopener noreferrer" 
              title="X (Twitter)"
              style={{
                display: "inline-grid",
                placeItems: "center",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "rgba(0, 0, 0, 0.05)",
                color: "var(--text)",
                border: "1px solid var(--border)",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--muted)" }}>
        <span>© {new Date().getFullYear()} Hauzral Technologies. All rights reserved.</span>
        <span>Built with momentum in Eldoret, Kenya.</span>
      </div>
    </footer>
  );
}

export default Footer;
