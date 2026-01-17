import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

// Define links outside component to keep code DRY
const NAV_LINKS = [
  { name: "🏠 Home", path: "/" },
  { name: "🛡️ Plans", path: "/plans" },
  { name: "🧾 Claims", path: "/claims" },
  { name: "🧰 Utilities", path: "/utilities/e-card" },
  { name: "🛈 About Us", path: "/about" },
  { name: "✉️ Contact Us", path: "/contact" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && 'matchMedia' in window) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const location = useLocation();
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // --- UPDATED: Full list of checkout flow routes ---
  // This keeps the "Plans" tab active from Step 1 to Step 8 (Success)
  const planRelatedRoutes = [
    "/plan-details",       // Step 1: Member Selection
    "/select-plan",        // Step 2: Plan Selection
    "/customize",          // Step 2b: Custom Builder
    "/plan-review",        // Step 3: Review
    "/proposal-form",      // Intermediate
    "/kyc",                // Step 4: Proposer Details
    "/medical",            // Step 5: Medical History
    "/payment-frequency",  // Step 6: Frequency
    "/bankinfo",           // Step 7: Bank/Order Summary
    "/order-summary",      // Step 7: Order Summary (Alt route)
    "/payment",            // Step 8: Payment Gateway
    "/payment-success"     // Success Page
  ];

  // Claims related routes - keeps "Claims" tab active
  const claimsRelatedRoutes = [
    "/claims/my-claims",
    "/claims/entitlement-dependents",
    "/claims/entitlement",
    "/claims/raise-claim",
    "/claims/raise-new",
    "/claims/details"
  ];

  const utilitiesRelatedRoutes = [
    "/utilities/e-card",
    "/utilities/hospitals",
    "/utilities/justification-letter",
    "/utilities/claim-instructions"
  ];

  // Check for reduced motion preference (WCAG 2.2)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Handle scroll for enhanced header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change (defer to avoid sync setState in effect)
  useEffect(() => {
    if (!menuOpen) return;
    const id = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(id);
  }, [location, menuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  // Focus trapping for mobile menu (WCAG 2.2 compliance)
  useEffect(() => {
    if (!menuOpen || !mobileMenuRef.current) return;

    const menuElement = mobileMenuRef.current;
    const focusableElements = menuElement.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element when menu opens
    firstElement?.focus();

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    menuElement.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      menuElement.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [menuOpen]);

  // Helper for consistent link styling with enhanced accessibility
  const getNavClass = ({ isActive, path }) => {
    // Check if the current route matches the exact path OR is one of the plan/claims steps
    const isPlanSectionActive = path === "/plans" && planRelatedRoutes.includes(location.pathname);
    const isClaimsSectionActive = path === "/claims" && claimsRelatedRoutes.some(route => location.pathname.startsWith(route));
    const isUtilitiesSectionActive = path === "/utilities/e-card" && utilitiesRelatedRoutes.some(route => location.pathname.startsWith(route));
    const shouldBeActive = isActive || isPlanSectionActive || isClaimsSectionActive || isUtilitiesSectionActive;

    const baseClasses = "relative px-1 py-2 font-semibold transition-all duration-300 ease-out";
    const hoverClasses = prefersReducedMotion 
      ? "" 
      : "hover:scale-105 hover:-translate-y-0.5";
    
    // Enhanced focus styles for WCAG 2.2
    const focusClasses = "focus:outline-none focus:ring-2 focus:ring-[#1A5EDB] focus:ring-offset-2 rounded-md";
    
    const colorClasses = shouldBeActive
      ? "text-[#0A0A0A] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#1A5EDB] after:rounded-full"
      : "text-[#1A5EDB] hover:text-[#0F4BA8]";

    return `${baseClasses} ${hoverClasses} ${focusClasses} ${colorClasses}`;
  };

  // Animation classes based on reduced motion preference
  const animationClass = prefersReducedMotion 
    ? "" 
    : "animate-in fade-in slide-in-from-top-4 duration-500";

  return (
    <header 
      className={`w-full bg-white sticky top-0 z-50 font-sans transition-shadow duration-300 overflow-visible ${
        isScrolled ? "shadow-lg" : "shadow-md"
      } ${animationClass}`}
      role="banner"
    >
      <style>{`
        /* Enhanced animations with reduced motion support */
        @media (prefers-reduced-motion: no-preference) {
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-1rem);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .mobile-menu-enter {
            animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .logo-hover-scale:hover img {
            transform: scale(1.05) rotate(2deg);
          }

          .button-press:active {
            transform: scale(0.98);
          }
        }

        /* Enhanced focus visible for keyboard navigation */
        .focus-visible-ring:focus-visible {
          outline: 3px solid #1A5EDB;
          outline-offset: 3px;
          border-radius: 0.5rem;
        }

        /* Smooth transitions for all interactive elements */
        a, button {
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
                      background-color 0.2s ease,
                      color 0.2s ease,
                      box-shadow 0.2s ease;
        }
      `}</style>
      
      {/* Accessibility: Skip to main content link - WCAG 2.2 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-5 focus:py-3 focus:bg-[#1A5EDB] focus:text-white focus:font-semibold focus:rounded-lg focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[#1A5EDB] focus:ring-offset-2 transition-all"
      >
        Skip to main content
      </a>

      <nav 
        className="max-w-7xl mx-auto flex items-center justify-between py-5 px-6 lg:px-8"
        aria-label="Main navigation"
        role="navigation"
      >
        
        {/* LOGO */}
        <Link 
          to="/" 
          className={`flex items-center gap-3 group focus-visible-ring ${
            prefersReducedMotion ? "" : "logo-hover-scale"
          }`}
          aria-label="Bharat Suraksha Home"
        >
          <img
            src="/images/Logo-circle.png"
            alt=""
            role="presentation"
            className={`h-20 w-auto ${
              prefersReducedMotion ? "group-hover:opacity-90" : "transition-all duration-300 ease-out"
            }`}
          />
          <span className="text-xl md:text-2xl font-extrabold text-[#1A5EDB] leading-tight tracking-tight">
            Bharat <br /> Suraksha
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div 
          className="hidden md:flex items-center gap-2 lg:gap-4 text-base lg:text-lg"
          role="menubar"
        >
          {NAV_LINKS.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              end={link.path === "/"} 
              className={({ isActive }) => getNavClass({ isActive, path: link.path })}
              role="menuitem"
              aria-current={location.pathname === link.path ? "page" : undefined}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Link
            to="/login"
            className={`px-5 lg:px-7 py-2.5 lg:py-3 border-2 border-[#1A5EDB] text-[#1A5EDB] font-semibold rounded-lg 
              hover:bg-[#1A5EDB] hover:text-white hover:shadow-lg
              focus:outline-none focus:ring-4 focus:ring-[#1A5EDB] focus:ring-offset-2
              transition-all duration-300 ease-out ${
                prefersReducedMotion ? "" : "hover:scale-105 button-press"
              }`}
            aria-label="Login to your account"
          >
            Login
          </Link>
          <button 
            className={`px-5 lg:px-7 py-2.5 lg:py-3 bg-[#1A5EDB] text-white font-semibold rounded-lg 
              hover:bg-[#0F4BA8] shadow-md hover:shadow-xl
              focus:outline-none focus:ring-4 focus:ring-[#1A5EDB] focus:ring-offset-2
              transition-all duration-300 ease-out ${
                prefersReducedMotion ? "" : "hover:scale-105 button-press"
              }`}
            aria-label="Get a quote"
          >
            Get Quote
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          ref={menuButtonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden p-3 text-[#1A5EDB] rounded-lg
            focus:outline-none focus:ring-4 focus:ring-[#1A5EDB] focus:ring-offset-2
            hover:bg-blue-50 transition-all duration-200 ${
              prefersReducedMotion ? "" : "active:scale-95"
            }`}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="mobile-menu"
        >
          {menuOpen ? (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-7 w-7" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-7 w-7" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div 
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`absolute top-full left-0 w-full md:hidden bg-white shadow-2xl border-t-2 border-gray-100 
            px-6 py-6 flex flex-col gap-2 max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain ${
              prefersReducedMotion ? "" : "mobile-menu-enter"
            }`}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          {NAV_LINKS.map((link, index) => {
            const isPlanSectionActive = link.path === "/plans" && planRelatedRoutes.includes(location.pathname);
            const isUtilitiesSectionActive = link.path === "/utilities/e-card" && utilitiesRelatedRoutes.some(route => location.pathname.startsWith(route));
            const shouldBeActive = location.pathname === link.path || isPlanSectionActive || isUtilitiesSectionActive;
            
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === "/"}
                className={`text-lg py-3 px-4 rounded-lg border-b border-gray-100 last:border-b-0
                  focus:outline-none focus:ring-4 focus:ring-[#1A5EDB] focus:ring-offset-2
                  transition-all duration-200 hover:bg-blue-50 ${
                    shouldBeActive 
                      ? "text-[#1A5EDB] font-bold bg-blue-50" 
                      : "text-[#333333] font-semibold"
                  } ${prefersReducedMotion ? "" : "hover:translate-x-1"}`}
                onClick={() => setMenuOpen(false)}
                role="menuitem"
                aria-current={shouldBeActive ? "page" : undefined}
                style={
                  prefersReducedMotion 
                    ? {} 
                    : { animationDelay: `${index * 50}ms` }
                }
              >
                {link.name}
              </NavLink>
            );
          })}

          <div className="flex flex-col gap-3 mt-4 pt-4 border-t-2 border-gray-100">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className={`w-full text-center py-3 px-4 border-2 border-[#1A5EDB] text-[#1A5EDB] font-semibold rounded-lg 
                hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-[#1A5EDB] focus:ring-offset-2
                transition-all duration-200 ${
                  prefersReducedMotion ? "" : "hover:scale-[1.02] active:scale-[0.98]"
                }`}
              aria-label="Login to your account"
            >
              Login
            </Link>
            <button 
              className={`w-full py-3 px-4 bg-[#1A5EDB] text-white font-semibold rounded-lg 
                hover:bg-[#0F4BA8] shadow-md hover:shadow-lg
                focus:outline-none focus:ring-4 focus:ring-[#1A5EDB] focus:ring-offset-2
                transition-all duration-200 ${
                  prefersReducedMotion ? "" : "hover:scale-[1.02] active:scale-[0.98]"
                }`}
              aria-label="Get a quote"
            >
              Get Quote
            </button>
          </div>
        </div>
      )}

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden ${
            prefersReducedMotion ? "" : "animate-in fade-in duration-300"
          }`}
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
          inert=""
        />
      )}
    </header>
  );
}

export default Header;