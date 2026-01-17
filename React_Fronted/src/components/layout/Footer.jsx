import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Footer() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const currentYear = new Date().getFullYear();

  // Check for reduced motion preference (WCAG 2.2)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Animation class based on reduced motion preference
  const animationClass = prefersReducedMotion 
    ? "" 
    : "animate-in fade-in slide-in-from-bottom-4 duration-700";

  return (
    <footer 
      className={`bg-slate-950 text-slate-300 py-16 lg:py-20 border-t-4 border-[#1A5EDB] font-sans ${animationClass}`}
      role="contentinfo"
      aria-label="Footer"
    >
      <style>{`
        /* Enhanced footer animations with reduced motion support */
        @media (prefers-reduced-motion: no-preference) {
          .footer-link {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .footer-link:hover {
            transform: translateX(0.25rem);
            color: #4A8EFF;
          }

          .social-icon {
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .social-icon:hover {
            transform: translateY(-0.25rem) scale(1.1);
          }

          .logo-hover:hover img {
            transform: scale(1.05) rotate(3deg);
          }
        }

        /* Enhanced focus visible for keyboard navigation */
        .focus-ring-footer:focus-visible {
          outline: 3px solid #1A5EDB;
          outline-offset: 4px;
          border-radius: 0.375rem;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">

        {/* BRAND SECTION */}
        <div className="space-y-6">
          <Link 
            to="/" 
            className={`flex items-center gap-3 group focus-ring-footer ${prefersReducedMotion ? "" : "logo-hover"}`}
            aria-label="Bharat Suraksha Home"
          >
            <div className="text-4xl filter drop-shadow-lg">🛡️</div> 
            <h2 className="text-2xl font-extrabold leading-tight text-white tracking-wide">
              Bharat <br />
              <span className="text-[#4A8EFF]">Suraksha</span>
            </h2>
          </Link>

          <p className="text-base leading-relaxed text-slate-400 max-w-xs">
            Your trusted partner for comprehensive health insurance solutions. 
            Protecting what matters most with transparency and care.
          </p>
        </div>

        {/* QUICK LINKS */}
        <nav aria-label="Quick links">
          <h3 className="text-white text-lg font-extrabold mb-6 relative inline-block">
            Quick Links 🔗
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#4A8EFF] rounded-full" aria-hidden="true"></span>
          </h3>
          <ul className="space-y-3 text-base" role="list">
            {[
              { name: '🛡️ Plans', path: '/plans' },
              { name: '🧾 Claims', path: '/claims' },
              { name: '🛈 About Us', path: '/about' },
              { name: '❓ FAQs', path: '/faqs' }
            ].map((item) => (
              <li key={item.name}>
                <Link 
                  to={item.path} 
                  className={`inline-block font-medium focus-ring-footer ${prefersReducedMotion ? "hover:text-[#4A8EFF]" : "footer-link"}`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CONTACT INFO */}
        <div>
          <h3 className="text-white text-lg font-extrabold mb-6 relative inline-block">
            Contact Us 📞
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#4A8EFF] rounded-full" aria-hidden="true"></span>
          </h3>

          <address className="not-italic space-y-4 text-base">
            <div className="flex items-start gap-3 group">
              <span className="text-2xl -mt-0.5">📞</span>
              <a
                href="tel:+919063807489"
                className="font-medium hover:text-[#4A8EFF] transition-colors duration-300 focus-ring-footer"
                aria-label="Call us at +91 90638 07489"
              >
                +91 90638 07489
              </a>
            </div>

            <div className="flex items-start gap-3 group">
              <span className="text-2xl -mt-0.5">📧</span>
              <a
                href="mailto:mlmmanikanta@outlook.com"
                className="font-medium hover:text-[#4A8EFF] transition-colors duration-300 focus-ring-footer"
                aria-label="Email us at mlmmanikanta@outlook.com"
              >
                mlmmanikanta@outlook.com
              </a>
            </div>
            
            <div className="flex items-start gap-3 group">
              <span className="text-2xl -mt-0.5">📍</span>
              <p className="text-slate-400">
                Tech Park, Bangalore,<br/>Karnataka, India
              </p>
            </div>
          </address>
        </div>

        {/* SOCIAL MEDIA */}
        <div>
          <h3 className="text-white text-lg font-extrabold mb-6 relative inline-block">
            Follow Us 🌐
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#4A8EFF] rounded-full" aria-hidden="true"></span>
          </h3>
          <div className="flex items-center gap-4" role="list">
            
            {/* Instagram */}
            <a 
              href="#" 
              aria-label="Follow us on Instagram" 
              className={`bg-slate-800 p-3.5 rounded-full hover:bg-linear-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-300 ${prefersReducedMotion ? "" : "social-icon"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>

            {/* WhatsApp */}
            <a 
              href="#" 
              aria-label="Chat with us on WhatsApp" 
              className={`bg-slate-800 p-3.5 rounded-full hover:bg-green-500 hover:text-white hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-300 ${prefersReducedMotion ? "" : "social-icon"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            
            {/* Facebook */}
            <a 
              href="#" 
              aria-label="Follow us on Facebook" 
              className={`bg-slate-800 p-3.5 rounded-full hover:bg-[#1877F2] hover:text-white hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#1877F2] focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-300 ${prefersReducedMotion ? "" : "social-icon"}`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>

            {/* LinkedIn */}
            <a 
              href="#" 
              aria-label="Connect with us on LinkedIn" 
              className={`bg-slate-800 p-3.5 rounded-full hover:bg-[#0077b5] hover:text-white hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#0077b5] focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-300 ${prefersReducedMotion ? "" : "social-icon"}`}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>

          </div>
        </div>

      </div>

      {/* COPYRIGHT & LEGAL */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t-2 border-slate-800 text-center sm:flex sm:justify-between sm:items-center sm:text-left">
        <p className="text-base text-slate-400 font-medium">
          © {currentYear} Bharat Suraksha. All Rights Reserved.
        </p>
        <nav className="mt-4 sm:mt-0 flex flex-wrap justify-center gap-6 text-base" aria-label="Legal">
          <Link 
            to="/privacy" 
            className="text-slate-400 font-medium hover:text-[#4A8EFF] transition-colors duration-300 focus-ring-footer"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms" 
            className="text-slate-400 font-medium hover:text-[#4A8EFF] transition-colors duration-300 focus-ring-footer"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;