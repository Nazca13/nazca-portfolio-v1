export default function CyberButton({ children, onClick, disabled = false, type = "button" }) {
  return (
    <>
      <button className="cyber-btn" onClick={onClick} disabled={disabled} type={type}>
        <span className="btn-content">{children}</span>
        <span className="btn-glitch" aria-hidden="true">{children}</span>
      </button>
      <style jsx>{`
        .cyber-btn {
          position: relative;
          background: var(--fg);
          color: var(--bg);
          padding: 11px 26px;
          font-family: var(--font-mono);
          font-weight: bold;
          font-size: 0.75rem;
          border: none;
          cursor: none;
          transition: all var(--transition-base);
          text-transform: none;
          letter-spacing: 1px;
          overflow: hidden;
          box-shadow: 0 0 0 #fff;
        }

        .btn-content {
          position: relative;
          z-index: 2;
        }

        .btn-glitch {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          color: var(--primary);
          transform: translate(2px, -2px);
          transition: opacity var(--transition-fast);
          z-index: 1;
        }

        .cyber-btn:hover {
          background: var(--primary);
          color: #fff;
          transform: translate(-3px, -3px);
          box-shadow: 3px 3px 0px #fff, 6px 6px 0px var(--cyan);
        }

        .cyber-btn:hover .btn-glitch {
          opacity: 0.3;
          animation: glitchShift 0.3s ease infinite;
        }

        .cyber-btn:active {
          transform: translate(0, 0);
          box-shadow: 0 0 0 #fff;
          transition: all 0.1s;
        }

        .cyber-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        @keyframes glitchShift {
          0%, 100% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
        }
      `}</style>
    </>
  );
}