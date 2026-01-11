function Login() {
  return (
    <>
   
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-[#B8D2FF] transition-transform duration-500 md:hover:-translate-y-1 md:hover:shadow-2xl card-enter">

      <div class="grid md:grid-cols-2">


        <div class="hidden md:flex bg-linear-to-b from-[#0F52D9] via-[#1A5EDB] to-[#4A8DFF] text-white px-10 py-12 flex-col bg-animate justify-center items-center">

          <div class="flex flex-col gap-6 justify-center items-center">
            <img src="/images/Logo-circle.png" class="w-100" alt="Logo" />
            <div>
              <h1 class="text-3xl md:text-4xl font-bold tracking-wide text-center">Bharat Suraksha</h1>
              <p class="mt-3 text-sm leading-relaxed text-blue-100 text-center">Your trusted partner for comprehensive<br />insurance protection and peace of mind.</p>
            </div>
          </div>
        </div>

        <div class="px-6 sm:px-8 md:px-12 py-8 md:py-10 bg-white">
          <div class="flex items-center gap-3 mb-6 md:hidden">
            <div class="w-12 h-12 rounded-full bg-linear-to-br from-[#0F52D9] to-[#4A8DFF] flex items-center justify-center float-icon">
              <img src="/images/Logo-circle.png" class="w-7" alt="Logo"/>
            </div>
            <div>
              <p class="text-xs text-[#4B5D9A] font-medium tracking-wide">Welcome to</p>
              <h1 class="text-xl font-bold text-[#123C8A] leading-tight">Bharat Suraksha</h1>
            </div>
          </div>

          <h2 class="text-lg sm:text-xl md:text-2xl font-semibold text-[#123C8A]">Login to access your dashboard</h2>

          <form class="mt-6 sm:mt-8 space-y-5 sm:space-y-6">

           
            <div class="space-y-1">
              <label class="block text-sm font-medium text-[#184A9E]">Email or Mobile Number <span class="text-red-500">*</span></label>
              <input type="text" placeholder="Enter your email or 10-digit mobile" class="mt-1 w-full rounded-lg border border-[#C8D8FF] bg-[#F6F8FF] px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-[#1A5EDB] focus:border-[#1A5EDB] transition-all duration-200" />
            </div>

       
            <div class="space-y-1">
              <label class="block text-sm font-medium text-[#184A9E]">Password <span class="text-red-500">*</span></label>

              <div class="relative mt-1">
                <input type="password" placeholder="Enter your password" class="w-full rounded-lg border border-[#C8D8FF] bg-[#F6F8FF] px-3 sm:px-4 py-2.5 sm:py-3 text-sm pr-12 outline-none focus:ring-2 focus:ring-[#1A5EDB] focus:border-[#1A5EDB] transition-all duration-200" />

                <button type="button" class="absolute inset-y-0 right-3 flex items-center text-xs text-[#5278CC] hover:text-[#2449A3] transition-colors duration-150">Show</button>
              </div>
            </div>

            <div class="flex items-center justify-end">
              <a href="#" class="text-xs font-medium text-[#1A5EDB] hover:text-[#0F3C9F] transition-colors duration-150 underline">Forgot Password?</a>
            </div>

          
            <div class="space-y-3 pt-1 sm:pt-2">
              <button type="submit" class="w-full rounded-lg bg-[#1A5EDB] hover:bg-[#0F52D9] text-white font-semibold py-2.5 sm:py-3 text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">Login Securely</button>

              <button type="button" class="w-full rounded-lg border border-[#1A5EDB] text-[#1A5EDB] hover:bg-[#E3EEFF] font-semibold py-2.5 sm:py-3 text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm">Login with OTP</button>
            </div>
          </form>

          <div class="mt-6 sm:mt-8 text-center text-sm text-[#000000] ">
            <p>Insure yourself and family</p>
            <a href="#" class="font-semibold text-[#1A5EDB] hover:text-[#0F3C9F] transition-colors duration-150 text-lg underline">Get Quote and secure </a>
          </div>
        </div>

      </div>
    </div>
  </div>
    </>
  )
}

export default Login
