'use client';

/**
 * BackgroundEffects — Ambient animated background for the portfolio.
 * 
 * Layers (bottom → top):
 * 1. Subtle dot-grid pattern
 * 2. Animated gradient orbs (slowly drifting blobs of color)
 * 3. Fine noise texture overlay for depth
 * 
 * All layers are fixed, sit behind content (z-index: -1), and use
 * pointer-events: none so they never interfere with interaction.
 */
export default function BackgroundEffects() {
    return (
        <>
            {/* Dot grid layer */}
            <div className="bg-grid" />

            {/* Animated gradient orbs */}
            <div className="bg-orbs">
                <div className="bg-orb orb-1" />
                <div className="bg-orb orb-2" />
                <div className="bg-orb orb-3" />
                <div className="bg-orb orb-4" />
            </div>

            {/* Noise texture overlay */}
            <div className="bg-noise" />

            {/* Vignette for depth */}
            <div className="bg-vignette" />

            <style jsx>{`
                /* ===== DOT GRID ===== */
                .bg-grid {
                    position: fixed;
                    inset: 0;
                    z-index: -3;
                    pointer-events: none;
                    background-image: radial-gradient(
                        circle,
                        var(--dot-color) 1px,
                        transparent 1px
                    );
                    background-size: 32px 32px;
                }

                /* ===== GRADIENT ORBS ===== */
                .bg-orbs {
                    position: fixed;
                    inset: 0;
                    z-index: -4;
                    pointer-events: none;
                    overflow: hidden;
                }

                .bg-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(120px);
                    will-change: transform;
                }

                /* Primary red/magenta orb — top-left area */
                .orb-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(
                        circle,
                        rgba(255, 0, 60, 0.07) 0%,
                        rgba(255, 0, 60, 0) 70%
                    );
                    top: -10%;
                    left: -5%;
                    animation: orbFloat1 25s ease-in-out infinite;
                }

                /* Cyan accent orb — bottom-right */
                .orb-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(
                        circle,
                        rgba(0, 240, 255, 0.04) 0%,
                        rgba(0, 240, 255, 0) 70%
                    );
                    bottom: -10%;
                    right: -5%;
                    animation: orbFloat2 30s ease-in-out infinite;
                }

                /* Deep violet orb — center-right */
                .orb-3 {
                    width: 450px;
                    height: 450px;
                    background: radial-gradient(
                        circle,
                        rgba(120, 0, 255, 0.05) 0%,
                        rgba(120, 0, 255, 0) 70%
                    );
                    top: 40%;
                    right: 10%;
                    animation: orbFloat3 20s ease-in-out infinite;
                }

                /* Warm accent orb — bottom-left */
                .orb-4 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(
                        circle,
                        rgba(255, 0, 60, 0.04) 0%,
                        rgba(255, 0, 60, 0) 70%
                    );
                    bottom: 20%;
                    left: 5%;
                    animation: orbFloat4 22s ease-in-out infinite;
                }

                /* Float animations — slow, organic movements */
                @keyframes orbFloat1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25%      { transform: translate(80px, 60px) scale(1.1); }
                    50%      { transform: translate(40px, 120px) scale(0.95); }
                    75%      { transform: translate(-30px, 50px) scale(1.05); }
                }

                @keyframes orbFloat2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25%      { transform: translate(-70px, -50px) scale(1.08); }
                    50%      { transform: translate(-30px, -100px) scale(0.92); }
                    75%      { transform: translate(40px, -60px) scale(1.03); }
                }

                @keyframes orbFloat3 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33%      { transform: translate(-60px, 40px) scale(1.1); }
                    66%      { transform: translate(50px, -30px) scale(0.9); }
                }

                @keyframes orbFloat4 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    30%      { transform: translate(50px, -40px) scale(1.05); }
                    60%      { transform: translate(-40px, -80px) scale(0.95); }
                }

                /* ===== NOISE TEXTURE ===== */
                .bg-noise {
                    position: fixed;
                    inset: 0;
                    z-index: -1;
                    pointer-events: none;
                    opacity: 0.025;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
                    background-repeat: repeat;
                    background-size: 256px 256px;
                }

                /* ===== VIGNETTE ===== */
                .bg-vignette {
                    position: fixed;
                    inset: 0;
                    z-index: -2;
                    pointer-events: none;
                    background: radial-gradient(
                        ellipse at center,
                        transparent 50%,
                        var(--vignette-color) 100%
                    );
                }
            `}</style>
        </>
    );
}
