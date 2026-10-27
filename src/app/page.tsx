
const projects = [
  {
    number: "01",
    title: "AI Document Processing",
    category: "FULL-STACK · AI",
    description:
      "A document-processing application that extracts invoice information and integrates with Google Sheets.",
    stack: ["Python", "Django", "OCR", "APIs"],
    link: "https://github.com/yaaronn",
  },
  {
    number: "02",
    title: "HouseBoard",
    category: "WEB APPLICATION · GAME",
    description:
      "A number-based game exploring interactive gameplay, real-time communication, and multiplayer architecture.",
    stack: ["React", "Node.js", "Socket.IO"],
    link: "https://github.com/yaaronn",
  },
  {
    number: "03",
    title: "Planverse Technologies",
    category: "WEB DEVELOPMENT",
    description:
      "A professional training and technology services website built with React and Vite.",
    stack: ["React", "Vite", "JavaScript"],
    link: "https://github.com/yaaronn/planverse-technologies",
  },
];

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Python",
  "Django",
  "Node.js",
  "SQL",
  "Git",
  "REST APIs",
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <a className="logo" href="#home">
          YA<span>.</span>
        </a>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact" className="nav-cta">
            Let&apos;s talk <span>↗</span>
          </a>
        </div>
      </nav>

      <section className="hero container" id="home">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" />
            FULL-STACK DEVELOPER
          </div>

          <h1>
            Building digital
            <br />
            experiences that
            <br />
            <span>make a difference.</span>
          </h1>

          <p className="hero-description">
            I&apos;m YA — a developer who turns ideas into useful,
            thoughtful software, from intuitive interfaces to
            backend systems.
          </p>

          <div className="hero-actions">
            <a className="button button-primary" href="#projects">
              Explore my work <span>↗</span>
            </a>
            <a
              className="button button-secondary"
              href="https://github.com/yaaronn"
              target="_blank"
              rel="noreferrer"
            >
              GitHub <span>↗</span>
            </a>
          </div>

          <div className="hero-note">
            <span className="note-line" />
            Curious by nature. Builder by choice.
          </div>
        </div>

        <div className="code-card" aria-label="Developer code illustration">
          <div className="code-top">
            <div className="window-dots">
              <i />
              <i />
              <i />
            </div>
            <span>ya.ts</span>
            <span className="code-menu">•••</span>
          </div>

          <div className="code-content">
            <div><span className="line-no">01</span><span className="code-purple">const</span> developer = {"{"}</div>
            <div><span className="line-no">02</span>  name: <span className="code-green">&quot;YA&quot;</span>,</div>
            <div><span className="line-no">03</span>  role: <span className="code-green">&quot;Full-Stack Developer&quot;</span>,</div>
            <div><span className="line-no">04</span>  mindset: <span className="code-green">&quot;Always learning&quot;</span>,</div>
            <div><span className="line-no">05</span>  passion: [</div>
            <div><span className="line-no">06</span>    <span className="code-orange">&quot;Building&quot;</span>,</div>
            <div><span className="line-no">07</span>    <span className="code-orange">&quot;Problem solving&quot;</span>,</div>
            <div><span className="line-no">08</span>    <span className="code-orange">&quot;Creating&quot;</span></div>
            <div><span className="line-no">09</span>  ]</div>
            <div><span className="line-no">10</span>{"}"};</div>
            <div className="code-spacer" />
            <div><span className="line-no">11</span><span className="code-purple">export default</span> developer;</div>
          </div>

          <div className="code-bottom">
            <span><span className="status-dot" /> Available for opportunities</span>
            <span>UTF-8</span>
          </div>
        </div>

        <a className="scroll-cue" href="#about">
          <span className="scroll-icon">↓</span> SCROLL TO EXPLORE
        </a>
      </section>

      <section className="about section container" id="about">
        <div className="section-label">01 / ABOUT ME</div>
        <div className="about-content">
          <h2>
            I enjoy connecting
            <br />
            <span>ideas with technology.</span>
          </h2>
          <p>
            My approach combines practical development experience,
            curiosity, and a focus on solving real problems. I enjoy
            working across the stack and learning how each part of an
            application fits together.
          </p>
        </div>
      </section>

      <section className="section projects-section" id="projects">
        <div className="container">
          <div className="section-heading">
            <div>
              <div className="section-label">02 / SELECTED WORK</div>
              <h2>Things I&apos;ve built<span>.</span></h2>
            </div>
            <a
              className="text-link"
              href="https://github.com/yaaronn"
              target="_blank"
              rel="noreferrer"
            >
              More on GitHub ↗
            </a>
          </div>

          <div className="project-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.number}>
                <div className="project-top">
                  <span className="project-number">{project.number}</span>
                  <span className="project-arrow">↗</span>
                </div>
                <div className="project-category">{project.category}</div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-list">
                  {project.stack.map((item) => (
                    <span className="tag" key={item}>{item}</span>
                  ))}
                </div>
                <a
                  className="project-link"
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  View project <span>↗</span>
                </a>
              </article>
            ))}
          </div>
          <p className="content-note">
            Project summaries are an initial draft. We&apos;ll verify repository
            links, implementation details, and live demos before launch.
          </p>
        </div>
      </section>

      <section className="section container" id="skills">
        <div className="section-label">03 / TECH STACK</div>
        <div className="section-heading skills-heading">
          <h2>Tools of my trade<span>.</span></h2>
        </div>
        <p className="section-description">
          Technologies I work with and tools I&apos;m building experience in.
          We&apos;ll refine this list as the portfolio develops.
        </p>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div className="skill-item" key={skill}>
              <span className="skill-symbol">✳</span>
              {skill}
            </div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="container contact-inner">
          <div className="section-label">04 / GET IN TOUCH</div>
          <h2>
            Have an idea?
            <br />
            Let&apos;s build <span>something great.</span>
          </h2>
          <p>
            Open to meaningful projects, collaborations, and software
            engineering opportunities.
          </p>
          <a
            className="button button-primary"
            href="https://github.com/yaaronn"
            target="_blank"
            rel="noreferrer"
          >
            Connect on GitHub <span>↗</span>
          </a>
        </div>
      </section>

      <footer className="footer container">
        <a className="logo" href="#home">YA<span>.</span></a>
        <p>Designed with intention. Built with code.</p>
        <a href="#home">Back to top ↑</a>
        <span className="copyright">© {new Date().getFullYear()} YA</span>
      </footer>
    </main>
  );
}
