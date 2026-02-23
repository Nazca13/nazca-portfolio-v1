'use client';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
        title={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      >
        <svg
          className={`theme-icon ${isLight ? 'icon-sun' : 'icon-moon'}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {isLight ? (
            /* Sun icon */
            <>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </>
          ) : (
            /* Moon icon */
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          )}
        </svg>
      </button>

      <style jsx>{`
        .theme-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: 1px solid var(--border-subtle);
          border-radius: 50%;
          width: 34px;
          height: 34px;
          cursor: pointer;
          color: var(--fg);
          transition: all 0.3s ease;
          padding: 0;
          flex-shrink: 0;
        }
        .theme-toggle:hover {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(255, 0, 60, 0.06);
        }
        .theme-icon {
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .theme-toggle:hover .theme-icon {
          transform: rotate(30deg);
        }
      `}</style>
    </>
  );
}
