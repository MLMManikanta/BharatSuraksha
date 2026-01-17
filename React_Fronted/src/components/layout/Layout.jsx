import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

function Layout({ children }) {
  const { pathname } = useLocation();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // 1. Accessibility: Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 2. UX: Scroll to top on route change
  useEffect(() => {
    if (!prefersReducedMotion) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, prefersReducedMotion]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* Global Styles Injection */}
      <style>{`
        /* Smooth transitions for main content */
        @media (prefers-reduced-motion: no-preference) {
          main {
            animation: fadeIn 0.4s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }

        /* Global Smooth Scrolling */
        html {
          scroll-behavior: ${prefersReducedMotion ? 'auto' : 'smooth'};
        }

        /* Custom Scrollbar (Webkit - Chrome, Safari, Edge) */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #F1F5F9; /* slate-100 */
        }

        ::-webkit-scrollbar-thumb {
          background: #CBD5E1; /* slate-300 */
          border-radius: 5px;
          border: 2px solid #F1F5F9;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #1A5EDB; /* Brand Blue */
        }

        /* Custom Scrollbar (Firefox) */
        * {
          scrollbar-width: thin;
          scrollbar-color: #CBD5E1 #F1F5F9;
        }
      `}</style>

      <Header />
      
      {/* Main Content Wrapper
        - id="main-content" is the target for the "Skip to Content" link in Header
        - flex-1 ensures it pushes the footer down
      */}
      <main 
        id="main-content" 
        className="flex-1 flex flex-col relative w-full" 
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      
      <Footer />
    </div>
  );
}

export default Layout;