import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/* ---------------- NAV LINKS ---------------- */
const NAV_LINKS = [
  { name: "🏠 Home", path: "/" },
  { name: "🛡️ Plans", path: "/plans" },
  { name: "🧾 Claims", path: "/claims" },
  { name: "🛈 About Us", path: "/about" },
  { name: "✉️ Contact Us", path: "/contact" },
];

function Header() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);

  const lastScrollY = useRef(0);
  const mobileMenuRef = useRef(null);
  const menuButtonRef = useRef(null);

  /* ---------------- SCROLL LOGIC ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Shadow
      setIsScrolled(currentScrollY > 10);

      // Hide on scroll down
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setHideHeader(true);
      } else {
        setHideHeader(false);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------------- EXPOSE HEADER HEIGHT ---------------- */
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height",
      hideHeader ? "0px" : "5.5rem"
    );
  }, [hideHeader]);

  /* ---------------- CLOSE MENU ON ROUTE CHANGE ---------------- */
  useEffect(() => {
    if (menuOpen) setMenuOpen(false);
  }, [location]);

  /* ---------------- BODY SCROLL LOCK ---------------- */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [menuOpen]);

  /* ---------------- FILTER LINKS ---------------- */
  const visibleLinks = NAV_LINKS.filter((link) => {
    if (
      link.path.startsWith("/claims") ||
      link.path.startsWith("/utilities")
    ) {
      return isAuthenticated;
    }
    return true;
  });

  /* ---------------- NAV LINK STYLE ---------------- */
  const getNavClass = ({ isActive }) =>
    `relative px-2 py-2 font-semibold transition
     ${
       isActive
         ? "text-black after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-0.5 after:bg-[#1A5EDB]"
         : "text-[#1A5EDB] hover:text-[#0F4BA8]"
     }
     focus:outline-none focus:ring-2 focus:ring-[#1A5EDB] rounded-md`;

  /* ================= RENDER ================= */
  return (
    <>
      {/* FLOATING AUTO-HIDE HEADER */}
      <header
        className={`sticky top-3 z-50 flex justify-center px-2
          transition-transform transition-opacity duration-300 ease-in-out
          ${hideHeader ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}
        `}
        role="banner"
      >
        {/* GLASS CONTAINER */}
        <div
          className={`w-full max-w-7xl
            backdrop-blur-xl bg-white/70
            border border-white/40
            rounded-2xl
            shadow-[0_10px_30px_rgba(0,0,0,0.08)]
            transition-all duration-300
            ${isScrolled ? "bg-white/80 shadow-lg" : ""}
          `}
        >
          {/* NAV BAR */}
          <nav className="flex items-center justify-between px-4 lg:px-8 py-3">
            {/* LOGO */}
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/Logo-circle.png"
                alt=""
                className="h-14 w-auto"
              />
              <span className="text-xl font-extrabold leading-tight">
                <span className="text-[#1A5EDB]">Bharat</span>
                <br />
                <span className="text-black">Suraksha</span>
              </span>
            </Link>

            {/* DESKTOP NAV */}
            <div className="hidden md:flex items-center gap-4">
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  className={getNavClass}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="px-5 py-2 rounded-xl border border-[#1A5EDB]
                             text-[#1A5EDB] font-semibold
                             hover:bg-[#1A5EDB] hover:text-white transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-xl border border-[#1A5EDB]
                             text-[#1A5EDB] font-semibold
                             hover:bg-[#1A5EDB] hover:text-white transition"
                >
                  Login
                </Link>
              )}

              {!isAuthenticated && (
                <button
                  onClick={() => navigate('/register', { state: { from: '/plans' } })}
                  className="px-6 py-2 rounded-xl bg-[#1A5EDB]
                                   text-white font-semibold
                                   hover:bg-[#0F4BA8] shadow-md transition">
                  Get Quote
                </button>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              ref={menuButtonRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-[#1A5EDB]
                         hover:bg-blue-50 focus:ring-2 focus:ring-[#1A5EDB]"
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </nav>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden border-t border-gray-200
                         bg-white/90 backdrop-blur-xl
                         rounded-b-2xl px-4 py-4"
            >
              {visibleLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-3 rounded-lg font-semibold
                             text-[#1A5EDB] hover:bg-blue-50"
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="mt-4 flex flex-col gap-3">
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl
                               border border-[#1A5EDB]
                               text-[#1A5EDB] font-semibold"
                  >
                    Login
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="w-full py-3 rounded-xl
                               border border-[#1A5EDB]
                               text-[#1A5EDB] font-semibold"
                  >
                    Logout
                  </button>
                )}

                {!isAuthenticated && (
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/register', { state: { from: '/plans' } }); }}
                    className="w-full py-3 rounded-xl
                                     bg-[#1A5EDB] text-white font-semibold">
                    Get Quote
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Header;
