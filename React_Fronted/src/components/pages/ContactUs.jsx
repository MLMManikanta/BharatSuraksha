import React from 'react';

function ContactUs() {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-blue-50 to-blue-100 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* LEFT TEXT */}
          <div>
            <span className="bg-blue-100 text-[#1A5EDB] py-1 px-3 rounded-full text-sm font-bold uppercase tracking-wide">
              24/7 Support
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              We're Here to <br />
              <span className="text-[#1A5EDB]">Help You!</span> 👋
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed max-w-lg">
              Whether you have questions about your policy, need assistance with claims,
              or want to locate a branch, our team is ready to support you.
            </p>
          </div>

          {/* RIGHT IMAGE (Placeholder Illustration) */}
          <div className="flex justify-center relative">
            {/* Decorative blob behind image */}
            <div className="absolute top-0 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative z-10 transform rotate-2 hover:rotate-0 transition duration-500">
               <img 
                src="./images/contact_us/support_team.jpeg"
                alt="Customer support team"
                className="rounded-xl w-full h-64 object-cover"
                // Fallback if image missing:
                onError={(e) => {e.target.src='https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. REACH OUT CARDS SECTION */}
      <section className="max-w-7xl mx-auto -mt-16 px-6 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Claims Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-[#1A5EDB] hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1A5EDB]">
              {/* Clipboard Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Claims Support</h3>
            <p className="text-gray-600 mt-2 text-sm">Track existing claims or file a new one instantly.</p>
            <a href="#" className="inline-block mt-4 text-[#1A5EDB] font-semibold hover:underline">Go to Claims →</a>
          </div>

          {/* Call Us Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-[#1A5EDB] hover:-translate-y-2 transition-transform duration-300">
             <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1A5EDB]">
              {/* Phone Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Call Us 24/7</h3>
            <p className="text-gray-600 mt-2 text-sm">Speak directly with our expert agents.</p>
            <a href="tel:9063807489" className="inline-block mt-4 text-2xl font-bold text-[#1A5EDB]">90638 07489</a>
          </div>

          {/* Email Card */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border-b-4 border-[#1A5EDB] hover:-translate-y-2 transition-transform duration-300">
             <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-[#1A5EDB]">
              {/* Mail Icon SVG */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Email Support</h3>
            <p className="text-gray-600 mt-2 text-sm">Get a response within 24 hours.</p>
            <a href="mailto:support@bharatsuraksha.com" className="inline-block mt-4 text-[#1A5EDB] font-semibold break-all">mlmmanikanta@outlook.com</a>
          </div>

        </div>
      </section>

      {/* 3. LOCATIONS SECTION */}
      <section className="max-w-7xl mx-auto mt-20 px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">Find Us Nearby 📍</h2>
          <p className="text-gray-600 mt-2">Locate branches and hospitals in your area</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="p-4 bg-blue-50 rounded-lg text-[#1A5EDB] mr-4 text-3xl">🏢</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Nearest Branch</h3>
              <p className="text-sm text-gray-500 mb-2">Visit us for face-to-face assistance</p>
              <button className="text-[#1A5EDB] text-sm font-semibold hover:underline">Locate Now</button>
            </div>
          </div>

          <div className="flex items-center p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition">
            <div className="p-4 bg-blue-50 rounded-lg text-[#1A5EDB] mr-4 text-3xl">🚑</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">Network Hospitals</h3>
              <p className="text-sm text-gray-500 mb-2">Find cashless hospitals nearby</p>
              <button className="text-[#1A5EDB] text-sm font-semibold hover:underline">Locate Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CONTACT FORM SECTION */}
      <section className="max-w-4xl mx-auto mt-24 mb-20 px-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-[#1A5EDB] py-6 text-center">
            <h2 className="text-3xl font-bold text-white">Write to Us ✍️</h2>
            <p className="text-blue-100 mt-1">Fill out the form below and we will get back to you.</p>
          </div>

          <form className="p-8 md:p-12 space-y-6" onSubmit={handleSubmit}>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* NAME */}
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input 
                  id="name" 
                  type="text" 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none transition"
                  placeholder="e.g. Rahul Kumar" 
                />
              </div>

              {/* PHONE */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <input 
                  id="phone" 
                  type="tel" 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none transition"
                  placeholder="+91 98765 43210" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* EMAIL */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  required 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none transition"
                  placeholder="you@example.com" 
                />
              </div>

              {/* QUERY TYPE */}
              <div>
                <label htmlFor="queryType" className="block text-sm font-bold text-gray-700 mb-2">Query Type</label>
                <div className="relative">
                  <select 
                    id="queryType" 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none appearance-none transition"
                  >
                    <option>Select Query Type</option>
                    <option>Claim Issue</option>
                    <option>Policy Update</option>
                    <option>New Policy Inquiry</option>
                    <option>Branch Info</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* MESSAGE */}
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Your Message</label>
              <textarea 
                id="message" 
                rows="4" 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#1A5EDB] focus:bg-white outline-none transition"
                placeholder="How can we help you today?"
              ></textarea>
            </div>

            {/*  SUBMIT */}
            <div className="grid md:grid-cols-3 gap-6 items-end">
              <button 
                type="submit" 
                className="w-full py-3 bg-[#1A5EDB] text-white rounded-lg font-bold text-lg hover:bg-[#114BB7] transform active:scale-95 transition shadow-lg hover:shadow-xl cursor-pointer"
              >
                Submit Request
              </button>
            </div>

          </form>
        </div>
      </section>

    </main>
  );
}

export default ContactUs;