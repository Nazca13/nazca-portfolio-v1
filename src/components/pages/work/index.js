'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

import { ALL_PROJECTS } from '@/data/projects';

import Cursor from '@/components/ui/Cursor';
import Particles from '@/components/ui/Particles';
import CRTOverlay from '@/components/ui/CRTOverlay';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function WorkPage() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const lastScrollY = useRef(0);
    const modalRef = useRef(null);
    const modalCardRef = useRef(null);

    const filteredProjects = activeTab === 'all'
        ? ALL_PROJECTS
        : ALL_PROJECTS.filter(p => p.type === activeTab);

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

        gsap.to(".cyber-progress", { scaleX: 1, ease: "none", scrollTrigger: { scrub: 0.3 } });

        gsap.from(".work-anim", {
            y: 60, opacity: 0, duration: 1, stagger: 0.08, ease: "power4.out", delay: 0.3
        });
        gsap.from(".nav-item", {
            y: -20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.4
        });
    }, [loading]);

    useGSAP(() => {
        if (loading) return;
        gsap.from(".project-item", {
            y: 30, opacity: 0, duration: 0.6, stagger: 0.06, ease: "power3.out"
        });
    }, [activeTab, loading]);

    // Open modal with GSAP
    const openModal = useCallback((project) => {
        setSelectedProject(project);
        document.body.style.overflow = 'hidden';

        requestAnimationFrame(() => {
            gsap.fromTo(modalRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.4, ease: "power2.out" }
            );
            gsap.fromTo(modalCardRef.current,
                { scale: 0.85, y: 60, opacity: 0 },
                { scale: 1, y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.4)", delay: 0.1 }
            );
        });
    }, []);

    // Close modal with GSAP
    const closeModal = useCallback(() => {
        gsap.to(modalCardRef.current, {
            scale: 0.9, y: 40, opacity: 0, duration: 0.35, ease: "power2.in"
        });
        gsap.to(modalRef.current, {
            opacity: 0, duration: 0.35, ease: "power2.in", delay: 0.1,
            onComplete: () => {
                setSelectedProject(null);
                document.body.style.overflow = '';
            }
        });
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && selectedProject) closeModal();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [selectedProject, closeModal]);

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
                        <div className="nav-page-label nav-item">works</div>
                        <button className="hamburger nav-item" onClick={() => setSidebarOpen(true)} aria-label="Menu">
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </button>
                    </div>
                </div>
            </nav>

            <div className="content-wrapper">
                {/* --- HERO HEADER --- */}
                <section className="work-hero container">
                    <h1 className="work-title work-anim">
                        a things i&apos;ve<br /><span className="text-outline">build</span>
                    </h1>
                    <p className="work-desc work-anim">
                        a selection of works spanning personal and freelance
                        work built with modern web technologies and a focus on usability.
                    </p>
                </section>

                {/* --- FILTER TABS --- */}
                <div className="filter-section container">
                    <div className="tabs work-anim">
                        {['all', 'personal', 'freelance'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- PROJECTS LIST --- */}
                <section className="projects-section container">
                    <div className="project-list">
                        {filteredProjects.map((project) => (
                            <div key={project.id}
                                className="project-item"
                                onClick={() => openModal(project)}>
                                <div className="proj-left">
                                    <span className="proj-id">({project.id})</span>
                                    <h2 className="proj-name">{project.name}</h2>
                                </div>
                                <div className="proj-right">
                                    <span className="proj-cat" style={{ color: project.color }}>{project.cat}</span>
                                    <span className="proj-stack">{project.stack}</span>
                                </div>
                                <div className="proj-arrow">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <div className="empty-state">no projects in this category yet.</div>
                    )}
                </section>

                <Footer />
            </div>

            {/* --- PROJECT MODAL --- */}
            {selectedProject && (
                <div className="modal-overlay" ref={modalRef} onClick={closeModal}>
                    <div className="modal-card" ref={modalCardRef} onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button className="modal-close" onClick={closeModal} aria-label="Close">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M18 6L6 18" /><path d="M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Image */}
                        <div className="modal-image" style={{ backgroundImage: `url(${selectedProject.image})` }}>
                            <div className="modal-image-overlay" />
                            <span className="modal-cat" style={{ background: selectedProject.color }}>{selectedProject.cat}</span>
                        </div>

                        {/* Content */}
                        <div className="modal-body">
                            <div className="modal-meta">
                                <span className="modal-id">project {selectedProject.id}</span>
                                <span className="modal-type">{selectedProject.type}</span>
                            </div>

                            <h2 className="modal-title">{selectedProject.name}</h2>
                            <p className="modal-desc">{selectedProject.desc}</p>

                            <div className="modal-stack-row">
                                <span className="modal-stack-label">tech stack</span>
                                <span className="modal-stack-value">{selectedProject.stack}</span>
                            </div>

                            <Link href={`/work/${selectedProject.slug}`} className="modal-btn" onClick={closeModal}>
                                <span>view project</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 17L17 7" /><path d="M7 7h10v10" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                .main-wrapper { position: relative; background: var(--bg); color: var(--fg); min-height: 100vh; overflow-x: hidden; }
                .content-wrapper { position: relative; z-index: 10; }
                .text-primary { color: var(--primary); }
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
                .navbar.nav-hidden { transform: translateY(-100%); }
                .nav-container { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.8rem; text-transform: none; }
                .nav-logo { font-weight: bold; font-size: 1rem; letter-spacing: 2px; text-decoration: none !important; color: var(--fg) !important; font-family: var(--font-mono); }
                .nav-right { display: flex; align-items: center; gap: 25px; }
                .nav-page-label { opacity: 0.4; letter-spacing: 2px; font-size: 0.75rem; }

                .hamburger { display: flex; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 5px; }
                .bar { width: 28px; height: 2px; background: var(--fg); transition: all 0.3s; }
                .hamburger:hover .bar { background: var(--primary); }
                .hamburger:hover .bar:nth-child(2) { width: 20px; }

                /* Progress Bar */
                .cyber-progress { position: fixed; top: 0; left: 0; height: 3px; width: 100%; background: var(--primary); z-index: 100; transform-origin: left; transform: scaleX(0); box-shadow: 0 0 10px var(--primary); }

                /* --- HERO --- */
                .work-hero { padding-top: 160px; padding-bottom: 60px; text-align: center; }
                .work-title { font-size: clamp(3rem, 7vw, 6rem); font-weight: 700; line-height: 1; letter-spacing: -0.04em; margin-bottom: 25px; }
                .work-desc { font-family: var(--font-mono); font-size: 1rem; opacity: 0.5; max-width: 550px; margin: 0 auto; line-height: 1.6; }

                /* --- FILTER --- */
                .filter-section { padding-bottom: 0; margin-bottom: 20px; }
                .tabs { display: flex; gap: 0; width: 100%; }
                .tab-btn {
                    flex: 1; padding: 16px 20px;
                    border: 1px solid var(--border-medium);
                    background: transparent;
                    color: var(--fg-muted);
                    font-family: var(--font-main);
                    font-size: 0.95rem; font-weight: 500;
                    cursor: pointer; transition: all 0.3s;
                    text-align: center;
                }
                .tab-btn:first-child { border-radius: 4px 0 0 4px; }
                .tab-btn:last-child { border-radius: 0 4px 4px 0; }
                .tab-btn + .tab-btn { border-left: none; }
                .tab-btn:hover { color: var(--fg); border-color: var(--fg); }
                .tab-btn.active { background: var(--fg); color: #000; border-color: var(--fg); font-weight: 700; }

                /* --- PROJECTS LIST --- */
                .projects-section { padding-top: 40px; padding-bottom: 80px; }
                .project-list { border-top: 1px solid var(--border-medium); }
                .project-item {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 55px 0;
                    border-bottom: 1px solid var(--border-medium);
                    transition: all 0.3s; cursor: pointer;
                    position: relative;
                }
                .project-item:hover {
                    background: var(--bg-alt);
                    padding-left: 30px; padding-right: 30px;
                }
                .project-item:hover .proj-arrow {
                    opacity: 1; transform: translateX(0);
                }

                .proj-left { display: flex; align-items: baseline; gap: 40px; }
                .proj-id { font-family: var(--font-mono); opacity: 0.5; font-size: 1rem; }
                .proj-name { font-size: clamp(2.2rem, 4vw, 3.5rem); font-weight: 600; text-transform: none; margin: 0; line-height: 1; letter-spacing: -0.02em; }

                .proj-right { text-align: right; font-family: var(--font-mono); font-size: 1rem; opacity: 0.7; }
                .proj-cat { display: block; margin-bottom: 8px; }
                .proj-stack { font-size: 0.9rem; opacity: 0.5; }

                .proj-arrow {
                    opacity: 0; transform: translateX(-10px);
                    transition: all 0.4s ease; color: var(--primary);
                    flex-shrink: 0;
                }

                .empty-state { padding: 100px 0; text-align: center; font-family: var(--font-mono); opacity: 0.4; letter-spacing: 1px; }

                /* ========== MODAL ========== */
                .modal-overlay {
                    position: fixed; inset: 0; z-index: 100;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                    cursor: pointer;
                }

                .modal-card {
                    position: relative;
                    background: #0c0c0c;
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 16px;
                    max-width: 560px;
                    width: 100%;
                    overflow: hidden;
                    cursor: default;
                    box-shadow: 0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04);
                }

                .modal-close {
                    position: absolute; top: 16px; right: 16px; z-index: 10;
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(4px);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: var(--fg);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .modal-close:hover {
                    background: var(--primary);
                    border-color: var(--primary);
                    transform: rotate(90deg);
                }

                /* Modal Image */
                .modal-image {
                    width: 100%; height: 260px;
                    background-size: cover; background-position: center;
                    position: relative;
                }
                .modal-image-overlay {
                    position: absolute; inset: 0;
                    background: linear-gradient(180deg, transparent 40%, #0c0c0c 100%);
                }
                .modal-cat {
                    position: absolute; bottom: 20px; left: 24px;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: #000;
                    text-transform: none;
                    letter-spacing: 1px;
                    z-index: 2;
                }

                /* Modal Body */
                .modal-body { padding: 30px 28px 32px; }

                .modal-meta {
                    display: flex; align-items: center; gap: 16px;
                    margin-bottom: 14px;
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    opacity: 0.4;
                    letter-spacing: 1.5px;
                    text-transform: none;
                }

                .modal-title {
                    font-size: clamp(1.8rem, 4vw, 2.5rem);
                    font-weight: 700;
                    text-transform: none;
                    letter-spacing: -0.03em;
                    margin: 0 0 14px 0;
                    line-height: 1;
                }

                .modal-desc {
                    font-size: 0.95rem;
                    line-height: 1.7;
                    opacity: 0.6;
                    margin: 0 0 28px 0;
                }

                .modal-stack-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 16px 0;
                    border-top: 1px solid rgba(255,255,255,0.08);
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    margin-bottom: 28px;
                    font-family: var(--font-mono);
                    font-size: 0.8rem;
                }
                .modal-stack-label { opacity: 0.4; letter-spacing: 1px; text-transform: none; }
                .modal-stack-value { color: var(--primary); font-weight: 600; }

                .modal-btn {
                    display: inline-flex; align-items: center; gap: 10px;
                    padding: 14px 32px;
                    background: var(--primary);
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
                    width: 100%;
                    justify-content: center;
                }
                .modal-btn:hover {
                    background: #e00035;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 30px rgba(255,0,60,0.3);
                }

                /* ========== RESPONSIVE ========== */
                @media (max-width: 768px) {
                    .hidden-mobile { display: none; }

                    /* Nav */
                    .navbar { padding: 15px 0; }
                    .nav-container { font-size: 0.7rem; }
                    .nav-logo { font-size: 0.85rem !important; letter-spacing: 1px; }
                    .nav-page-label { display: none; }

                    /* Hero */
                    .work-hero { padding-top: 100px; padding-bottom: 40px; text-align: left; }
                    .work-title { font-size: clamp(2rem, 9vw, 3rem); margin-bottom: 15px; }
                    .work-desc { font-size: 0.85rem; margin: 0; max-width: 100%; }

                    /* Tabs */
                    .tabs { flex-wrap: wrap; }
                    .tab-btn { flex: none; width: 50%; font-size: 0.8rem; padding: 12px 10px; }
                    .tab-btn:nth-child(1) { border-radius: 4px 0 0 0; }
                    .tab-btn:nth-child(2) { border-radius: 0 4px 0 0; border-left: none; }
                    .tab-btn:nth-child(3) { border-radius: 0 0 0 4px; border-top: none; }
                    .tab-btn:nth-child(4) { border-radius: 0 0 4px 0; border-left: none; border-top: none; }

                    /* Projects */
                    .projects-section { padding-top: 30px; padding-bottom: 60px; }
                    .project-item { flex-direction: column; align-items: flex-start; gap: 15px; padding: 30px 0; }
                    .project-item:hover { padding-left: 0; padding-right: 0; background: transparent; }
                    .proj-left { flex-direction: column; gap: 8px; }
                    .proj-name { font-size: clamp(1.5rem, 6vw, 2rem); }
                    .proj-id { font-size: 0.85rem; }
                    .proj-right { text-align: left; }
                    .proj-cat { font-size: 0.85rem; margin-bottom: 4px; }
                    .proj-stack { font-size: 0.8rem; }
                    .proj-arrow { position: absolute; top: 30px; right: 0; opacity: 0.5; transform: none; }

                    /* Modal */
                    .modal-overlay { padding: 16px; align-items: flex-end; }
                    .modal-card { max-width: 100%; border-radius: 16px 16px 0 0; max-height: 90vh; overflow-y: auto; }
                    .modal-image { height: 200px; }
                    .modal-body { padding: 24px 20px 28px; }
                    .modal-title { font-size: 1.6rem; }
                    .modal-desc { font-size: 0.85rem; }
                }
            `}</style>
        </main>
    );
}
