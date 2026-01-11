import logo from './assets/Logo-circle.png'

function App() {
  return (
    <div className="bg-[#E8F1FF] min-h-screen">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-[#B8D2FF] transition-transform duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl">

          <div className="grid md:grid-cols-2">

            {/* LEFT PANEL */}
            <div className="hidden md:flex bg-linear-to-b from-[#0F52D9] via-[#1A5EDB] to-[#4A8DFF] text-white px-10 py-12 flex-col justify-center items-center">
              <div className="flex flex-col gap-6 justify-center items-center">
                <img src={logo} className="w-24" alt="Logo" />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-center">
                    Bharat Suraksha
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-blue-100 text-center">
                    Your trusted partner for comprehensive
                    <br />
                    insurance protection and peace of mind.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="px-6 sm:px-8 md:px-12 py-8 md:py-10 bg-white">

              {/* Mobile Header */}
              <div className="flex items-center gap-3 mb-6 md:hidden">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#0F52D9] to-[#4A8DFF] flex items-center justify-center">
                  <img src={logo} className="w-7" alt="Logo" />
                </div>
                <div>
                  <p className="text-xs text-[#4B5D9A] font-medium tracking-wide">
                    Welcome to
                  </p>
                  <h1 className="text-xl font-bold text-[#123C8A] leading-tight">
                    Bharat Suraksha
                  </h1>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#123C8A]">
                Login to access your dashboard
              </h2>

              <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#184A9E]">
                    Email or Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your email or 10-digit mobile"
                    className="mt-1 w-full rounded-lg border border-[#C8D8FF] bg-[#F6F8FF] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#1A5EDB]"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-[#184A9E]">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full rounded-lg border border-[#C8D8FF] bg-[#F6F8FF] px-4 py-3 text-sm pr-12 outline-none focus:ring-2 focus:ring-[#1A5EDB]"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-xs text-[#5278CC]"
                    >
                      Show
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div className="flex items-center justify-end">
                  <a
                    href="#"
                    className="text-xs font-medium text-[#1A5EDB] underline"
                  >
                    Forgot Password?
                  </a>
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-[#1A5EDB] hover:bg-[#0F52D9] text-white font-semibold py-3 text-sm transition"
                  >
                    Login Securely
                  </button>

                  <button
                    type="button"
                    className="w-full rounded-lg border border-[#1A5EDB] text-[#1A5EDB] hover:bg-[#E3EEFF] font-semibold py-3 text-sm transition"
                  >
                    Login with OTP
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-black">
                <p>Insure yourself and family</p>
                <a
                  href="#"
                  className="font-semibold text-[#1A5EDB] text-lg underline"
                >
                  Get Quote and secure
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
