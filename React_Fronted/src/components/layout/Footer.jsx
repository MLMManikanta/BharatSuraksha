import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t-2 border-[#1A5EDB]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-6 gap-12">

        {/* BRAND */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-4">
            <img
              src="/images/Logo-circle.png"
              className="w-28 sm:w-32"
              alt="Logo"
            />
            <h2 className="text-2xl font-bold leading-tight">
              Bharat <br /> Suraksha
            </h2>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mt-4">
            Your trusted partner for comprehensive health
            insurance solutions. Protecting what matters most.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><Link to="/plans" className="hover:text-[#1A5EDB]">Plans</Link></li>
            <li><Link to="/claims" className="hover:text-[#1A5EDB]">Claims</Link></li>
            <li><Link to="/about" className="hover:text-[#1A5EDB]">About Us</Link></li>
            <li><Link to="/faqs" className="hover:text-[#1A5EDB]">FAQs</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>

          <a
            href="tel:9063807489"
            className="flex items-center gap-3 mb-3 text-gray-300 hover:text-[#1A5EDB] transition"
          >
            <img src="/images/footer/phone.png" className="w-6" alt="Phone" />
            <span className="text-sm">9063807489</span>
          </a>

          <a
            href="mailto:mlmmanikanta@outlook.com"
            className="flex items-center gap-3 text-gray-300 hover:text-[#1A5EDB] transition"
          >
            <img src="/images/footer/mail.png" className="w-7" alt="Mail" />
            <span className="text-sm">mlmmanikanta@outlook.com</span>
          </a>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex items-center gap-4">
            <img src="/images/footer/instagram.png" className="w-10" alt="Instagram" />
            <img src="/images/footer/whatapp.png" className="w-10" alt="WhatsApp" />
          </div>
        </div>

      </div>

      {/* COPYRIGHT */}
      <p className="text-center mt-12 text-sm text-gray-400">
        © 2025 Bharat Suraksha. All Rights Reserved.
      </p>
    </footer>
  );
}

export default Footer;
