'use client';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(followerRef.current, { xPercent: -50, yPercent: -50 });

    const moveCursor = (e) => {
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.1 });
      gsap.to(followerRef.current, { x: e.clientX, y: e.clientY, duration: 0.6, ease: "power3.out" });
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor-dot" />
      <div ref={followerRef} className="cursor-follower" />
      <style jsx>{`
        .cursor-dot {
          width: 8px; height: 8px; background: #fff; border-radius: 50%;
          position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
          mix-blend-mode: difference;
        }
        .cursor-follower {
          width: 40px; height: 40px; border: 1px solid rgba(255,255,255,0.5); border-radius: 50%;
          position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9998;
          mix-blend-mode: difference;
        }
      `}</style>
    </>
  );
}