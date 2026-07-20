import { useEffect, useRef, useState } from 'react';
import { useScrollTrigger } from '../hooks/useScrollTrigger';
import { useAnime } from '../hooks/useAnime';
import { useMagnetic } from '../hooks/useMagnetic';

const Contact = () => {
  const { ref: sectionRef, isVisible } = useScrollTrigger({ threshold: 0.15 });
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { animate, timeline } = useAnime();
  const magneticBtnRef = useMagnetic(0.2);

  useEffect(() => {
    if (!isVisible || !timeline) return;
    const tl = timeline();

    tl.add({
      targets: formRef.current.querySelectorAll('.contact-stagger'),
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1000,
      delay: anime.stagger(120),
      easing: 'easeOutExpo'
    });

    return () => tl.pause();
  }, [isVisible, timeline]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (animate && e.target.value) {
      animate({
        targets: e.target.parentElement.querySelector('.input-label'),
        translateY: -24,
        scale: 0.85,
        color: '#c9a84c',
        duration: 300,
        easing: 'easeOutCubic'
      });
    }
  };

  const handleFocus = (e) => {
    if (!animate) return;
    animate({
      targets: e.target.parentElement.querySelector('.input-line'),
      scaleX: [0, 1],
      duration: 500,
      easing: 'easeOutExpo'
    });
    // Glow effect on focus
    animate({
      targets: e.target,
      boxShadow: ['0 0 0 rgba(201,168,76,0)', '0 4px 20px rgba(201,168,76,0.08)'],
      duration: 400,
      easing: 'easeOutCubic'
    });
  };

  const handleBlur = (e) => {
    if (!animate) return;
    if (!e.target.value) {
      animate({
        targets: e.target.parentElement.querySelector('.input-label'),
        translateY: 0,
        scale: 1,
        color: '#6a6458',
        duration: 300,
        easing: 'easeOutCubic'
      });
    }
    animate({
      targets: e.target.parentElement.querySelector('.input-line'),
      scaleX: 0,
      duration: 400,
      easing: 'easeInCubic'
    });
    animate({
      targets: e.target,
      boxShadow: '0 0 0 rgba(201,168,76,0)',
      duration: 300,
      easing: 'easeOutCubic'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        setStatus({ type: 'success', message: 'Message sent successfully!' });
        setFormData({ name: '', email: '', message: '' });
        if (animate) {
          animate({
            targets: formRef.current.querySelector('.submit-btn'),
            scale: [1, 1.15, 1],
            duration: 600,
            easing: 'easeOutElastic(1, .5)'
          });
        }
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please check your connection.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="contact-section" ref={sectionRef}>
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="section-label mono contact-stagger">04 / Contact</span>
            <h2 className="contact-title contact-stagger">
              Let's build <span className="gold-text">something</span> together
            </h2>
            <p className="contact-text contact-stagger">
              Have a project in mind or want to collaborate? I'm always open to
              discussing new opportunities and creative ideas.
            </p>

            <div className="contact-links contact-stagger">
              <a href="mailto:vezziren@gmail.com" className="contact-link magnetic-link" data-cursor-hover>
                <span className="link-icon">✉</span>
                <div>
                  <span className="link-label">Email</span>
                  <span className="link-value">vezziren@gmail.com</span>
                </div>
              </a>
              <div className="contact-link socials-card">
                <span className="link-icon">☺</span>
                <div>
                  <span className="link-label">Socials</span>
                  <div className="social-list">
                    <span className="social-item">Instagram: Vezziren</span>
                    <span className="social-item">Discord: shadow6v</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group contact-stagger">
              <label className="input-wrapper">
                <span className="input-label">Your Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  className="form-input"
                  aria-label="Your Name"
                />
                <span className="input-line" />
              </label>
            </div>

            <div className="form-group contact-stagger">
              <label className="input-wrapper">
                <span className="input-label">Email Address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  className="form-input"
                  aria-label="Email Address"
                />
                <span className="input-line" />
              </label>
            </div>

            <div className="form-group contact-stagger">
              <label className="input-wrapper">
                <span className="input-label">Your Message</span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  rows={5}
                  className="form-input form-textarea"
                  aria-label="Your Message"
                />
                <span className="input-line" />
              </label>
            </div>

            {status.message && (
              <div className={`form-status ${status.type} contact-stagger`} role="alert">
                {status.message}
              </div>
            )}

            <div ref={magneticBtnRef} className="contact-stagger">
              <button
                type="submit"
                className="btn btn-primary submit-btn w-full justify-center gap-3"
                disabled={isSubmitting}
                data-cursor-hover
              >
                {isSubmitting ? (
                  <span className="btn-spinner">
                    <span className="spinner-dot" />
                    <span className="spinner-dot" />
                    <span className="spinner-dot" />
                  </span>
                ) : (
                  <>
                    Send Message
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .contact-section {
          padding: 8rem 0;
          position: relative;
          z-index: 1;
          background: linear-gradient(180deg, transparent 0%, rgba(12,12,12,0.92) 15%, rgba(12,12,12,0.92) 85%, transparent 100%);
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 6rem;
          align-items: start;
        }
        .contact-info {
          position: sticky;
          top: 8rem;
        }
        .contact-title {
          margin: 1rem 0 1.5rem;
          font-size: clamp(2rem, 4vw, 3rem);
          color: var(--text-primary);
        }
        .contact-text {
          color: var(--text-secondary);
          margin-bottom: 3rem;
          line-height: 1.8;
        }
        .contact-links {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .contact-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--bg-tertiary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .contact-link:hover {
          border-color: var(--accent-gold);
          transform: translateX(8px);
          box-shadow: 0 4px 20px rgba(201, 168, 76, 0.1);
        }
        .socials-card {
          align-items: flex-start;
        }
        .link-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          border-radius: var(--radius-sm);
          font-size: 1.2rem;
          flex-shrink: 0;
        }
        .link-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.25rem;
        }
        .link-value {
          display: block;
          font-weight: 600;
          color: var(--text-primary);
        }
        .social-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .social-item {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        .contact-form {
          background: var(--bg-primary);
          padding: 3rem;
          border-radius: var(--radius-xl);
          border: 1px solid var(--border-subtle);
          position: relative;
          overflow: hidden;
        }
        .contact-form::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(201, 168, 76, 0.03) 0%, transparent 70%);
          pointer-events: none;
        }
        .form-group {
          margin-bottom: 2rem;
        }
        .input-wrapper {
          position: relative;
          display: block;
        }
        .input-label {
          position: absolute;
          left: 0;
          top: 1rem;
          color: var(--text-muted);
          font-size: 0.95rem;
          pointer-events: none;
          transition: all 0.3s ease;
          transform-origin: left top;
        }
        .form-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border-subtle);
          padding: 1rem 0;
          color: var(--text-primary);
          font-family: var(--font-primary);
          font-size: 1rem;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-input:focus {
          border-color: var(--accent-gold);
        }
        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }
        .input-line {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-gold), var(--accent-beige));
          transform: scaleX(0);
          transform-origin: left;
        }
        .form-status {
          padding: 1rem;
          border-radius: var(--radius-sm);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .form-status.success {
          background: rgba(0, 255, 136, 0.08);
          border: 1px solid rgba(0, 255, 136, 0.15);
          color: #00ff88;
        }
        .form-status.error {
          background: rgba(255, 80, 80, 0.08);
          border: 1px solid rgba(255, 80, 80, 0.15);
          color: #ff5050;
        }
        .submit-btn {
          width: 100%;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(201, 168, 76, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .btn-spinner {
          display: flex;
          gap: 4px;
        }
        .spinner-dot {
          width: 6px;
          height: 6px;
          background: var(--bg-primary);
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite both;
        }
        .spinner-dot:nth-child(1) { animation-delay: -0.32s; }
        .spinner-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @media (max-width: 968px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .contact-info {
            position: static;
          }
          .contact-form {
            padding: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
