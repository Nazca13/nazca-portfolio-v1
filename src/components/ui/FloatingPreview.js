'use client';
import { forwardRef } from 'react';

const FloatingPreview = forwardRef(({ innerRef }, ref) => {
  return (
    <>
      <div ref={ref} className="preview-box">
        <div ref={innerRef} className="preview-image" />
      </div>
      <style jsx>{`
        .preview-box {
            position: fixed; width: 320px; height: 220px; pointer-events: none; z-index: 50;
            transform: translate(-50%, -50%) scale(0); border-radius: 12px; overflow: hidden;
            background: #000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .preview-image {
            width: 100%; height: 100%;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            opacity: 1;
            transition: transform 0.4s ease;
        }
      `}</style>
    </>
  );
});

FloatingPreview.displayName = "FloatingPreview";
export default FloatingPreview;