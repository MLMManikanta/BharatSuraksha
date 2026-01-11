function Header() {
  return (
    <header classNameName="w-full">
         <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded">
        Skip to main content
    </a>


    <header className="w-full bg-white shadow-md">
        <nav className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6" aria-label="Primary navigation">

 
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 left-0">
                <img src="/images/Logo-circle.png" alt="Bharat Suraksha logo" className="h-20 w-auto sm:h-20 sm:w-auto" />
                <span className="text-2xl font-bold text-[#1A5EDB] leading-tight">
                    Bharat<br/>Suraksha
                </span>
            </div>

            <div className="hidden md:flex gap-8 text-lg font-medium">
                <a href="./index.html" className="hover:text-[#1149AE] text-[#000000]">Home</a>
                <a href="#" className="hover:text-[#1149AE] text-[#1A5EDB]">Plans</a>
                <a href="#" className="hover:text-[#1149AE] text-[#1A5EDB]">Claim</a>
                <a href="./about_us.html" className="hover:text-[#1149AE] text-[#1A5EDB]">About Us</a>
                <a href="./Contact_Us.html" className="hover:text-[#1149AE] text-[#1A5EDB]">Contact Us</a>
            </div>

            <div className="hidden md:flex gap-4">
                <a href="./login.html" className="px-5 py-2 border border-[#1A5EDB] text-[#1A5EDB] rounded-lg hover:bg-[#1149AE] hover:text-white transition outline-2">
                    Login
                </a>
                <button className="px-5 py-2 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition">
                    Get Quote
                </button>
            </div>

 
            <button id="menuBtn" title="Open navigation menu" className="md:hidden flex flex-col gap-1" aria-label="Toggle navigation menu" aria-controls="mobileMenu" aria-expanded="false">
                <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
                <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
                <span className="w-8 h-1 bg-[#1A5EDB] rounded"></span>
            </button>
        </nav>


        <div id="mobileMenu" className="hidden md:hidden bg-white shadow-md px-6 py-5 space-y-4 text-lg font-medium">
            <a href="./index.html" className="block text-[#000000] hover:text-[#1149AE]">Home</a>
            <a href="#" className="block text-[#1A5EDB] hover:text-[#1149AE]">Plans</a>
            <a href="#" className="block text-[#1A5EDB] hover:text-[#1149AE]">Claim</a>
            <a href="./about_us.html" className="block text-[#1A5EDB] hover:text-[#1149AE]">About Us</a>
            <a href="#" className="block text-[#1A5EDB] hover:text-[#1149AE]">Contact Us</a>

            <hr className="border-gray-300"/>

            <a href="./login.html" className="w-full border border-[#1A5EDB] text-[#1A5EDB] rounded text-center hover:bg-[#1149AE] hover:text-white transition
            flex justify-center items-center font-semibold ">
                Login
            </a>

            <button className="w-full py-2 bg-[#1A5EDB] text-white rounded-lg hover:bg-[#1149AE] transition ">
                Get Quote
            </button>
        </div>
    </header>

  <hr className="outline-1 border-[#1A5EDB] outline-[#1A5EDB]"/>
    </header>
  )
}

export default Header
