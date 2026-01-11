import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    isActive
      ? "text-black font-semibold"
      : "text-[#1A5EDB] hover:text-[#1149AE]";

  return (
    <header className="w-full bg-white shadow-md relative z-50">

      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>

      {/* NAV BAR */}
      <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
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
          <NavLink to="/" end className={navClass}>Home</NavLink>
          <NavLink to="/plans" className={navClass}>Plans</NavLink>
          <NavLink to="/claims" className={navClass}>Claims</NavLink>
          <NavLink to="/about" className={navClass}>About Us</NavLink>
          <NavLink to="/contact" className={navClass}>Contact Us</NavLink>
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
          aria-expanded={menuOpen}
        >
          <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
          <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
          <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full md:hidden bg-white shadow-lg px-6 py-5 space-y-4 text-lg font-medium border-t border-gray-200">
          <NavLink to="/" end className={navClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/plans" className={navClass} onClick={() => setMenuOpen(false)}>Plans</NavLink>
          <NavLink to="/claims" className={navClass} onClick={() => setMenuOpen(false)}>Claims</NavLink>
          <NavLink to="/about" className={navClass} onClick={() => setMenuOpen(false)}>About Us</NavLink>
          <NavLink to="/contact" className={navClass} onClick={() => setMenuOpen(false)}>Contact Us</NavLink>

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
