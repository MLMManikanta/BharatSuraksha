import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md relative z-50">

      {/* Skip to main content (Accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* NAV BAR */}
      <nav
        className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6"
        aria-label="Primary navigation"
      >
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/images/Logo-circle.png"
            alt="Bharat Suraksha logo"
            className="h-14 w-auto"
          />
          <span className="text-2xl font-bold text-[#1A5EDB] leading-tight">
            Bharat
            <br />
            Suraksha
          </span>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex gap-8 text-lg font-medium">
          <Link to="/" className="text-black hover:text-[#1149AE]">
            Home
          </Link>
          <Link to="/plans" className="text-[#1A5EDB] hover:text-[#1149AE]">
            Plans
          </Link>
          <Link to="/claims" className="text-[#1A5EDB] hover:text-[#1149AE]">
            Claims
          </Link>
          <Link to="/about" className="text-[#1A5EDB] hover:text-[#1149AE]">
            About Us
          </Link>
          <Link to="/contact" className="text-[#1A5EDB] hover:text-[#1149AE]">
            Contact Us
          </Link>
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex gap-4">
          <Link
            to="/login"
            className="px-5 py-2 border border-[#1A5EDB] text-[#1A5EDB] rounded-lg hover:bg-[#1149AE] hover:text-white transition"
          >
            Login
          </Link>
          <button className="px-5 py-2 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition">
            Get Quote
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
          <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
          <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
        </button>
      </nav>

      {/* MOBILE MENU (FLOATING – NO OVERLAP) */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-white shadow-lg px-6 py-5 space-y-4 text-lg font-medium border-t border-gray-200 transition-all duration-300">
          <Link to="/" className="block text-black hover:text-[#1149AE]" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/plans" className="block text-[#1A5EDB] hover:text-[#1149AE]" onClick={() => setMenuOpen(false)}>
            Plans
          </Link>
          <Link to="/claims" className="block text-[#1A5EDB] hover:text-[#1149AE]" onClick={() => setMenuOpen(false)}>
            Claims
          </Link>
          <Link to="/about" className="block text-[#1A5EDB] hover:text-[#1149AE]" onClick={() => setMenuOpen(false)}>
            About Us
          </Link>
          <Link to="/contact" className="block text-[#1A5EDB] hover:text-[#1149AE]" onClick={() => setMenuOpen(false)}>
            Contact Us
          </Link>

          <hr className="border-gray-300" />

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block w-full border border-[#1A5EDB] text-[#1A5EDB] rounded text-center py-2 hover:bg-[#1149AE] hover:text-white transition font-semibold"
          >
            Login
          </Link>

          <button className="w-full py-2 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition">
            Get Quote
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
