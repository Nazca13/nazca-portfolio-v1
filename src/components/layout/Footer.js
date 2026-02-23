'use client';
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CyberButton from '../ui/CyberButton';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:nazca13developer@gmail.com?subject=${subject}&body=${body}`;
  };

  const footerRef = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-title', {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-title', start: 'top 85%' }
      });
      gsap.from('.form-group', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.cyber-form', start: 'top 85%' }
      });
      gsap.from('.form-submit', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.form-submit', start: 'top 90%' }
      });
      gsap.from('.info-block', {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-info', start: 'top 85%' }
      });
      gsap.from('.footer-bottom', {
        y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-bottom', start: 'top 95%' }
      });
    }, footerRef);
    return () => ctx.revert();
  });

  return (
    <footer className="footer-section container" ref={footerRef}>
      <div className="footer-content">

        {/* Left: Form */}
        <div className="footer-left">
          <h2 className="footer-title">let&apos;s work<br /><span className="text-outline">together</span></h2>
          <form className="cyber-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>what&apos;s your name?</label>
              <input type="text" placeholder="Your Name *" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>what&apos;s your email?</label>
              <input type="email" placeholder="your@email.com *" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>tell me about your project</label>
              <textarea placeholder="I want to create..." value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
            </div>
            <div className="form-submit">
              <CyberButton type="submit">send message</CyberButton>
            </div>
          </form>
        </div>

        {/* Right: Info */}
        <div className="footer-info">
          <div className="info-block">
            <h3>contact details</h3>
            <p><a href="mailto:nazca13developer@gmail.com" className="contact-link">nazca13developer@gmail.com</a></p>
            <p><a href="tel:+6285795980667" className="contact-link">+62 857-9598-0667</a></p>
          </div>
          <div className="info-block">
            <h3>socials</h3>
            <ul>
              <li><a href="https://instagram.com/nazca_nokaze" target="_blank" rel="noopener noreferrer">instagram</a></li>
              <li><a href="https://www.linkedin.com/in/nazca-nokaze-a809873a2/" target="_blank" rel="noopener noreferrer">linkedin</a></li>
              <li><a href="https://github.com/nazca13" target="_blank" rel="noopener noreferrer">github</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 nazca systems</span>
        <span>kota bandung, indonesia</span>
      </div>

      <style jsx global>{`
        /* === FOOTER MAIN SECTION === */
        .footer-section {
          padding-top: 70px;
          padding-bottom: 35px;
          border-top: 1px solid var(--border-subtle);
          background: linear-gradient(180deg, var(--bg) 0%, var(--bg-alt) 100%);
        }
        
        /* === FOOTER CONTENT GRID === */
        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 60px;
          align-items: start;
        }
        
        /* === LEFT SECTION (FORM) === */
        .footer-title {
          font-size: clamp(2.2rem, 5vw, 4.5rem);
          font-weight: 800;
          line-height: 0.9;
          margin-bottom: 35px;
          text-transform: none;
          letter-spacing: -0.02em;
        }
        
        .cyber-form {
          max-width: 500px;
        }
        
        .form-group {
          margin-bottom: 28px;
          border-bottom: 1px solid var(--border-medium);
          padding-bottom: 8px;
          transition: border-color var(--transition-base);
        }

        .form-group:focus-within {
          border-bottom-color: var(--primary);
        }
        
        label {
          display: block;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          margin-bottom: 10px;
          opacity: 0.6;
          text-transform: none;
          letter-spacing: 0.5px;
          transition: opacity var(--transition-base);
        }

        .form-group:focus-within label {
          opacity: 1;
          color: var(--primary);
        }
        
        input,
        textarea {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--fg);
          font-size: 0.95rem;
          outline: none;
          font-family: var(--font-main);
          resize: none;
          transition: all var(--transition-base);
        }

        input::placeholder,
        textarea::placeholder {
          color: var(--fg);
          opacity: 0.3;
        }

        input:focus::placeholder,
        textarea:focus::placeholder {
          opacity: 0.5;
        }
        
        textarea {
          height: 80px;
          line-height: 1.4;
        }

        .form-submit {
          margin-top: 35px;
        }
        
        /* === RIGHT SECTION (INFO) === */
        .footer-info {
          font-family: var(--font-mono);
          padding-top: 15px;
        }
        
        .info-block {
          margin-bottom: 35px;
        }
        
        .info-block h3 {
          opacity: 0.5;
          margin-bottom: 15px;
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          text-transform: none;
          font-weight: 600;
        }
        
        .info-block p,
        .info-block li a,
        .contact-link {
          font-size: 0.9rem;
          margin-bottom: 6px;
          display: block;
          color: var(--fg) !important;
          text-decoration: none !important;
          transition: all var(--transition-base);
          position: relative;
        }

        .contact-link:hover {
          color: var(--primary) !important;
        }
        
        .info-block li a::before {
          content: '→ ';
          opacity: 0;
          margin-right: -20px;
          transition: all var(--transition-base);
          color: var(--primary);
        }

        .info-block li a:hover::before {
          opacity: 1;
          margin-right: 5px;
        }

        .info-block li a:hover {
          color: var(--primary);
          transform: translateX(5px);
        }

        .info-block ul {
          list-style: none;
        }
        
        /* === FOOTER BOTTOM === */
        .footer-bottom {
          margin-top: 70px;
          padding-top: 22px;
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          font-family: var(--font-mono);
          font-size: 0.65rem;
          opacity: 0.5;
          text-transform: none;
          letter-spacing: 0.5px;
        }
        
        /* === RESPONSIVE === */
        @media (max-width: 768px) {
          .footer-section { padding-top: 60px; padding-bottom: 40px; }
          .footer-content {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          
          .footer-title {
            margin-bottom: 25px;
            font-size: clamp(2rem, 8vw, 3rem);
          }

          .form-group { margin-bottom: 25px; }

          input, textarea { font-size: 1rem; }

          .footer-info { padding-top: 0; }

          .info-block { margin-bottom: 30px; }
          .info-block p,
          .info-block li a,
          .contact-link { font-size: 0.95rem !important; word-break: break-all; }

          .footer-bottom {
            margin-top: 50px;
            flex-direction: column;
            gap: 10px;
            text-align: center;
          }

          .form-submit { margin-top: 30px; }
        }
      `}</style>
    </footer>
  );
}