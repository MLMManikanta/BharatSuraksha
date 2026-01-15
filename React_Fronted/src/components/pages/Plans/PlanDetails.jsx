import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutStepper from '../../layout/CheckoutStepper';

const PlanDetails = () => {
  const navigate = useNavigate();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (event) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const [memberCounts, setMemberCounts] = useState({
    self: 1,
    spouse: 0,
    son: 0,
    daughter: 0,
    father: 0,
    mother: 0,
    father_in_law: 0,
    mother_in_law: 0
  });

  const [memberAges, setMemberAges] = useState({
    self: '',
    spouse: '',
    son: [''],
    daughter: [''],
    father: '',
    mother: '',
    father_in_law: '',
    mother_in_law: ''
  });

  const [userDetails, setUserDetails] = useState({
    fullName: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

  const memberOptions = [
    { id: 'self', label: 'Self', icon: '👤', isMulti: false },
    { id: 'spouse', label: 'Spouse', icon: '👩‍❤️‍👨', isMulti: false },
    { id: 'son', label: 'Son', icon: '👦', isMulti: true },
    { id: 'daughter', label: 'Daughter', icon: '👧', isMulti: true },
    { id: 'father', label: 'Father', icon: '👴', isMulti: false },
    { id: 'mother', label: 'Mother', icon: '👵', isMulti: false },
    { id: 'father_in_law', label: 'Father-in-law', icon: '👴', isMulti: false },
    { id: 'mother_in_law', label: 'Mother-in-law', icon: '👵', isMulti: false },
  ];

  const toggleMember = (id, isMulti) => {
    setMemberCounts(prev => {
      const currentCount = prev[id];
      if (isMulti) {
        if (currentCount === 0) {
          setMemberAges(prevAges => ({
            ...prevAges,
            [id]: ['']
          }));
          return { ...prev, [id]: 1 };
        } else if (currentCount === 1) {
          setMemberAges(prevAges => ({
            ...prevAges,
            [id]: ['']
          }));
          return { ...prev, [id]: 0 };
        }
        return prev;
      }
      return { ...prev, [id]: currentCount === 1 ? 0 : 1 };
    });
    if (errors.members) setErrors(prev => ({ ...prev, members: '' }));
  };

  const updateCount = (e, id, increment) => {
    e.stopPropagation();
    setMemberCounts(prev => {
      const current = prev[id];
      
      if (increment && current >= 4) {
          alert(`You can add a maximum of 4 ${id}s.`);
          return prev;
      }

      const newCount = increment ? current + 1 : current - 1;
      
      setMemberAges(prevAges => {
        const currentAges = prevAges[id] || [];
        if (increment) {
          return { ...prevAges, [id]: [...currentAges, ''] };
        } else {
          return { ...prevAges, [id]: currentAges.slice(0, -1) };
        }
      });
      
      return { ...prev, [id]: Math.max(0, newCount) };
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'pincode' && isNaN(value)) return;
    
    setUserDetails(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAgeChange = (memberId, value, index = null) => {
    if (value && isNaN(value)) return;
    
    setMemberAges(prev => {
      if (index !== null) {
        const newAges = [...prev[memberId]];
        newAges[index] = value;
        return { ...prev, [memberId]: newAges };
      } else {
        return { ...prev, [memberId]: value };
      }
    });
    
    const errorKey = index !== null ? `${memberId}_${index}_age` : `${memberId}_age`;
    if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    const totalMembers = Object.values(memberCounts).reduce((a, b) => a + b, 0);
    if (totalMembers === 0) newErrors.members = "Please select at least one member.";

    Object.keys(memberCounts).forEach(memberId => {
      const count = memberCounts[memberId];
      if (count > 0) {
        if (Array.isArray(memberAges[memberId])) {
          memberAges[memberId].forEach((age, index) => {
            if (!age || parseInt(age) < 0 || parseInt(age) > 100) {
              newErrors[`${memberId}_${index}_age`] = "Required";
            }
          });
        } else {
          const age = memberAges[memberId];
          if (!age || parseInt(age) < 0 || parseInt(age) > 100) {
            newErrors[`${memberId}_age`] = "Required";
          }
        }
      }
    });

    if (!userDetails.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!userDetails.pincode || userDetails.pincode.length !== 6) newErrors.pincode = "Enter a valid 6-digit Pincode.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      navigate('/select-plan', { 
        state: { 
          counts: memberCounts,
          memberAges: memberAges,
          user: userDetails 
        } 
      });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main
      className="relative min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 pb-32 text-gray-900 overflow-x-hidden"
      role="main"
      aria-labelledby="page-title"
    >
      <style>{`
        .focus-ring { outline: 2px solid #1A5EDB; outline-offset: 3px; }
        .animate-fade { animation: fadeIn 0.6s ease forwards; opacity: 0; }
        .animate-rise { animation: rise 0.7s ease forwards; opacity: 0; }
        .card-glow { box-shadow: 0 20px 50px -25px rgba(26, 94, 219, 0.3); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade, .animate-rise { animation: none !important; opacity: 1 !important; transform: none !important; }
          * { scroll-behavior: auto; }
        }
        .custom-scroll::-webkit-scrollbar { width: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1A5EDB; border-radius: 999px; }
        .custom-scroll::-webkit-scrollbar-track { background: #e5e7eb; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className={`absolute -top-24 left-0 h-64 w-64 rounded-full bg-blue-100 blur-3xl opacity-50 ${prefersReducedMotion ? '' : 'animate-fade'}`}></div>
        <div className={`absolute top-24 right-0 h-72 w-72 rounded-full bg-indigo-100 blur-3xl opacity-50 ${prefersReducedMotion ? '' : 'animate-fade'}`}></div>
      </div>
      
      {/* 1. STEPPER */}
      <CheckoutStepper currentStep={1} />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 relative z-10 custom-scroll">
        
        {/* HEADER */}
        <section className={`bg-white/90 backdrop-blur rounded-3xl border border-blue-50 shadow-xl card-glow p-8 md:p-10 mb-6 mt-20 ${prefersReducedMotion ? '' : 'animate-rise'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 id="page-title" className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight ">Who would you like to insure?</h1>
              <p className="text-gray-600 mt-3 max-w-2xl">Select the family members you want to cover. Add their ages so we can tailor the plan options for you.</p>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 text-[#1A5EDB] px-4 py-3 rounded-2xl font-semibold">
              <span aria-hidden="true">🛡️</span>
              <div className="text-sm leading-tight">
                <div className="text-xs text-blue-700 uppercase font-bold tracking-wide">Progress</div>
                <div>{Object.values(memberCounts).reduce((a, b) => a + b, 0)} member(s) selected</div>
              </div>
            </div>
          </div>
          {errors.members && (
             <p className="mt-4 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" aria-live="polite">{errors.members}</p>
          )}
        </section>

        {/* 2. MEMBER SELECTION GRID */}
        <section aria-labelledby="member-selection-heading" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="member-selection-heading" className="text-xl font-bold text-slate-900">Select members to cover</h2>
              <p className="text-sm text-gray-600">Tap or press Enter/Space to add or remove.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {memberOptions.map((member) => {
              const count = memberCounts[member.id];
              const isSelected = count > 0;

              return (
                <div
                  key={member.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${member.label}${isSelected ? ' selected' : ''}`}
                  onClick={() => toggleMember(member.id, member.isMulti)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleMember(member.id, member.isMulti);
                    }
                  }}
                  className={`rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 border-2 shadow-sm relative overflow-hidden cursor-pointer
                    ${isSelected
                      ? 'border-[#1A5EDB] bg-blue-50/80 shadow-blue-100'
                      : 'border-white bg-white hover:border-gray-200 hover:shadow-md'
                    }
                    ${prefersReducedMotion ? '' : 'animate-fade'}
                    focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#1A5EDB] focus-visible:outline-offset-2
                  `}
                >
                  <div className={`text-4xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'grayscale opacity-70'}`} aria-hidden="true">
                    {member.icon}
                  </div>
                  
                  <div className="flex flex-col items-center text-center">
                    <span className={`font-bold text-sm ${isSelected ? 'text-[#1A5EDB]' : 'text-gray-700'}`}>
                      {member.label}
                    </span>
                    
                    {member.isMulti && isSelected ? (
                       <div className="flex items-center gap-3 mt-2 bg-white rounded-full px-2 py-1 shadow-sm border border-blue-100" onClick={(e) => e.stopPropagation()} role="group" aria-label={`${member.label} count controls`}>
                          <button 
                            type="button"
                            onClick={(e) => updateCount(e, member.id, false)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-blue-100 text-[#1A5EDB] font-bold hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1A5EDB] focus-visible:outline-offset-2"
                            aria-label={`Decrease ${member.label} count`}
                            aria-controls={`${member.id}-count`}
                            disabled={count <= 1}
                          >−</button>
                          <span id={`${member.id}-count`} className="text-xs font-bold text-slate-800 w-6 text-center" aria-live="polite" aria-atomic="true">{count}</span>
                          <button 
                            type="button"
                            onClick={(e) => updateCount(e, member.id, true)}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-[#1A5EDB] text-white font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                            aria-label={`Increase ${member.label} count`}
                            aria-controls={`${member.id}-count`}
                            disabled={count >= 4}
                          >+</button>
                       </div>
                    ) : isSelected && (
                      <div className="mt-2 w-6 h-6 bg-[#1A5EDB] rounded-full flex items-center justify-center" aria-hidden="true">
                         <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      </div>
                    )}
                  </div>
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#1A5EDB] via-indigo-400 to-[#1A5EDB] opacity-0 transition-opacity duration-300" aria-hidden="true"></span>
                </div>
              );
            })}
          </div>
        </section>
        {/* AGE INPUT SECTION - Only show if members are selected */}
        {Object.values(memberCounts).reduce((a, b) => a + b, 0) > 0 && (
          <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8" aria-labelledby="age-section-heading">
            <h3 id="age-section-heading" className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-[#1A5EDB] flex items-center justify-center text-sm">🎂</span>
              Member Ages <span className="text-xs font-normal text-gray-500 ml-2">Enter age for each member</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberOptions.map((member) => {
                const count = memberCounts[member.id];
                if (count === 0) return null;

                return (
                  <div key={member.id} className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span aria-hidden="true">{member.icon}</span>
                      <span>{member.label}</span>
                      {count > 1 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">×{count}</span>}
                    </label>

                    {member.isMulti ? (
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: count }).map((_, index) => (
                          <div key={index} className="space-y-1">
                            <input
                              type="number"
                              inputMode="numeric"
                              maxLength="3"
                              value={memberAges[member.id]?.[index] || ''}
                              onChange={(e) => handleAgeChange(member.id, e.target.value, index)}
                              placeholder={`${member.label} ${index + 1}'s age`}
                              aria-label={`${member.label} ${index + 1} age`}
                              aria-invalid={Boolean(errors[`${member.id}_${index}_age`])}
                              className={`w-full p-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white transition-all ${errors[`${member.id}_${index}_age`] ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1A5EDB]'}`}
                            />
                            {errors[`${member.id}_${index}_age`] && (
                              <p className="text-xs text-red-500 font-bold">{errors[`${member.id}_${index}_age`]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <input
                          type="number"
                          inputMode="numeric"
                          maxLength="3"
                          value={memberAges[member.id] || ''}
                          onChange={(e) => handleAgeChange(member.id, e.target.value)}
                          placeholder={`${member.label}'s age (in years)`}
                          aria-label={`${member.label} age`}
                          aria-invalid={Boolean(errors[`${member.id}_age`])}
                          className={`w-full p-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white transition-all ${errors[`${member.id}_age`] ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1A5EDB]'}`}
                        />
                        {errors[`${member.id}_age`] && (
                          <p className="text-xs text-red-500 font-bold">{errors[`${member.id}_age`]}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {/* 3. PERSONAL DETAILS FORM */}
        <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-24" aria-labelledby="proposer-details-heading">
            <h3 id="proposer-details-heading" className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-[#1A5EDB] flex items-center justify-center text-sm">📝</span>
                Proposer Details <span className="text-xs font-normal text-gray-500 ml-2">All fields required</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider" htmlFor="fullName">
                        Full Name <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input 
                        id="fullName"
                        type="text" 
                        name="fullName"
                        value={userDetails.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        aria-required="true"
                        aria-invalid={Boolean(errors.fullName)}
                        className={`w-full p-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white transition-all ${errors.fullName ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1A5EDB]'}`}
                    />
                    {errors.fullName && <p className="text-xs text-red-600 font-bold">{errors.fullName}</p>}
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider" htmlFor="pincode">
                        Pincode <span className="text-red-500" aria-hidden="true">*</span>
                    </label>
                    <input 
                        id="pincode"
                        type="text" 
                        name="pincode"
                        maxLength="6"
                        inputMode="numeric"
                        value={userDetails.pincode}
                        onChange={handleInputChange}
                        placeholder="e.g. 560001"
                        aria-required="true"
                        aria-invalid={Boolean(errors.pincode)}
                        className={`w-full p-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white transition-all ${errors.pincode ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1A5EDB]'}`}
                    />
                    {errors.pincode && <p className="text-xs text-red-600 font-bold">{errors.pincode}</p>}
                </div>

            </div>
        </section>

        {/* 4. BOTTOM ACTION BAR */}
        <div className={`rounded-2xl border border-blue-100 bg-white shadow-lg flex flex-col md:flex-row items-center gap-4 px-4 md:px-6 py-4 ${prefersReducedMotion ? '' : 'animate-rise'}`}>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#1A5EDB] flex items-center justify-center font-bold" aria-hidden="true">🛒</div>
            <div className="text-sm leading-tight text-slate-700">
              <div className="font-bold text-slate-900">{Object.values(memberCounts).reduce((a, b) => a + b, 0)} member(s) selected</div>
              <div className="text-gray-500">Review and continue to plan options</div>
            </div>
          </div>
          <button
            onClick={handleContinue}
            className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-[#1A5EDB] to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus-visible:focus-ring flex items-center justify-center gap-2"
            aria-label="View available plans"
          >
            View Plans
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
        </div>

      </div>
    </main>
  );
};

export default PlanDetails;