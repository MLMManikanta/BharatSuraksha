import Header from './Header'
import Footer from './Footer'
import { useEffect, useState } from 'react'

function Layout({ children }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference (WCAG 2.2)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#E8F1FF] via-[#F0F6FF] to-[#E8F1FF]">
      <style>{`
        /* Smooth transitions for layout changes with reduced motion support */
        @media (prefers-reduced-motion: no-preference) {
          main {
            animation: fadeIn 0.5s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(0.5rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }

        /* Ensure smooth scrolling with accessibility in mind */
        html {
          scroll-behavior: ${prefersReducedMotion ? 'auto' : 'smooth'};
        }

        /* Custom scrollbar styling for modern look */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: #e8f1ff;
        }

        ::-webkit-scrollbar-thumb {
          background: #1A5EDB;
          border-radius: 6px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #0F4BA8;
        }
      `}</style>

      <Header />
      
      <main 
        id="main-content" 
        className="flex-1" 
        role="main"
        tabIndex={-1}
      >
        {children}
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout
