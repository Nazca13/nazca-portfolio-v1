'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';

import { ALL_PROJECTS } from '@/data/projects';

import Particles from '@/components/ui/Particles';
import CRTOverlay from '@/components/ui/CRTOverlay';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function WorkPage() {
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [navHidden, setNavHidden] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedProject, setSelectedProject] = useState(null);
    const lastScrollY = useRef(0);
    const modalRef = useRef(null);
    const modalCardRef = useRef(null);

    const filteredProjects = useMemo(() => {
        return ALL_PROJECTS.filter(project => {
            // 1. Filter by Type
            const typeMatch = activeTab === 'all'
                ? true
                : project.type === activeTab;

            // 2. Filter by Category (only if type match & activeTab is not all)
            if (!typeMatch) return false;
            if (activeTab !== 'all' && activeCategory !== 'all') {
                return project.cat === activeCategory;
            }
            return true;
        });
    }, [activeTab, activeCategory]);

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
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* --- STICKY NAVIGATION --- */}
            <nav className={`navbar ${navHidden ? 'nav-hidden' : ''}`}>
                <div className="container nav-container">
                    <Link href="/" className="nav-logo nav-item">nazca<span className="text-primary">.dev</span></Link>
                    <div className="nav-right">
                        <div className="nav-page-label nav-item">works</div>
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

                {/* --- FILTER TABS (Main) --- */}
                <div className="filter-section container">
                    <div className="tabs work-anim">
                        {['all', 'personal', 'work'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setActiveCategory('all'); }}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- SECONDARY CATEGORY FILTER (For Personal & Work) --- */}
                {activeTab !== 'all' && (
                    <div className="category-filter container">
                        <div className="filter-pills work-anim">
                            {['all', 'website', 'application', 'design', 'other'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

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
                    z-index: 40; padding: 18px 0;
                    background: var(--navbar-bg);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--navbar-border);
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.4s ease;
                }
                .navbar.nav-hidden { transform: translateY(-100%); }
                .nav-container { display: flex; justify-content: space-between; align-items: center; font-family: var(--font-mono); font-size: 0.7rem; text-transform: none; }
                .nav-logo { font-weight: bold; font-size: 0.85rem; letter-spacing: 2px; text-decoration: none !important; color: var(--fg) !important; font-family: var(--font-mono); }
                .nav-right { display: flex; align-items: center; gap: 25px; }
                .nav-page-label { opacity: 0.4; letter-spacing: 2px; font-size: 0.65rem; }

                .hamburger { display: flex; flex-direction: column; gap: 4px; background: none; border: none; cursor: pointer; padding: 5px; }
                .bar { width: 22px; height: 1.5px; background: var(--fg); transition: all 0.3s; }
                .hamburger:hover .bar { background: var(--primary); }
                .hamburger:hover .bar:nth-child(2) { width: 20px; }

                /* Progress Bar */
                .cyber-progress { position: fixed; top: 0; left: 0; height: 2px; width: 100%; background: var(--primary); z-index: 100; transform-origin: left; transform: scaleX(0); box-shadow: 0 0 8px var(--primary); }

                /* --- HERO --- */
                .work-hero { padding-top: 120px; padding-bottom: 45px; text-align: center; }
                .work-title { font-size: clamp(2.2rem, 5.5vw, 4.5rem); font-weight: 700; line-height: 1; letter-spacing: -0.04em; margin-bottom: 18px; }
                .work-desc { font-family: var(--font-mono); font-size: 0.8rem; opacity: 0.5; max-width: 450px; margin: 0 auto; line-height: 1.6; }

                /* --- FILTER TABS --- */
                .filter-section { padding-bottom: 0; margin-bottom: 15px; }
                .tabs { display: flex; gap: 0; width: 100%; border-bottom: 1px solid var(--border-medium); }
                .tab-btn {
                    flex: 1; padding: 12px 16px;
                    border: 1px solid transparent;
                    border-bottom: none;
                    background: transparent;
                    color: var(--fg-muted);
                    font-family: var(--font-main);
                    font-size: 0.8rem; font-weight: 500;
                    cursor: pointer; transition: all 0.3s;
                    text-align: center;
                    position: relative;
                }
                .tab-btn:hover { color: var(--fg); }
                .tab-btn.active { color: var(--primary); font-weight: 700; }
                .tab-btn.active::after {
                    content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 2px; background: var(--primary);
                }

                /* --- SECONDARY FILTER (Category) --- */
                .category-filter { margin-top: 15px; margin-bottom: 30px; }
                .filter-pills { 
                    display: flex; 
                    flex-wrap: wrap;
                    gap: 10px; 
                    justify-content: center;
                }
                .filter-pill {
                    padding: 6px 16px;
                    border: 1px solid var(--border-medium);
                    border-radius: 50px;
                    background: transparent;
                    color: var(--fg-muted);
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-transform: lowercase;
                    white-space: nowrap;
                }
                .filter-pill:hover {
                    border-color: var(--primary);
                    color: var(--fg);
                }
                .filter-pill.active {
                    background: var(--primary);
                    color: #fff;
                    border-color: var(--primary);
                    font-weight: 600;
                    box-shadow: 0 0 12px rgba(255, 0, 60, 0.4);
                }

                /* --- PROJECTS LIST --- */
                .projects-section { padding-top: 30px; padding-bottom: 60px; }
                .project-list { border-top: 1px solid var(--border-medium); }
                .project-item {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 35px 0;
                    border-bottom: 1px solid var(--border-medium);
                    transition: all 0.3s; cursor: pointer;
                    position: relative;
                }
                .project-item:hover {
                    background: var(--bg-alt);
                    padding-left: 25px; padding-right: 25px;
                }
                .project-item:hover .proj-arrow {
                    opacity: 1; transform: translateX(0);
                }

                .proj-left { display: flex; align-items: baseline; gap: 28px; }
                .proj-id { font-family: var(--font-mono); opacity: 0.5; font-size: 0.8rem; }
                .proj-name { font-size: clamp(1.6rem, 3vw, 2.5rem); font-weight: 600; text-transform: none; margin: 0; line-height: 1; letter-spacing: -0.02em; }

                .proj-right { text-align: right; font-family: var(--font-mono); font-size: 0.8rem; opacity: 0.7; }
                .proj-cat { display: block; margin-bottom: 6px; }
                .proj-stack { font-size: 0.75rem; opacity: 0.5; }

                .proj-arrow {
                    opacity: 0; transform: translateX(-10px);
                    transition: all 0.4s ease; color: var(--primary);
                    flex-shrink: 0;
                }

                .empty-state { padding: 70px 0; text-align: center; font-family: var(--font-mono); opacity: 0.4; letter-spacing: 1px; font-size: 0.85rem; }

                /* ========== MODAL ========== */
                .modal-overlay {
                    position: fixed; inset: 0; z-index: 100;
                    background: var(--modal-overlay);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center;
                    padding: 20px;
                    cursor: pointer;
                }

                .modal-card {
                    position: relative;
                    background: var(--modal-bg);
                    border: 1px solid var(--modal-border);
                    border-radius: 16px;
                    max-width: 560px;
                    width: 100%;
                    overflow: hidden;
                    cursor: default;
                    box-shadow: var(--modal-shadow);
                }

                .modal-close {
                    position: absolute; top: 16px; right: 16px; z-index: 10;
                    width: 36px; height: 36px;
                    border-radius: 50%;
                    background: var(--overlay-bg);
                    backdrop-filter: blur(4px);
                    border: 1px solid var(--modal-border);
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
                    background: linear-gradient(180deg, transparent 40%, var(--modal-bg) 100%);
                }
                .modal-cat {
                    position: absolute; bottom: 20px; left: 24px;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-family: var(--font-mono);
                    font-size: 0.7rem;
                    font-weight: 600;
                    color: #fff;
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
                    border-top: 1px solid var(--modal-border);
                    border-bottom: 1px solid var(--modal-border);
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
                    .tab-btn { flex: none; width: 33.33%; font-size: 0.8rem; padding: 12px 5px; }
                    
                    /* Secondary Filter */
                    .category-filter { margin-top: 20px; margin-bottom: 30px; }
                    .filter-pills { gap: 8px; }
                    .filter-pill { padding: 6px 16px; font-size: 0.75rem; }

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
