import re

with open('preview.html', 'r') as f:
    c = f.read()

# Replace Nav links
c = c.replace('<a href="#" class="navSignIn">Login</a>', '<a href="/dashboard" class="navSignIn">Login</a>')
c = c.replace('<a href="#" class="navCta">Start Free Trial</a>', '<a href="/dashboard" class="navCta">Start Free Trial</a>')

# Replace Hero CTAs HTML
old_html = """        <div class="heroCtas">
          <a href="#" class="heroCtaPrimary">Start Free Trial</a>
          <a href="#demo" class="heroCtaSecondary">Talk to Sales</a>
        </div>

        <p class="metaSubtext">No credit card required • Live in 5 minutes</p>"""

new_html = """        <div class="vapiWidgetContainer">
          <div class="vapiWidgetInner">
            <select class="vapiSelect">
              <option value="support">Customer Support</option>
              <option value="lead">Lead Qualification</option>
              <option value="sales">Outbound Sales</option>
            </select>
            <button class="vapiButton">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="vapiIcon">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Talk to Amira
            </button>
          </div>
          <div class="vapiMeta">
            <span class="vapiMetaText">Mic permissions needed • No credit card required</span>
          </div>
        </div>"""

c = c.replace(old_html, new_html)

# Replace Hero CTAs CSS
old_css = """    .heroCtas {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
      animation: fadeInUp 0.6s ease-out 0.3s both;
    }

    .heroCtaPrimary {
      background: #0052cc;
      color: #ffffff;
      padding: 0.875rem 2.25rem;
      border-radius: 100px;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .heroCtaPrimary:hover {
      background: #0065ff;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 82, 204, 0.4);
    }

    .heroCtaSecondary {
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: transparent;
      padding: 0.875rem 2.25rem;
      border-radius: 100px;
      font-size: 1rem;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .heroCtaSecondary:hover {
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.05);
    }"""

new_css = """    .vapiWidgetContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      animation: fadeInUp 0.6s ease-out 0.3s both;
      width: 100%;
      max-width: 480px;
    }

    .vapiWidgetInner {
      display: flex;
      align-items: stretch;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      overflow: hidden;
      width: 100%;
      height: 52px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.2);
    }

    .vapiSelect {
      flex: 1;
      background: transparent;
      color: #fff;
      border: none;
      padding: 0 1rem;
      font-family: inherit;
      font-size: 1rem;
      font-weight: 500;
      outline: none;
      cursor: pointer;
      appearance: none;
    }
    .vapiSelect option {
      background: #111;
      color: #fff;
    }

    .vapiButton {
      background: #ffffff;
      color: #000000;
      border: none;
      padding: 0 1.25rem;
      font-weight: 600;
      font-family: inherit;
      font-size: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
    }

    .vapiButton:hover {
      background: #f0f0f0;
    }

    .vapiIcon {
      width: 18px;
      height: 18px;
    }

    .vapiMeta {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .vapiMetaText {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.4);
      text-decoration: underline;
      text-decoration-style: dotted;
      text-underline-offset: 4px;
      cursor: pointer;
    }"""

c = c.replace(old_css, new_css)

# Update Media query
c = c.replace('.heroCtas { flex-direction: column; width: 100%; }', '')
c = c.replace('.heroCtaPrimary, .heroCtaSecondary { width: 100%; text-align: center; }', '')

with open('preview.html', 'w') as f:
    f.write(c)

print("Updates applied to preview.html successfully.")
