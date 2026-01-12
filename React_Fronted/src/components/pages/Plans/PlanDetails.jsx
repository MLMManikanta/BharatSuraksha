import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// --- CUSTOM DATE PICKER COMPONENT ---
const CustomDatePicker = ({ label, value, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('day'); // 'day', 'month', 'year'
  const [displayDate, setDisplayDate] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef(null);
  const today = new Date();

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) setDisplayDate(new Date(value));
  }, [value]);

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  // Navigation
  const handlePrev = () => {
    if (view === 'day') setDisplayDate(new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1));
    if (view === 'month') setDisplayDate(new Date(displayDate.getFullYear() - 1, displayDate.getMonth(), 1));
    if (view === 'year') setDisplayDate(new Date(displayDate.getFullYear() - 12, displayDate.getMonth(), 1));
  };

  const handleNext = () => {
    const nextDate = view === 'day' 
      ? new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1)
      : view === 'month' 
        ? new Date(displayDate.getFullYear() + 1, displayDate.getMonth(), 1)
        : new Date(displayDate.getFullYear() + 12, displayDate.getMonth(), 1);

    if (nextDate <= new Date(today.getFullYear() + 1, 0, 1)) { 
       setDisplayDate(nextDate);
    }
  };

  // Selections
  const selectDate = (day) => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    const offset = newDate.getTimezoneOffset();
    const adjustedDate = new Date(newDate.getTime() - (offset*60*1000));
    onChange(adjustedDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const selectMonth = (monthIndex) => {
    setDisplayDate(new Date(displayDate.getFullYear(), monthIndex, 1));
    setView('day');
  };

  const selectYear = (year) => {
    setDisplayDate(new Date(year, displayDate.getMonth(), 1));
    setView('month');
  };

  // Renderers
  const renderDayView = () => {
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const currentDate = new Date(year, month, d);
      const isSelected = value && new Date(value).toDateString() === currentDate.toDateString();
      const isFuture = currentDate > today; // Disable future dates
      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      days.push(
        <button
          key={d}
          disabled={isFuture}
          onClick={() => !isFuture && selectDate(d)}
          className={`h-10 w-full flex items-center justify-center rounded-xl text-sm font-medium transition-all
            ${isSelected ? 'border-2 border-purple-600 text-black font-bold' : ''}
            ${!isSelected && !isFuture && isWeekend ? 'bg-gray-200 text-gray-700' : ''}
            ${!isSelected && !isFuture && !isWeekend ? 'bg-white hover:bg-blue-50 text-gray-700' : ''}
            ${isFuture ? 'text-gray-300 cursor-not-allowed' : ''}
          `}
        >
          {d}
        </button>
      );
    }

    return (
      <div className="p-2">
        <div className="grid grid-cols-7 mb-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <span key={day} className="text-xs font-bold text-slate-500">{day}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {days}
        </div>
      </div>
    );
  };

  const renderMonthView = () => (
    <div className="grid grid-cols-3 gap-4 p-4">
      {months.map((m, i) => (
        <button
          key={m}
          onClick={() => selectMonth(i)}
          className={`py-2 rounded-lg text-sm font-bold transition-colors ${
            displayDate.getMonth() === i ? 'border-2 border-purple-600 text-black' : 'text-[#1A5EDB] hover:bg-blue-50'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );

  const renderYearView = () => {
    const currentYear = today.getFullYear();
    const startYear = displayDate.getFullYear() - 6;
    const years = [];
    for (let i = 0; i < 12; i++) {
      years.push(startYear + i);
    }
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {years.map(y => (
          <button
            key={y}
            disabled={y > currentYear}
            onClick={() => y <= currentYear && selectYear(y)}
            className={`py-2 rounded-lg text-sm font-bold transition-colors ${
              displayDate.getFullYear() === y ? 'border-2 border-purple-600 text-black' : 
              y > currentYear ? 'text-gray-300 cursor-not-allowed' : 'text-[#1A5EDB] hover:bg-blue-50'
            }`}
          >
            {y}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="relative group" ref={containerRef}>
      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide group-focus-within:text-[#1A5EDB] transition-colors">
        {label} <span className="text-red-500">*</span>
      </label>
      
      <div onClick={() => setIsOpen(!isOpen)} className="relative cursor-pointer">
        <input 
          type="text" 
          readOnly
          value={value ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : ''}
          placeholder="Select DOB"
          className={`w-full pl-4 pr-10 py-3 rounded-xl border ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white'} text-gray-700 font-medium focus:border-[#1A5EDB] outline-none cursor-pointer`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
        </div>
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-bold">{error}</p>}

      {/* POPUP */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 animate-in fade-in zoom-in-95 duration-200 left-0 sm:left-auto">
          <div className="flex items-center justify-between px-2 py-2 mb-2">
            <button onClick={handlePrev} className="p-1 hover:bg-gray-100 rounded-full text-[#1A5EDB] font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex gap-4 text-[#1A5EDB] font-bold text-base">
              <button onClick={() => setView('month')} className="hover:underline">{months[displayDate.getMonth()]}</button>
              <button onClick={() => setView('year')} className="hover:underline">{displayDate.getFullYear()}</button>
            </div>
            <button onClick={handleNext} disabled={displayDate > today} className={`p-1 rounded-full font-bold ${displayDate > today ? 'text-gray-300' : 'text-[#1A5EDB] hover:bg-gray-100'}`}>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          {view === 'day' && renderDayView()}
          {view === 'month' && renderMonthView()}
          {view === 'year' && renderYearView()}
        </div>
      )}
    </div>
  );
};


// --- MAIN PLAN DETAILS ---
const PlanDetails = () => {
  const navigate = useNavigate();

  // 1. MEMBER SELECTION STATE
  const [members, setMembers] = useState({
    self: true,
    spouse: false,
    mother: false,
    father: false,
    son: 0,
    daughter: 0
  });

  // 2. PERSONAL DETAILS STATE
  const [proposer, setProposer] = useState({
    name: '',
    pincode: '',
    phone: '' 
  });

  // 3. AGE & DOB STATE
  const [memberData, setMemberData] = useState({});

  // --- AGE CALCULATION LOGIC ---
  const calculateAgeDetails = (dobString) => {
    if (!dobString) return { display: '', value: 0, error: '' };
    
    const today = new Date();
    const birthDate = new Date(dobString);
    
    // Calculate raw difference
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    // Adjust if current month is earlier than birth month
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }

    // Adjust months if current day is earlier than birth day
    if (today.getDate() < birthDate.getDate()) {
        months--;
    }

    // Logic for Infant Validation (< 3 months)
    const totalMonths = (years * 12) + months;
    
    if (totalMonths < 3) {
        return { display: `${totalMonths} Months`, value: 0, error: 'Min. age 3 months' };
    }

    // Logic for display (< 1 year shows Months)
    if (years === 0) {
        return { display: `${months} Months`, value: 0, error: '' };
    }

    return { display: `${years} Years`, value: years, error: '' };
  };

  const handleDobChange = (memberKey, value) => {
    const { display, error } = calculateAgeDetails(value);
    setMemberData(prev => ({
      ...prev,
      [memberKey]: { dob: value, ageDisplay: display, error: error }
    }));
  };

  const toggleMember = (key) => {
    setMembers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const updateCount = (key, operation) => {
    setMembers(prev => ({
      ...prev,
      [key]: operation === 'inc' 
        ? Math.min(prev[key] + 1, 5) 
        : Math.max(prev[key] - 1, 0)
    }));
  };

  const handleNext = () => {
    // 1. Check Personal Details
    if (!proposer.name || !proposer.pincode) {
      alert("Please enter Name and Pincode.");
      return;
    }

    // 2. Check if all selected members have DOB and Valid Age
    let isValid = true;
    let missingInfo = false;

    // Helper to check a specific member key
    const checkMember = (key) => {
        const data = memberData[key];
        if (!data || !data.dob) {
            missingInfo = true;
        } else if (data.error) {
            isValid = false;
        }
    };

    Object.entries(members).forEach(([key, value]) => {
        if (key === 'son' || key === 'daughter') {
            for (let i = 0; i < value; i++) checkMember(`${key}_${i}`);
        } else if (value === true) {
            checkMember(key);
        }
    });

    if (missingInfo) {
        alert("Please enter Date of Birth for all selected members.");
        return;
    }

    if (!isValid) {
        alert("Some members are not eligible (Min. age 3 months). Please check errors.");
        return;
    }

    navigate('/select-plan', { state: { members, proposer, memberData } });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* PROGRESS HEADER */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center gap-2 text-[#1A5EDB] font-bold">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-[#1A5EDB] bg-blue-50">1</span>
            Details
          </div>
          <div className="w-16 h-1 mx-4 rounded-full bg-gray-200"></div>
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-gray-300">2</span>
            Select Plan
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Tell us about yourself</h1>
          <p className="text-slate-500 mt-2">We need a few details to calculate your premium accurately.</p>
        </div>

        {/* --- SECTION 1: PERSONAL DETAILS --- */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-[#1A5EDB] rounded-full flex items-center justify-center text-sm">1</span>
            Proposer Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                placeholder="Enter your name"
                value={proposer.name}
                onChange={(e) => setProposer({...proposer, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A5EDB] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pincode <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                maxLength="6"
                placeholder="Ex: 560001"
                value={proposer.pincode}
                onChange={(e) => setProposer({...proposer, pincode: e.target.value.replace(/\D/g,'')})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A5EDB] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number <span className="text-gray-400 font-normal">(Optional)</span></label>
              <input 
                type="tel" 
                maxLength="10"
                placeholder="9876543210"
                value={proposer.phone}
                onChange={(e) => setProposer({...proposer, phone: e.target.value.replace(/\D/g,'')})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#1A5EDB] focus:ring-4 focus:ring-blue-50 outline-none transition-all font-medium text-gray-700"
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 2: MEMBER SELECTION --- */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-[#1A5EDB] rounded-full flex items-center justify-center text-sm">2</span>
            Select Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'self', label: 'Self', icon: '👨' },
              { key: 'spouse', label: 'Spouse', icon: '👩' },
              { key: 'father', label: 'Father', icon: '👴' },
              { key: 'mother', label: 'Mother', icon: '👵' },
            ].map(m => (
              <div key={m.key} onClick={() => toggleMember(m.key)} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${members[m.key] ? 'border-[#1A5EDB] bg-blue-50 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors ${members[m.key] ? 'bg-[#1A5EDB]' : 'bg-gray-400'}`}>{m.icon}</div>
                <span className={`font-bold transition-colors ${members[m.key] ? 'text-[#1A5EDB]' : 'text-slate-700'}`}>{m.label}</span>
                {members[m.key] && <span className="ml-auto text-[#1A5EDB]">✓</span>}
              </div>
            ))}
            {[{ key: 'son', label: 'Son', icon: '👦' }, { key: 'daughter', label: 'Daughter', icon: '👧' }].map(k => (
              <div key={k.key} className={`flex items-center justify-between p-4 rounded-xl border transition ${members[k.key] > 0 ? 'border-[#1A5EDB] bg-blue-50 shadow-sm' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center transition-colors ${members[k.key] > 0 ? 'bg-[#1A5EDB]' : 'bg-gray-400'}`}>{k.icon}</div>
                   <span className={`font-bold transition-colors ${members[k.key] > 0 ? 'text-[#1A5EDB]' : 'text-slate-700'}`}>{k.label}</span>
                </div>
                <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200">
                  <button onClick={() => updateCount(k.key, 'dec')} className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:text-[#1A5EDB] hover:bg-blue-50 rounded-full transition">-</button>
                  <span className="font-bold w-4 text-center">{members[k.key]}</span>
                  <button onClick={() => updateCount(k.key, 'inc')} className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:text-[#1A5EDB] hover:bg-blue-50 rounded-full transition">+</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- SECTION 3: MEMBER AGES (DYNAMIC) --- */}
        {(Object.values(members).some(val => val === true || val > 0)) && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8 animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-blue-100 text-[#1A5EDB] rounded-full flex items-center justify-center text-sm">3</span>
              Age Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {Object.entries(members).map(([key, value]) => {
                const renderInput = (memberKey, label) => (
                  <div key={memberKey} className="flex gap-4 items-start">
                    <div className="flex-1">
                      <CustomDatePicker 
                        label={label}
                        value={memberData[memberKey]?.dob || ''}
                        onChange={(val) => handleDobChange(memberKey, val)}
                        error={memberData[memberKey]?.error}
                      />
                    </div>
                    <div className="w-28">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Age</label>
                      <input 
                        type="text" 
                        readOnly
                        placeholder="--"
                        value={memberData[memberKey]?.ageDisplay || ''}
                        className={`w-full px-2 py-3 rounded-xl border ${memberData[memberKey]?.error ? 'border-red-500 text-red-500' : 'border-gray-200 text-gray-700'} bg-gray-50 outline-none text-center font-bold transition-all text-sm`}
                      />
                    </div>
                  </div>
                );

                if (key === 'son' || key === 'daughter') {
                  return Array.from({ length: value }).map((_, i) => renderInput(`${key}_${i}`, `${key} ${i + 1}`));
                } else if (value === true) {
                  return renderInput(key, key);
                }
                return null;
              })}
            </div>
          </div>
        )}

        <button 
          onClick={handleNext}
          className="w-full py-4 bg-[#1A5EDB] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#1149AE] hover:shadow-blue-300 transition-all text-lg transform active:scale-[0.99]"
        >
          View Plans &rarr;
        </button>

      </div>
    </div>
  );
};

export default PlanDetails;