import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

// 1. Define links outside component to keep code DRY
const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Plans", path: "/plans" },
  { name: "Claims", path: "/claims" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation(); // Hook to get current URL path

  // Define routes that should keep the "Plans" menu item active
  const planRelatedRoutes = ["/select-plan", "/plan-details", "/customize"];

  // Helper for consistent link styling
  const getNavClass = ({ isActive, path }) => {
    // Check if we are on the specific link OR if we are on a related sub-page
    const isPlanSectionActive = path === "/plans" && planRelatedRoutes.includes(location.pathname);
    
    // Final active condition
    const shouldBeActive = isActive || isPlanSectionActive;

    return `transition-colors duration-200 ${
      shouldBeActive
        ? "text-black font-bold"
        : "text-[#1A5EDB] hover:text-[#1149AE] font-medium"
    }`;
  };

  return (
    <header className="w-full bg-white shadow-md relative z-50 font-sans">
      
      {/* 2. Accessibility: Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-60 focus:px-4 focus:py-2 focus:bg-[#1A5EDB] focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A5EDB]"
      >
        Skip to main content
      </a>

      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group" aria-label="Bharat Suraksha Home">
          <img
            src="/images/Logo-circle.png"
            alt="Bharat Suraksha Logo"
            className="h-20 w-auto group-hover:opacity-90 transition-opacity"
          />
          <span className="text-xl md:text-2xl font-bold text-[#1A5EDB] leading-tight">
            Bharat <br /> Suraksha
          </span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8 text-lg">
          {NAV_LINKS.map((link) => (
            <NavLink 
              key={link.name} 
              to={link.path} 
              end={link.path === "/"} 
              // We pass an object to className function, but we also need the 'path' for our custom check
              className={({ isActive }) => getNavClass({ isActive, path: link.path })}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="px-6 py-2.5 border border-[#1A5EDB] text-[#1A5EDB] font-medium rounded-lg hover:bg-[#1A5EDB] hover:text-white transition-all duration-300"
          >
            Login
          </Link>
          <button className="px-6 py-2.5 bg-[#1A5EDB] text-white font-medium rounded-lg hover:bg-[#1149AE] shadow-md hover:shadow-lg transition-all duration-300">
            Get Quote
          </button>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[#1A5EDB] focus:outline-none focus:ring-2 focus:ring-[#1A5EDB] rounded-md"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          )}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) => {
                // Duplicate logic for mobile to ensure consistency
                const isPlanSectionActive = link.path === "/plans" && planRelatedRoutes.includes(location.pathname);
                const shouldBeActive = isActive || isPlanSectionActive;
                
                return `text-lg py-2 border-b border-gray-100 ${shouldBeActive ? "text-[#1A5EDB] font-bold" : "text-gray-600 font-medium"}`;
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          <div className="flex flex-col gap-3 mt-2">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full text-center py-3 border border-[#1A5EDB] text-[#1A5EDB] font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Login
            </Link>
            <button className="w-full py-3 bg-[#1A5EDB] text-white font-semibold rounded-lg hover:bg-[#1149AE] shadow-md transition">
              Get Quote
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;