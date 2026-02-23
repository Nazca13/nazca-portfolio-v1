'use client';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * CRTOverlay - Full-screen loading overlay with percentage counter + CRT TV animation
 * 
 * Sequence:
 * 1. Solid black screen (hides page content)
 * 2. Loading percentage counter (0% → 100%)
 * 3. CRT TV turn-on animation (horizontal line → expand → white flash)
 * 4. Overlay disappears, page content revealed
 * 
 * @param {Function} onComplete - Called when entire animation sequence finishes
 */
export default function CRTOverlay({ onComplete }) {
  const overlayRef = useRef(null);
  const crtRef = useRef(null);
  const percentRef = useRef(null);
  const [percent, setPercent] = useState(0);

  // Animate percentage counter
  useEffect(() => {
    const counter = { val: 0 };
    const tween = gsap.to(counter, {
      val: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate: () => setPercent(Math.round(counter.val)),
    });
    return () => tween.kill();
  }, []);

  // Main animation sequence
  useGSAP(() => {
    const tl = gsap.timeline({
      delay: 0.1,
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    // Phase 1: Show percentage (already running via useEffect)
    // Phase 2: Fade out percentage text
    tl.to(percentRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 2.0, // Wait for counter to finish
    })
      // Phase 3: CRT horizontal line appears
      .set(crtRef.current, { scaleY: 0.003, scaleX: 0, opacity: 1 })
      .to(crtRef.current, {
        scaleX: 1,
        duration: 0.4,
        ease: "power3.inOut",
      })
      // Phase 4: CRT expands vertically (TV turning on)
      .to(crtRef.current, {
        scaleY: 1,
        duration: 0.5,
        ease: "expo.out",
      })
      // Phase 5: White flash fades, revealing content
      .to(crtRef.current, {
        opacity: 0,
        duration: 0.6,
        delay: 0.1,
        ease: "power2.inOut",
      })
      // Phase 6: Remove black overlay
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          if (overlayRef.current) {
            overlayRef.current.style.display = 'none';
            overlayRef.current.style.pointerEvents = 'none';
          }
          if (crtRef.current) {
            crtRef.current.style.display = 'none';
            crtRef.current.style.pointerEvents = 'none';
          }
        },
      }, "-=0.4");
  });

  return (
    <>
      {/* Black overlay that hides ALL page content */}
      <div ref={overlayRef} className="crt-overlay">
        {/* Loading percentage */}
        <div ref={percentRef} className="crt-percent">
          <span className="crt-percent-num">{percent}</span>
          <span className="crt-percent-sign">%</span>
        </div>
      </div>

      {/* White CRT flash layer */}
      <div ref={crtRef} className="crt-layer" />

      <style jsx>{`
        .crt-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: var(--crt-bg);
          z-index: 99998;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .crt-percent {
          font-family: var(--font-mono);
          color: var(--fg, #ececec);
          display: flex;
          align-items: baseline;
          gap: 4px;
          user-select: none;
        }
        .crt-percent-num {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          font-variant-numeric: tabular-nums;
        }
        .crt-percent-sign {
          font-size: clamp(1.2rem, 3vw, 2rem);
          font-weight: 400;
          opacity: 0.5;
        }
        .crt-layer {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: #fff;
          z-index: 99999;
          transform-origin: center;
          opacity: 0;
          will-change: transform, opacity;
        }
      `}</style>
    </>
  );
}