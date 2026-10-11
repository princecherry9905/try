import './Hero.css';

export default function Hero({ children }) {
  return (
    <section className="hero-section" aria-label="Hero Banner">
      <div className="hero-container">
        <div className="hero-badge">
          <svg
            className="bi bi-stars hero-badge-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31z" />
          </svg>
          <span className="hero-badge-text">
            College Assignment 4 • Full-Stack CRUD Application
          </span>
        </div>

        <h1 className="hero-title">
          Next-Gen Student Administration{' '}
          <span className="hero-title-highlight">
            Built for Speed &amp; Simplicity
          </span>
        </h1>

        <p className="hero-description">
          Attendance, marks and notices for your whole college — in one place. Admins manage
          students and courses with ease, teachers record marks in seconds, and students always
          know where they stand.
        </p>

        {children && <div className="hero-actions">{children}</div>}
      </div>
    </section>
  );
}
