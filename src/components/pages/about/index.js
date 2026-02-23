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

export default function AboutPage() {
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

        const tl = gsap.timeline({ delay: 0.3 });
        tl.from(".hero-anim", {
            y: 80, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power4.out"
        })
            .from(".nav-item", {
                y: -20, opacity: 0, duration: 0.8, ease: "power3.out"
            }, "-=0.6");

        gsap.to(".cyber-progress", { scaleX: 1, ease: "none", scrollTrigger: { scrub: 0.3 } });

        // Scroll-triggered section reveals
        gsap.utils.toArray(".section-reveal").forEach((el) => {
            gsap.from(el, {
                y: 60, opacity: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: el, start: "top 85%" }
            });
        });

        // Skill rows slide in from left staggered
        gsap.utils.toArray(".skill-row").forEach((el, i) => {
            gsap.from(el, {
                x: -40, opacity: 0, duration: 0.8, ease: "power2.out", delay: i * 0.05,
                scrollTrigger: { trigger: el, start: "top 90%" }
            });
        });
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
                    <Link href="/" className="nav-logo">nazca<span className="text-primary">.dev</span></Link>
                    <div className="nav-right">
                        <div className="nav-item nav-info">about</div>
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

                {/* --- HERO --- */}
                <section className="hero container">
                    <div className="hero-content">
                        <div className="hero-top hero-anim">
                            <span className="status-dot"></span> bandung city, indonesia
                        </div>

                        <h1 className="hero-title hero-anim">
                            transforming<br />
                            ideas into<br />
                            <span className="text-outline">web solution.</span>
                        </h1>

                        <div className="hero-desc hero-anim">
                            <p>
                                a vocational student majoring in <span className="text-highlight">software engineering</span>.
                                i don&apos;t just write code; i orchestrate systems that are not just functional, but intuitively powerful.
                            </p>
                        </div>
                    </div>
                </section>

                {/* --- BACKGROUND --- */}
                <section className="section container" id="background">
                    <div className="section-header">
                        <div className="section-label section-reveal">my background</div>
                        <div className="section-line"></div>
                    </div>
                    <div className="section-body section-reveal">
                        <p>
                            i graduated with a degree in software engineering from a vocational high school (smk),
                            where my passion for programming began in my freshman year. since then, i&apos;ve enjoyed
                            learning programming languages, building small projects, and honing my skills through
                            hands-on practice.
                        </p>
                        <p>
                            i gained real-world experience as a <span className="text-highlight">freelance web developer</span> and
                            also completed a six-month internship at a company where i learned to combine professional
                            experience, creativity, and strong technical skills, giving me a well-rounded software
                            development background.
                        </p>
                    </div>
                </section>

                {/* --- EXPERTISE --- */}
                <section className="section container" id="expertise">
                    <div className="section-header">
                        <div className="section-label section-reveal">my expertise</div>
                        <div className="section-line"></div>
                    </div>
                    <div className="expertise-list">
                        {[
                            { title: "programming languages", desc: "javascript, php" },
                            { title: "frameworks & libraries", desc: "next.js, react, laravel, express.js, vue.js" },
                            { title: "tools & platforms", desc: "git, docker, postman, vs code, figma" },
                            { title: "databases", desc: "mysql, postgresql, supabase, firebase" },
                            { title: "design tools", desc: "figma" }
                        ].map((item, i) => (
                            <div key={i} className="skill-row">
                                <span className="skill-id">({String(i + 1).padStart(2, '0')})</span>
                                <div className="skill-info">
                                    <h3 className="skill-name">{item.title}</h3>
                                    <p className="skill-stack">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <Footer />
            </div>

            <style jsx global>{`
                .main-wrapper { position: relative; background: var(--bg); color: var(--fg); min-height: 100vh; overflow-x: hidden; }
                .content-wrapper { position: relative; z-index: 10; }
                .mask { overflow: hidden; }
                .block { display: block; }
                .text-highlight { color: var(--fg); font-weight: bold; border-bottom: 1px solid var(--primary); }
                .hidden-mobile { display: block; }

                /* --- NAV --- */
                .navbar {
                    position: fixed; top: 0; left: 0; width: 100%;
                    z-index: 40; padding: 18px 0;
                    background: var(--navbar-bg);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--navbar-border);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease;
                }
                .navbar.nav-hidden {
                    transform: translateY(-100%);
                }
                .nav-container { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.7rem; text-transform: none; }
                .nav-logo {
                    font-weight: bold;
                    font-size: 0.85rem;
                    letter-spacing: 2px;
                    text-decoration: none !important;
                    color: var(--fg) !important;
                    font-family: var(--font-mono);
                }
                .text-primary { color: var(--primary) !important; }
                .nav-right { display: flex; align-items: center; gap: 25px; }
                .nav-info { opacity: 0.5; }
                .hamburger { display: flex; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 5px; }
                .bar { width: 22px; height: 1.5px; background: var(--fg); transition: all 0.3s; }
                .hamburger:hover .bar { background: var(--primary); }
                .hamburger:hover .bar:nth-child(2) { width: 20px; }

                /* Progress Bar */
                .cyber-progress { position: fixed; top: 0; left: 0; height: 2px; width: 100%; background: var(--primary); z-index: 100; transform-origin: left; transform: scaleX(0); box-shadow: 0 0 8px var(--primary); }

                /* --- HERO --- */
                .hero { min-height: 100vh; display: flex; align-items: center; padding-top: 80px; padding-bottom: 40px; }
                .hero-content { width: 100%; }
                .hero-top { font-family: var(--font-mono); font-size: 0.75rem; opacity: 0.7; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
                .status-dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 5px var(--primary); animation: pulse 2s infinite; }
                .hero-title { font-size: clamp(2.8rem, 7vw, 6.5rem); font-weight: 700; line-height: 0.85; letter-spacing: -0.04em; text-transform: none; margin-bottom: 30px; }
                .hero-desc { max-width: 480px; font-size: 0.95rem; opacity: 0.7; line-height: 1.7; font-family: var(--font-mono); }

                /* --- SECTIONS --- */
                .section { padding-top: 60px; padding-bottom: 60px; border-top: 1px solid var(--border-medium); }
                .section-header { display: flex; align-items: center; gap: 22px; margin-bottom: 35px; }
                .section-label { font-family: var(--font-mono); font-size: 0.75rem; letter-spacing: 2px; opacity: 0.5; white-space: nowrap; }
                .section-line { flex: 1; height: 1px; background: var(--border-medium); }
                .section-body { font-size: 0.9rem; line-height: 1.8; opacity: 0.8; max-width: 600px; }
                .section-body p { margin-bottom: 18px; }

                /* --- EXPERTISE --- */
                .expertise-list { border-top: 1px solid var(--border-medium); }
                .skill-row { display: flex; align-items: center; padding: 25px 0; border-bottom: 1px solid var(--border-medium); gap: 22px; transition: all 0.3s; cursor: default; }
                .skill-row:hover { background: var(--bg-alt); padding-left: 20px; padding-right: 20px; }
                .skill-id { font-family: var(--font-mono); opacity: 0.4; font-size: 0.75rem; flex-shrink: 0; }
                .skill-name { font-size: clamp(1rem, 2.5vw, 1.5rem); font-weight: 600; text-transform: none; margin: 0 0 5px 0; line-height: 1; letter-spacing: -0.02em; }
                .skill-stack { font-family: var(--font-mono); font-size: 0.7rem; opacity: 0.5; margin: 0; }

                @keyframes pulse {
                    0% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 0, 60, 0.7); }
                    70% { opacity: 1; box-shadow: 0 0 0 10px rgba(255, 0, 60, 0); }
                    100% { opacity: 1; box-shadow: 0 0 0 0 rgba(255, 0, 60, 0); }
                }

                @media (max-width: 768px) {
                    .hidden-mobile { display: none; }

                    /* Nav */
                    .navbar { padding: 15px 0; }
                    .nav-container { font-size: 0.7rem; }
                    .nav-logo { font-size: 0.85rem !important; letter-spacing: 1px; }
                    .nav-info { display: none; }

                    /* Hero */
                    .hero { min-height: auto; padding-top: 100px; padding-bottom: 40px; }
                    .hero-title { font-size: clamp(2.2rem, 9vw, 3.5rem); line-height: 0.9; margin-bottom: 25px; }
                    .hero-top { font-size: 0.7rem; margin-bottom: 12px; }
                    .hero-desc { font-size: 0.85rem; line-height: 1.6; }

                    /* Sections */
                    .section { padding-top: 50px; padding-bottom: 50px; }
                    .section-header { margin-bottom: 25px; gap: 12px; }
                    .section-label { font-size: 0.7rem; letter-spacing: 1px; }
                    .section-body { font-size: 0.9rem; line-height: 1.7; }
                    .section-body p { margin-bottom: 18px; }

                    /* Expertise */
                    .skill-row { flex-direction: column; align-items: flex-start; gap: 6px; padding: 20px 0; }
                    .skill-row:hover { padding-left: 0; padding-right: 0; background: transparent; }
                    .skill-name { font-size: 1.15rem; }
                    .skill-stack { font-size: 0.75rem; }
                    .skill-id { font-size: 0.75rem; }
                }
            `}</style>
        </main>
    );
}