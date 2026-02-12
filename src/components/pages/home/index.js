'use client';
import { useState, useRef, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

import Cursor from '@/components/ui/Cursor';
import Particles from '@/components/ui/Particles';
import CRTOverlay from '@/components/ui/CRTOverlay';

import CyberButton from '@/components/ui/CyberButton';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

const FEATURED_PROJECTS = [
    { id: "01", name: "FlashPark", cat: "web application", stack: "Next.js / PostgreSQL", color: "#ff003c", image: "/images/works/web/flashpark/page1.png" },
    { id: "02", name: "Porsche Landing Page", cat: "web design", stack: "Figma", color: "#ff003c", image: "/images/works/design/work1/page1.png" },
    { id: "03", name: "Aquanime", cat: "web development", stack: "Next.js / Tailwind CSS", color: "#00b4d8", image: "/images/works/web/aquanime/page1.png" },
];

export default function HomePage() {
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const lastScrollY = useRef(0);

    const marqueeTween = useRef(null);
    const projectsRef = useRef(null);

    useEffect(() => {
        const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        return () => lenis.destroy();
    }, []);

    // Hide navbar on scroll down, show on scroll up
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

        const heroTl = gsap.timeline({ delay: 0.5 });
        heroTl.from(".hero-anim", {
            y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: "power4.out"
        })
            .from(".nav-item", {
                y: -20, opacity: 0, duration: 0.8, stagger: 0.05, ease: "power3.out"
            }, "-=0.5");

        gsap.to(".cyber-progress", { scaleX: 1, ease: "none", scrollTrigger: { scrub: 0.3 } });

        // Marquee reveal
        gsap.from(".marquee-label", {
            y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: ".marquee-section", start: "top 85%" }
        });
        gsap.from(".marquee-wrapper", {
            y: 40, opacity: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: ".marquee-section", start: "top 80%" }
        });
        marqueeTween.current = gsap.to(".marquee-track", { xPercent: -50, repeat: -1, duration: 30, ease: "linear" });
        ScrollTrigger.create({
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity());
                const speed = Math.min(3, 1 + velocity / 2000);
                gsap.to(marqueeTween.current, { timeScale: speed, duration: 0.8, overwrite: true });
            }
        });

        // Services section scroll animations
        gsap.from(".services-title", {
            y: 60, opacity: 0, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: ".services-section", start: "top 80%" }
        });
        gsap.utils.toArray(".service-card").forEach((el, i) => {
            gsap.from(el, {
                y: 50, opacity: 0, duration: 0.8, ease: "power3.out", delay: i * 0.15,
                scrollTrigger: { trigger: el, start: "top 85%" }
            });
        });

        // Projects header reveal
        gsap.from(".projects-header", {
            y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: ".projects", start: "top 80%" }
        });

        // Project items animate in
        gsap.utils.toArray(".project-item").forEach((el, i) => {
            gsap.from(el, {
                y: 40, opacity: 0, duration: 0.7, ease: "power3.out", delay: i * 0.08,
                scrollTrigger: { trigger: el, start: "top 88%" }
            });
        });

    }, [loading]);

    return (
        <main className="main-wrapper">
            <CRTOverlay onComplete={() => setLoading(false)} />
            <div className="cyber-progress" />
            <div className="noise-overlay" />
            <Particles />
            <div className="hidden-mobile"><Cursor /></div>

            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* --- STICKY NAVIGATION --- */}
            <nav className={`navbar ${navHidden ? 'nav-hidden' : ''}`}>
                <div className="container nav-container">
                    <Link href="/" className="nav-logo nav-item">nazca<span className="text-primary">.dev</span></Link>
                    <div className="nav-right">
                        <button className="hamburger nav-item" onClick={() => setSidebarOpen(true)} aria-label="Menu">
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="content-wrapper">

                {/* --- HERO SECTION --- */}
                <section className="hero container">
                    <div className="hero-content">
                        <div className="hero-top hero-anim">
                            <span className="status-dot"></span> bandung city, indonesia
                        </div>

                        <h1 className="hero-title">
                            <div className="mask">
                                <span className="hero-anim block glitch-text" data-text="web developer">web developer</span>
                            </div>
                            <div className="mask">
                                <span className="hero-anim block hero-sub">enthusiast</span>
                            </div>
                        </h1>

                        <div className="hero-desc hero-anim">
                            <p>
                                hi i'm nazca — a vocational student majoring in <span className="text-highlight">software engineering</span>.
                                i don't just write code; i orchestrate systems that are not just functional, but intuitively powerful.
                            </p>
                        </div>

                        <div className="hero-cta hero-anim">
                            <Link href="/work">
                                <CyberButton>view my work</CyberButton>
                            </Link>
                            <Link href="/about" className="link-about">
                                more about me <span className="link-arrow-cta">→</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* --- MARQUEE --- */}
                <div className="marquee-section">
                    <div className="marquee-label container hero-anim">i work with</div>
                    <div className="marquee-wrapper">
                        <div className="marquee-track">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="marquee-item">
                                    <span className="sep">///</span>
                                    <span>javascript</span>
                                    <span className="text-outline">next.js</span>
                                    <span>react</span>
                                    <span className="text-outline">laravel</span>
                                    <span>figma</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* --- SERVICES SECTION --- */}
                <section className="services-section container">
                    <h2 className="services-title">what can i help you<span className="text-outline">.</span></h2>
                    <div className="services-grid">
                        {[
                            { num: "1", title: "web development", desc: "i build fast, responsive, and accessible websites that turn ideas into seamless digital experiences. using modern tools and clean code, i focus on performance, usability, and scalability across all devices." },
                            { num: "2", title: "web design", desc: "i design intuitive, user-first interfaces that blend clarity with creativity. from landing pages to full product designs, i create experiences that not only look good, but feel right." },
                        ].map((service, i) => (
                            <div key={i} className="service-card">
                                <div className="service-top">
                                    <span className="service-num">{service.num}</span>
                                    <div className="service-line"></div>
                                </div>
                                <h3 className="service-name">{service.title}</h3>
                                <p className="service-desc">{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- FEATURED WORKS --- */}
                <section className="projects container" id="work" ref={projectsRef}>
                    <div className="projects-header">
                        <div className="section-title">
                            featured works <span className="highlight">({String(FEATURED_PROJECTS.length).padStart(2, '0')})</span>
                        </div>
                        <Link href="/work">
                            <CyberButton>discover my works</CyberButton>
                        </Link>
                    </div>

                    <div className="project-list">
                        {FEATURED_PROJECTS.map((project) => (
                            <Link key={project.id} href="/work"
                                className="project-item"
                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="proj-left">
                                    <span className="proj-id">({project.id})</span>
                                    <h2 className="proj-name">{project.name}</h2>
                                </div>
                                <div className="proj-right">
                                    <span className="proj-cat">{project.cat}</span>
                                    <span className="proj-stack">{project.stack}</span>
                                </div>
                            </Link>
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
        .text-primary { color: var(--primary); }
        .text-highlight { color: var(--fg); font-weight: bold; border-bottom: 1px solid var(--primary); }
        .hidden-mobile { display: block; }

        /* --- STICKY NAV --- */
        .navbar {
            position: fixed; top: 0; left: 0; width: 100%;
            z-index: 40; padding: 25px 0;
            background: rgba(5,5,5,0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(255,255,255,0.05);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .navbar.nav-hidden {
            transform: translateY(-100%);
        }
        .nav-container { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.8rem; text-transform: none; }
        .nav-logo {
            font-weight: bold; font-size: 1rem; letter-spacing: 2px;
            text-decoration: none !important; color: var(--fg) !important;
            font-family: var(--font-mono);
        }
        .nav-right { display: flex; align-items: center; gap: 30px; }

        .hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 5px; }
        .bar { width: 28px; height: 2px; background: var(--fg); transition: all 0.3s; }
        .hamburger:hover .bar { background: var(--primary); }
        .hamburger:hover .bar:nth-child(2) { width: 20px; }

        /* Progress Bar */
        .cyber-progress { position: fixed; top: 0; left: 0; height: 3px; width: 100%; background: var(--primary); z-index: 100; transform-origin: left; transform: scaleX(0); box-shadow: 0 0 10px var(--primary); }

        /* --- HERO --- */
        .hero { min-height: 100vh; display: flex; align-items: center; padding-top: 100px; padding-bottom: 50px; }
        .hero-content { width: 100%; }
        .hero-top { font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .status-dot { width: 8px; height: 8px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 5px var(--primary); animation: pulse 2s infinite; }

        .hero-title { font-size: clamp(3.5rem, 9vw, 9rem); font-weight: 700; line-height: 0.85; letter-spacing: -0.04em; text-transform: none; margin-bottom: 40px; }
        .hero-sub {
            font-size: clamp(3.5rem, 9vw, 9rem);
            font-weight: 700;
            letter-spacing: -0.03em;
            -webkit-text-fill-color: transparent;
            -webkit-text-stroke: 2px var(--fg);
        }

        .hero-desc { max-width: 600px; font-size: 1.2rem; opacity: 0.7; line-height: 1.6; font-family: var(--font-mono); margin-bottom: 50px; }

        .hero-cta { display: flex; align-items: center; gap: 40px; }
        .link-about {
            font-family: var(--font-mono) !important;
            text-transform: none;
            font-size: 0.85rem;
            color: var(--fg) !important;
            text-decoration: none !important;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s;
            border-bottom: 1px solid var(--border-medium);
            padding-bottom: 5px;
            letter-spacing: 1px;
        }
        .link-about .link-arrow-cta { transition: transform 0.3s; }
        .link-about:hover { color: var(--primary) !important; border-color: var(--primary); }
        .link-about:hover .link-arrow-cta { transform: translateX(5px); }

        /* --- MARQUEE --- */
        .marquee-section { border-top: 1px solid var(--border-medium); border-bottom: 1px solid var(--border-medium); background: var(--bg); }
        .marquee-label { font-family: var(--font-mono); font-size: 0.85rem; text-transform: none; letter-spacing: 2px; opacity: 0.4; padding-top: 30px; padding-bottom: 15px; }
        .marquee-wrapper { padding-bottom: 50px; overflow: hidden; white-space: nowrap; }
        .marquee-track { display: flex; gap: 60px; width: max-content; }
        .marquee-item { display: flex; align-items: center; gap: 60px; font-size: 3rem; font-weight: bold; font-family: var(--font-main); text-transform: none; opacity: 0.8; letter-spacing: -1px; }
        .sep { color: var(--primary); }

        /* --- SERVICES --- */
        .services-section {
            padding-top: 100px;
            padding-bottom: 100px;
            border-bottom: 1px solid var(--border-medium);
        }
        .services-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            text-transform: capitalize;
            margin-bottom: 50px;
            line-height: 1;
            letter-spacing: -0.03em;
        }
        .services-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
        }
        .service-card { padding: 0; }
        .service-top {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 25px;
        }
        .service-num {
            width: 32px; height: 32px;
            background: var(--primary);
            color: #fff;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-weight: 800;
            font-size: 0.85rem;
            flex-shrink: 0;
        }
        .service-line {
            flex: 1;
            height: 1px;
            background: var(--border-medium);
        }
        .service-name {
            font-size: clamp(1.5rem, 2.5vw, 2rem);
            font-weight: 600;
            margin: 0 0 15px 0;
            line-height: 1.1;
        }
        .service-desc {
            font-size: 0.95rem;
            opacity: 0.6;
            line-height: 1.7;
            font-family: var(--font-mono);
            margin: 0;
        }

        /* --- FEATURED WORKS --- */
        .projects { padding-top: 100px; padding-bottom: 100px; position: relative; }
        .projects-header {
            display: flex; justify-content: space-between; align-items: center;
            margin-bottom: 60px; flex-wrap: wrap; gap: 25px;
        }
        .section-title { font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.6; letter-spacing: 1px; }
        .highlight { color: var(--primary); font-weight: bold; }

        /* Project List */
        .project-list { border-top: 1px solid var(--border-medium); min-height: 300px; }
        .project-item { display: flex; justify-content: space-between; align-items: center; padding: 50px 0; border-bottom: 1px solid var(--border-medium); transition: all 0.3s; cursor: pointer; }
        .project-item:hover { background: var(--bg-alt); padding-left: 30px; padding-right: 30px; }

        .proj-left { display: flex; align-items: baseline; gap: 30px; }
        .proj-id { font-family: var(--font-mono); opacity: 0.5; font-size: 0.9rem; }
        .proj-name { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 600; text-transform: none; margin: 0; line-height: 1; letter-spacing: -0.02em; }

        .proj-right { text-align: right; font-family: var(--font-mono); font-size: 0.9rem; opacity: 0.7; }
        .proj-cat { display: block; color: var(--primary); margin-bottom: 6px; }
        .proj-stack { font-size: 0.85rem; opacity: 0.5; }

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
            .nav-links { display: none; }

            /* Hero */
            .hero { padding-top: 90px; padding-bottom: 30px; min-height: auto; }
            .hero-title { font-size: clamp(2.5rem, 11vw, 4rem); margin-bottom: 25px; }
            .hero-sub { font-size: clamp(2.5rem, 11vw, 4rem); -webkit-text-stroke: 1px var(--fg); }
            .hero-top { font-size: 0.7rem; }
            .hero-desc { font-size: 0.9rem; margin-bottom: 30px; }
            .hero-cta { flex-direction: column; align-items: flex-start; gap: 20px; }

            /* Marquee */
            .marquee-item { font-size: 1.5rem; gap: 25px; }
            .marquee-label { font-size: 0.7rem; padding-top: 20px; padding-bottom: 10px; }
            .marquee-wrapper { padding-bottom: 30px; }

            /* Services */
            .services-section { padding-top: 50px; padding-bottom: 50px; }
            .services-title { font-size: clamp(1.6rem, 6vw, 2.2rem); margin-bottom: 25px; }
            .services-grid { grid-template-columns: 1fr; gap: 30px; }
            .service-name { font-size: 1.2rem; }
            .service-desc { font-size: 0.8rem; line-height: 1.6; }
            .service-num { width: 28px; height: 28px; font-size: 0.75rem; }

            /* Projects */
            .projects { padding-top: 50px; padding-bottom: 50px; }
            .projects-header { margin-bottom: 30px; gap: 15px; flex-direction: column; align-items: flex-start; }
            .section-title { font-size: 0.8rem; }
            .project-item { flex-direction: column; align-items: flex-start; gap: 12px; padding: 25px 0; }
            .project-item:hover { padding-left: 0; padding-right: 0; background: transparent; }
            .proj-left { flex-direction: column; gap: 6px; }
            .proj-name { font-size: clamp(1.5rem, 7vw, 2rem); }
            .proj-id { font-size: 0.8rem; }
            .proj-right { text-align: left; }
            .proj-cat { font-size: 0.8rem; }
            .proj-stack { font-size: 0.75rem; }
        }
      `}</style>
        </main>
    );
}