'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const links = [
        { href: '/', label: 'home' },
        { href: '/about', label: 'about' },
        { href: '/work', label: 'works' },
    ];

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Close Button */}
                <button className="sidebar-close" onClick={onClose}>
                    <span className="close-line" />
                    <span className="close-line rotated" />
                </button>

                {/* Navigation */}
                <div className="sidebar-body">
                    <div className="sidebar-label">navigate</div>
                    <nav className="sidebar-nav">
                        {links.map((link, i) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <span className="link-num">{String(i + 1).padStart(2, '0')}</span>
                                <span className="link-text">{link.label}</span>
                                <span className="link-arrow">→</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Socials Footer */}
                <div className="sidebar-footer">
                    <div className="sidebar-footer-label">socials</div>
                    <div className="sidebar-footer-line" />
                    <div className="sidebar-socials">
                        <a href="https://instagram.com/nazca_nokaze" target="_blank" rel="noopener noreferrer" className="social-link">instagram</a>
                        <a href="https://www.linkedin.com/in/nazca-nokaze-a809873a2/" target="_blank" rel="noopener noreferrer" className="social-link">linkedin</a>
                        <a href="https://github.com/nazca13" target="_blank" rel="noopener noreferrer" className="social-link">github</a>
                    </div>
                    <div className="sidebar-copy">© 2026 nazca systems</div>
                </div>
            </aside>

            {/* Must use global so styles apply to Next.js <Link> children */}
            <style jsx global>{`
                .sidebar-overlay {
                    position: fixed; inset: 0;
                    background: var(--overlay-bg);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    z-index: 90;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.5s ease;
                }
                .sidebar-overlay.open { opacity: 1; pointer-events: all; }

                .sidebar {
                    position: fixed;
                    top: 0; right: 0;
                    width: 360px; height: 100vh;
                    background: var(--sidebar-bg);
                    border-left: 1px solid var(--sidebar-border);
                    z-index: 100;
                    display: flex; flex-direction: column;
                    justify-content: space-between;
                    padding: 30px 40px 40px;
                    transform: translateX(100%);
                    transition: transform 0.6s cubic-bezier(0.77, 0, 0.175, 1);
                    box-shadow: -20px 0 60px rgba(0,0,0,0.5);
                }
                .sidebar.open { transform: translateX(0); }

                /* Close Button */
                .sidebar-close {
                    position: relative;
                    width: 40px; height: 40px;
                    background: none;
                    border: 1px solid var(--sidebar-close-border);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    align-self: flex-end;
                    flex-shrink: 0;
                }
                .sidebar-close:hover {
                    border-color: var(--primary);
                    background: rgba(255,0,60,0.08);
                    transform: rotate(90deg);
                }
                .close-line {
                    position: absolute;
                    width: 14px; height: 1.5px;
                    background: var(--fg);
                    transform: rotate(45deg);
                    transition: background 0.3s;
                }
                .close-line.rotated { transform: rotate(-45deg); }
                .sidebar-close:hover .close-line { background: var(--primary); }

                /* Body */
                .sidebar-body {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 22px;
                }
                .sidebar-label {
                    font-family: var(--font-mono);
                    font-size: 0.6rem;
                    color: var(--sidebar-label);
                    letter-spacing: 3px;
                    font-weight: 500;
                }

                /* Nav Links */
                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .sidebar-link {
                    color: var(--fg) !important;
                    text-decoration: none !important;
                    font-size: 2rem;
                    font-weight: 700;
                    padding: 12px 16px;
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    letter-spacing: -0.02em;
                    line-height: 1;
                    border-radius: 8px;
                    position: relative;
                    overflow: hidden;
                    font-family: var(--font-main);
                }
                .sidebar-link .link-num {
                    font-family: var(--font-mono);
                    font-size: 0.65rem;
                    opacity: 0.3;
                    min-width: 20px;
                    transition: all 0.3s;
                }
                .sidebar-link .link-text { flex: 1; }
                .sidebar-link .link-arrow {
                    font-size: 1rem;
                    opacity: 0;
                    transform: translateX(-10px);
                    transition: all 0.3s;
                }

                .sidebar-link:hover {
                    background: var(--hover-bg);
                    padding-left: 30px;
                    color: var(--primary) !important;
                }
                .sidebar-link:hover .link-num { opacity: 1; color: var(--primary); }
                .sidebar-link:hover .link-arrow { opacity: 1; transform: translateX(0); }

                .sidebar-link.active {
                    background: var(--fg) !important;
                    color: var(--bg) !important;
                    padding-left: 30px;
                }
                .sidebar-link.active .link-num { opacity: 0.5; color: var(--bg); }
                .sidebar-link.active .link-arrow { opacity: 1; transform: translateX(0); color: var(--bg); }

                /* Footer */
                .sidebar-footer {
                    display: flex; flex-direction: column; gap: 15px;
                    flex-shrink: 0;
                }
                .sidebar-footer-label {
                    font-family: var(--font-mono);
                    font-size: 0.6rem;
                    color: var(--sidebar-label);
                    letter-spacing: 3px;
                    font-weight: 500;
                }
                .sidebar-footer-line {
                    height: 1px;
                    background: var(--sidebar-border);
                }
                .sidebar-socials {
                    display: flex;
                    gap: 20px;
                }
                .social-link {
                    font-family: var(--font-mono) !important;
                    font-size: 0.7rem !important;
                    color: var(--fg) !important;
                    text-decoration: none !important;
                    opacity: 0.5;
                    transition: all 0.3s;
                    letter-spacing: 0.5px;
                }
                .social-link:hover { opacity: 1; color: var(--primary) !important; }
                .sidebar-copy {
                    font-family: var(--font-mono);
                    font-size: 0.6rem;
                    opacity: 0.2;
                    color: var(--fg);
                    letter-spacing: 1px;
                    margin-top: 4px;
                }

                @media (max-width: 768px) {
                    .sidebar { width: 100%; padding: 30px 25px 40px; }
                    .sidebar-link { font-size: 2rem; }
                }
            `}</style>
        </>
    );
}
