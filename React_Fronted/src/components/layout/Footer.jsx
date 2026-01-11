import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t-4 border-[#1A5EDB] font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16">

        {/* 1. BRAND SECTION */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-4 group">
            {/* Kept your logo image, but added brightness filter for better contrast on dark mode if needed */}
            <img
              src="/images/Logo-circle.png"
              className="w-16 h-auto brightness-110"
              alt="Bharat Suraksha Logo"
            />
            <h2 className="text-2xl font-bold leading-tight text-white tracking-wide">
              Bharat <br />
              <span className="text-[#1A5EDB]">Suraksha</span>
            </h2>
          </Link>

          <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
            Your trusted partner for comprehensive health insurance solutions. 
            Protecting what matters most with transparency and care.
          </p>
        </div>

        {/* 2. QUICK LINKS */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
            Quick Links
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#1A5EDB] rounded-full"></span>
          </h3>
          <ul className="space-y-3 text-sm">
            {['Plans', 'Claims', 'About Us', 'FAQs'].map((item) => (
              <li key={item}>
                <Link 
                  to={`/${item.toLowerCase().replace(" ", "")}`} 
                  className="block hover:text-[#1A5EDB] hover:translate-x-1 transition-all duration-300"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. CONTACT (Semantic Address Tag) */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
            Contact Us
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#1A5EDB] rounded-full"></span>
          </h3>

          <address className="not-italic space-y-4 text-sm">
            <a
              href="tel:9063807489"
              className="flex items-start gap-3 hover:text-[#1A5EDB] transition group"
            >
              {/* Phone Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-0.5 text-[#1A5EDB] group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+91 90638 07489</span>
            </a>

            <a
              href="mailto:mlmmanikanta@outlook.com"
              className="flex items-start gap-3 hover:text-[#1A5EDB] transition group"
            >
              {/* Mail Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mt-0.5 text-[#1A5EDB] group-hover:text-white transition" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="break-all">mlmmanikanta@outlook.com</span>
            </a>
          </address>
        </div>

        {/* 4. SOCIAL */}
        <div>
          <h3 className="text-white text-lg font-bold mb-6 relative inline-block">
            Follow Us
            <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#1A5EDB] rounded-full"></span>
          </h3>
          <div className="flex items-center gap-4">
            
            {/* Instagram */}
            <a href="#" aria-label="Follow us on Instagram" className="bg-slate-800 p-3 rounded-full hover:bg-pink-600 hover:text-white transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>

            {/* WhatsApp */}
            <a href="#" aria-label="Chat on WhatsApp" className="bg-slate-800 p-3 rounded-full hover:bg-green-500 hover:text-white transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            
            {/* LinkedIn (Added as extra polish) */}
            <a href="#" aria-label="Connect on LinkedIn" className="bg-slate-800 p-3 rounded-full hover:bg-[#0077b5] hover:text-white transition-all duration-300 group">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>

          </div>
        </div>

      </div>

      {/* COPYRIGHT & LEGAL */}
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center sm:flex sm:justify-between sm:text-left">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Bharat Suraksha. All Rights Reserved.
        </p>
        <div className="mt-4 sm:mt-0 space-x-6 text-sm text-slate-500">
          <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;