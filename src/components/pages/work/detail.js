'use client';
import { useState, useRef, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

import Particles from '@/components/ui/Particles';
import CRTOverlay from '@/components/ui/CRTOverlay';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectDetailPage({ project }) {
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        return () => lenis.destroy();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 80) {
                setNavHidden(true);
            } else {
                setNavHidden(false);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useGSAP(() => {
        if (loading) return;
        ScrollTrigger.refresh();

        // Hero entrance animation
        const tl = gsap.timeline({ delay: 0.3 });
        tl.from(".detail-anim", {
            y: 80, opacity: 0, duration: 1, stagger: 0.08, ease: "power4.out"
        })
            .from(".nav-item", {
                y: -20, opacity: 0, duration: 0.8, ease: "power3.out"
            }, "-=0.6");

        // Scroll-triggered reveals
        gsap.utils.toArray(".scroll-reveal").forEach((el) => {
            gsap.from(el, {
                y: 50, opacity: 0, duration: 0.9, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%" }
            });
        });

        gsap.to(".cyber-progress", { scaleX: 1, ease: "none", scrollTrigger: { scrub: 0.3 } });

    }, [loading]);

    return (
        <main className="main-wrapper">
            <CRTOverlay onComplete={() => setLoading(false)} />
            <div className="cyber-progress" />
            <div className="noise-overlay" />
            <Particles />
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* --- NAVIGATION --- */}
            <nav className={`navbar ${navHidden ? 'nav-hidden' : ''}`}>
                <div className="container nav-container">
                    <Link href="/" className="nav-logo nav-item">nazca<span className="text-primary">.dev</span></Link>
                    <div className="nav-right">
                        <Link href="/work" className="nav-back nav-item">← back</Link>
                        <ThemeToggle />
                        <button className="hamburger nav-item" onClick={() => setSidebarOpen(true)} aria-label="Menu">
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="content-wrapper">

                {/* --- HERO / PROJECT HEADER --- */}
                <section className="detail-hero container">
                    <div className="detail-hero-inner">
                        <div className="detail-type detail-anim">
                            <span className="detail-badge" style={{ background: project.color, color: '#000' }}>
                                {project.type}
                            </span>
                        </div>

                        <h1 className="detail-title detail-anim">
                            {project.name}
                            <span className="detail-year" style={{ color: project.color }}> ({project.year})</span>
                        </h1>

                        <p className="detail-desc detail-anim">{project.desc}</p>

                        {/* CTA - only show if there's a real link */}
                        {project.link && project.link !== '#' && (
                            <div className="detail-cta detail-anim">
                                <a href={project.link} className="detail-btn" target="_blank" rel="noopener noreferrer" style={{ background: project.color }}>
                                    <span>live preview</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                                    </svg>
                                </a>
                            </div>
                        )}

                        {/* Metadata Grid */}
                        <div className="detail-meta detail-anim">
                            <div className="meta-item">
                                <span className="meta-label">category</span>
                                <span className="meta-value">{project.cat}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">role</span>
                                <span className="meta-value">{project.role}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">duration</span>
                                <span className="meta-value">{project.duration}</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">status</span>
                                <span className="meta-value meta-status">
                                    <span className="status-indicator" style={{ background: project.color }}></span>
                                    {project.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- PROJECT IMAGES --- */}
                <section className="detail-images container">
                    {project.images.map((img, i) => (
                        <img key={i} src={img} alt={`${project.name} - Page ${i + 1}`} className="detail-img" />
                    ))}
                </section>

                {/* --- FEATURES (only if present) --- */}
                {project.features && project.features.length > 0 && (
                    <section className="detail-section container scroll-reveal">
                        <div className="section-header">
                            <div className="section-label">features</div>
                            <div className="section-line"></div>
                        </div>
                        <div className="feature-list">
                            {project.features.map((feature, i) => (
                                <div key={i} className="feature-item scroll-reveal">
                                    <span className="feature-num" style={{ color: project.color }}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className="feature-text">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* --- TOOLS --- */}
                <section className="detail-section container scroll-reveal">
                    <div className="section-header">
                        <div className="section-label">tools & stack</div>
                        <div className="section-line"></div>
                    </div>
                    <div className="tools-grid">
                        {project.tools.map((tool, i) => (
                            <div key={i} className="tool-chip scroll-reveal">
                                {tool}
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- NEXT PROJECT / BACK --- */}
                <section className="detail-section container scroll-reveal">
                    <div className="detail-nav-bottom">
                        <Link href="/work" className="back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5" /><path d="M12 19l-7-7 7-7" />
                            </svg>
                            <span>all projects</span>
                        </Link>
                    </div>
                </section>

                <Footer />
            </div>

            <style jsx global>{`
                .main-wrapper { position: relative; background: var(--bg); color: var(--fg); min-height: 100vh; overflow-x: hidden; }
                .content-wrapper { position: relative; z-index: 10; }
                .text-primary { color: var(--primary); }
                .hidden-mobile { display: block; }

                /* --- NAV --- */
                .navbar {
                    position: fixed; top: 0; left: 0; width: 100%;
                    z-index: 40; padding: 25px 0;
                    background: var(--navbar-bg);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--navbar-border);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease;
                }
                .navbar.nav-hidden { transform: translateY(-100%); }
                .nav-container { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.8rem; text-transform: none; }
                .nav-logo { font-weight: bold; font-size: 1rem; letter-spacing: 2px; text-decoration: none !important; color: var(--fg) !important; font-family: var(--font-mono); }
                .nav-right { display: flex; align-items: center; gap: 25px; }
                .nav-back {
                    font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 1px;
                    color: var(--fg) !important; text-decoration: none !important;
                    opacity: 0.5; transition: all 0.3s;
                }
                .nav-back:hover { opacity: 1; color: var(--primary) !important; }
                .hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 5px; }
                .bar { width: 28px; height: 2px; background: var(--fg); transition: all 0.3s; }
                .hamburger:hover .bar { background: var(--primary); }
                .hamburger:hover .bar:nth-child(2) { width: 20px; }

                /* Progress Bar */
                .cyber-progress { position: fixed; top: 0; left: 0; height: 3px; width: 100%; background: var(--primary); z-index: 100; transform-origin: left; transform: scaleX(0); box-shadow: 0 0 10px var(--primary); }

                /* ========== DETAIL HERO ========== */
                .detail-hero {
                    padding-top: 150px;
                    padding-bottom: 60px;
                }
                .detail-hero-inner { max-width: 800px; }

                .detail-type { margin-bottom: 24px; }
                .detail-badge {
                    display: inline-block;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-family: var(--font-mono);
                    font-size: 0.65rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                }

                .detail-title {
                    font-size: clamp(3rem, 8vw, 7rem);
                    font-weight: 700;
                    line-height: 0.9;
                    letter-spacing: -0.04em;
                    text-transform: none;
                    margin-bottom: 28px;
                }
                .detail-year {
                    font-weight: 400;
                    font-size: clamp(1.5rem, 4vw, 3.5rem);
                }

                .detail-desc {
                    font-size: 1.15rem;
                    line-height: 1.7;
                    opacity: 0.6;
                    max-width: 650px;
                    margin-bottom: 45px;
                }

                /* Metadata Grid */
                .detail-meta {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0;
                    border: 1px solid var(--border-medium);
                    border-radius: 8px;
                    overflow: hidden;
                    margin-bottom: 40px;
                }
                .meta-item {
                    padding: 22px 24px;
                    border-right: 1px solid var(--border-medium);
                }
                .meta-item:last-child { border-right: none; }
                .meta-label {
                    display: block;
                    font-family: var(--font-mono);
                    font-size: 0.65rem;
                    text-transform: none;
                    letter-spacing: 1.5px;
                    opacity: 0.35;
                    margin-bottom: 10px;
                }
                .meta-value {
                    display: block;
                    font-size: 1rem;
                    font-weight: 600;
                }
                .meta-status {
                    display: flex; align-items: center; gap: 8px;
                }
                .status-indicator {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                    animation: statusPulse 2s infinite;
                }

                @keyframes statusPulse {
                    0%,100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255,255,255,0.4); }
                    50% { opacity: 0.7; box-shadow: 0 0 0 6px rgba(255,255,255,0); }
                }

                /* CTA Button */
                .detail-cta { margin-bottom: 40px; }
                .detail-btn {
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 16px 36px;
                    color: #fff;
                    border: none; border-radius: 8px;
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    text-transform: none;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .detail-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 40px rgba(255,255,255,0.15);
                }

                /* ========== PROJECT IMAGES ========== */
                .detail-images {
                    padding-top: 0;
                    padding-bottom: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
                .detail-img {
                    width: 82%;
                    max-width: 900px;
                    height: auto;
                    display: block;
                    margin: 0 auto;
                }

                /* ========== SECTIONS ========== */
                .detail-section {
                    padding-top: 70px;
                    padding-bottom: 70px;
                    border-top: 1px solid var(--border-medium);
                }
                .section-header { display: flex; align-items: center; gap: 30px; margin-bottom: 40px; }
                .section-label { font-family: var(--font-mono); font-size: 0.85rem; letter-spacing: 2px; opacity: 0.5; white-space: nowrap; }
                .section-line { flex: 1; height: 1px; background: var(--border-medium); }

                /* Features */
                .feature-list {
                    display: flex; flex-direction: column; gap: 0;
                    border-top: 1px solid var(--border-medium);
                }
                .feature-item {
                    display: flex; align-items: center; gap: 24px;
                    padding: 24px 0;
                    border-bottom: 1px solid var(--border-medium);
                    transition: all 0.3s;
                }
                .feature-item:hover {
                    padding-left: 20px;
                    background: var(--bg-alt);
                }
                .feature-num {
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                    font-weight: 700;
                    flex-shrink: 0;
                    opacity: 0.8;
                }
                .feature-text {
                    font-size: 1.05rem;
                    line-height: 1.5;
                    opacity: 0.8;
                }

                /* Tools */
                .tools-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .tool-chip {
                    padding: 12px 24px;
                    border: 1px solid var(--border-medium);
                    border-radius: 40px;
                    font-family: var(--font-mono);
                    font-size: 0.85rem;
                    font-weight: 500;
                    letter-spacing: 0.5px;
                    transition: all 0.3s;
                    cursor: default;
                }
                .tool-chip:hover {
                    background: var(--fg);
                    color: var(--bg);
                    border-color: var(--fg);
                }

                /* Bottom Nav */
                .detail-nav-bottom {
                    display: flex;
                    justify-content: center;
                }
                .back-link {
                    display: inline-flex; align-items: center; gap: 12px;
                    font-family: var(--font-mono);
                    font-size: 0.85rem;
                    letter-spacing: 1.5px;
                    text-transform: none;
                    color: var(--fg) !important;
                    text-decoration: none !important;
                    opacity: 0.5;
                    transition: all 0.3s;
                    padding: 14px 28px;
                    border: 1px solid var(--border-medium);
                    border-radius: 8px;
                }
                .back-link:hover {
                    opacity: 1;
                    border-color: var(--primary);
                    color: var(--primary) !important;
                }

                /* ========== RESPONSIVE ========== */
                @media (max-width: 768px) {
                    .hidden-mobile { display: none; }

                    .navbar { padding: 15px 0; }
                    .nav-container { font-size: 0.7rem; }
                    .nav-logo { font-size: 0.85rem !important; letter-spacing: 1px; }
                    .nav-back { font-size: 0.65rem; }

                    .detail-hero { padding-top: 100px; padding-bottom: 40px; }
                    .detail-title { font-size: clamp(2.2rem, 10vw, 3.5rem); margin-bottom: 18px; line-height: 0.95; }
                    .detail-year { font-size: clamp(1rem, 4vw, 1.8rem); }
                    .detail-desc { font-size: 0.9rem; margin-bottom: 30px; }
                    .detail-badge { font-size: 0.6rem; padding: 5px 12px; }

                    .detail-meta {
                        grid-template-columns: 1fr;
                        background: var(--hover-bg);
                        border-radius: 12px;
                    }
                    .meta-item {
                        padding: 16px 20px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        border-right: none;
                        border-bottom: 1px solid var(--border-medium);
                    }
                    .meta-item:last-child { border-bottom: none; }
                    .meta-label { font-size: 0.65rem; margin-bottom: 0; }
                    .meta-value { font-size: 0.9rem; text-align: right; }

                    .detail-btn { width: 100%; justify-content: center; padding: 14px 24px; font-size: 0.75rem; }

                    .detail-images { gap: 8px; }
                    .detail-img { padding-bottom: 0; }

                    .detail-section { padding-top: 50px; padding-bottom: 50px; }
                    .section-header { margin-bottom: 25px; gap: 12px; }
                    .section-label { font-size: 0.7rem; letter-spacing: 1px; }

                    .feature-item { gap: 16px; padding: 18px 0; }
                    .feature-item:hover { padding-left: 0; background: transparent; }
                    .feature-num { font-size: 0.7rem; }
                    .feature-text { font-size: 0.9rem; }

                    .tool-chip { padding: 10px 18px; font-size: 0.75rem; }

                    .back-link { font-size: 0.75rem; width: 100%; justify-content: center; }
                }
            `}</style>
        </main>
    );
}
