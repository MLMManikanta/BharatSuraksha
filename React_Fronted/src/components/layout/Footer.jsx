function Footer() {
  return (
    <footer className="bg-black text-white py-12 border-t-2 border-[#1A5EDB]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 px-6 gap-12">

            <div className="flex flex-col items-start">
                <div className="flex items-center gap-4">
                    <img src="/images/Logo-circle.png" className="w-28 sm:w-32" alt="Logo" />
                    <h2 className="text-2xl font-bold leading-tight">Bharat <br/> Suraksha</h2>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mt-4">
                    Your trusted partner for comprehensive health 
                    insurance solutions. Protecting what matters most.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                    <li><a href="#" className="hover:text-[#1A5EDB]">Plans</a></li>
                    <li><a href="#" className="hover:text-[#1A5EDB]">Claims</a></li>
                    <li><a href="#" className="hover:text-[#1A5EDB]">About Us</a></li>
                    <li><a href="#" className="hover:text-[#1A5EDB]">FAQs</a></li>
                </ul>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>

                <a href="tel:9063807489" className="flex items-center gap-3 mb-3 hover:text-[#1A5EDB] transition">
                    <img src="./images/footer/phone.png" className="w-6" alt="Phone"/>
                    <span className="text-gray-300 text-sm">9063807489</span>
                </a>

                <a href="mailto:mlmmanikanta@outlook.com" className="flex items-center gap-3 hover:text-[#1A5EDB] transition">
                    <img src="/images/footer/mail.png" className="w-7" alt="mail"/>
                    <span className="text-gray-300 text-sm">mlmmanikanta@outlook.com</span>
                </a>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex items-center gap-4">
                    <img src="/images/footer/instagram.png" className="w-10" alt="instagram"/>
                    <img src="/images/footer/whatapp.png" className="w-10" alt="Whatapp"/>
                </div>
            </div>

        </div>

        <p className="text-center mt-12 text-sm">
            © 2025 Bharat Suraksha. All Rights Reserved.
        </p>
    </footer>
  )
}

export default Footer
