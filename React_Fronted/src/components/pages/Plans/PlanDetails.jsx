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
    { id: 'self', label: 'Self', icon: '👤', isMulti: false, minAge: 18 },
    { id: 'spouse', label: 'Spouse', icon: '👩‍❤️‍👨', isMulti: false, minAge: 18 },
    { id: 'son', label: 'Son', icon: '👦', isMulti: true, minAge: 0 },
    { id: 'daughter', label: 'Daughter', icon: '👧', isMulti: true, minAge: 0 },
    { id: 'father', label: 'Father', icon: '👴', isMulti: false, minAge: 35 },
    { id: 'mother', label: 'Mother', icon: '👵', isMulti: false, minAge: 35 },
    { id: 'father_in_law', label: 'Father-in-law', icon: '👴', isMulti: false, minAge: 35 },
    { id: 'mother_in_law', label: 'Mother-in-law', icon: '👵', isMulti: false, minAge: 35 },
  ];

  const toggleMember = (id, isMulti) => {
    setMemberCounts(prev => {
      const currentCount = prev[id];
      if (isMulti) {
        if (currentCount === 0) {
          setMemberAges(prevAges => ({ ...prevAges, [id]: [''] }));
          return { ...prev, [id]: 1 };
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
    if (value && !/^\d*$/.test(value)) return;

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

    memberOptions.forEach(option => {
      const count = memberCounts[option.id];
      if (count > 0) {
        const ages = Array.isArray(memberAges[option.id]) 
          ? memberAges[option.id] 
          : [memberAges[option.id]];
        
        ages.slice(0, count).forEach((age, idx) => {
          const errorKey = option.isMulti ? `${option.id}_${idx}_age` : `${option.id}_age`;
          const ageNum = parseInt(age);

          if (!age) {
            newErrors[errorKey] = "Required";
          } else if (ageNum < 0 || ageNum > 100) {
            newErrors[errorKey] = "Invalid";
          } else if (option.minAge && ageNum < option.minAge) {
            newErrors[errorKey] = `Min ${option.minAge}`;
          }
        });
      }
    });

    if (!userDetails.fullName.trim()) newErrors.fullName = "Full Name is required.";
    if (!userDetails.pincode || userDetails.pincode.length !== 6) newErrors.pincode = "Enter 6-digit Pincode.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ============================
     ✅ FIXED NORMALIZATION LOGIC
     ============================ */
  const handleContinue = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const normalizedAges = { ...memberAges };

    memberOptions.forEach(option => {
      if (option.isMulti) {
        const count = memberCounts[option.id] || 0;
        const ages = Array.isArray(memberAges[option.id])
          ? memberAges[option.id]
          : [];

        // ✅ CRITICAL FIX: Ensure array length exactly matches count
        normalizedAges[option.id] = Array.from(
          { length: count },
          (_, i) => ages[i] ?? ''
        );
      }
    });

    navigate('/select-plan', {
      state: {
        counts: memberCounts,
        memberAges: normalizedAges,
        user: userDetails
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <CheckoutStepper currentStep={1} />

      <div className="relative bg-gradient-to-br from-indigo-700 via-blue-600 to-blue-800 text-white pt-12 pb-24 px-4 rounded-b-[4rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-sm font-medium">Step 1 of 8</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Who would you like to insure?</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-light">
            Select family members and add their ages to get the best plan.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-8 animate-slide-up">
        
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-blue-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                👥
              </span>
              Select Members
            </h2>
            
            {errors.members && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
                <span className="text-red-500 text-lg">⚠️</span>
                <p className="text-sm text-red-700 font-medium">{errors.members}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {memberOptions.map((member) => {
                const count = memberCounts[member.id];
                const isSelected = count > 0;

                return (
                  <div
                    key={member.id}
                    onClick={() => toggleMember(member.id, member.isMulti)}
                    className={`relative rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-200 border-2 cursor-pointer group ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/50 shadow-md'
                        : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-sm'
                    }`}
                  >
                    <div className={`text-4xl transition-transform duration-200 ${isSelected ? 'scale-110' : 'opacity-70 group-hover:opacity-100'}`}>
                      {member.icon}
                    </div>
                    
                    <span className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                      {member.label}
                    </span>
                    
                    {member.isMulti && isSelected ? (
                        <div className="flex items-center gap-2 mt-1 bg-white rounded-full px-1.5 py-1 shadow-sm border border-blue-100" onClick={(e) => e.stopPropagation()}>
                          <button 
                            type="button"
                            onClick={(e) => updateCount(e, member.id, false)}
                            disabled={count <= 1}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold hover:bg-blue-100 disabled:opacity-30 disabled:hover:bg-blue-50 transition-colors"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold text-gray-800 w-4 text-center">{count}</span>
                          <button 
                            type="button"
                            onClick={(e) => updateCount(e, member.id, true)}
                            disabled={count >= 4}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            +
                          </button>
                        </div>
                    ) : isSelected && (
                      <div className="mt-1 text-blue-500 text-lg">
                        ✅
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {Object.values(memberCounts).reduce((a, b) => a + b, 0) > 0 && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 animate-fade-in-up">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <span className="bg-blue-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                  🎂
                </span>
                Member Ages
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memberOptions.map((member) => {
                  const count = memberCounts[member.id];
                  if (count === 0) return null;

                  return (
                    <div key={member.id} className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200">
                      <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-3">
                        <span className="text-xl">{member.icon}</span>
                        <span>{member.label}</span>
                        {count > 1 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">×{count}</span>}
                      </label>

                      {member.isMulti ? (
                        <div className="grid grid-cols-2 gap-3">
                          {Array.from({ length: count }).map((_, index) => (
                            <div key={index}>
                              <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength="3"
                                value={memberAges[member.id]?.[index] || ''}
                                onChange={(e) => handleAgeChange(member.id, e.target.value, index)}
                                placeholder={`Age ${index + 1}`}
                                className={`w-full px-3 py-2 bg-white border rounded-xl font-medium text-center focus:outline-none focus:ring-2 transition-all ${errors[`${member.id}_${index}_age`] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
                              />
                              {errors[`${member.id}_${index}_age`] && (
                                <p className="text-red-500 text-[10px] mt-1 font-bold text-center">{errors[`${member.id}_${index}_age`]}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>
                          <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength="3"
                            value={memberAges[member.id] || ''}
                            onChange={(e) => handleAgeChange(member.id, e.target.value)}
                            placeholder="Age (Years)"
                            className={`w-full px-4 py-2 bg-white border rounded-xl font-medium focus:outline-none focus:ring-2 transition-all ${errors[`${member.id}_age`] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
                          />
                          {errors[`${member.id}_age`] && (
                            <p className="text-red-500 text-xs mt-1 font-bold ml-1">{errors[`${member.id}_age`]}</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-blue-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                📝
              </span>
              Proposer Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="fullName">
                      Full Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                      id="fullName"
                      type="text" 
                      name="fullName"
                      value={userDetails.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white focus:ring-2 transition-all ${errors.fullName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 font-bold">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider" htmlFor="pincode">
                      Pincode <span className="text-red-500">*</span>
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
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white focus:ring-2 transition-all ${errors.pincode ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`}
                  />
                  {errors.pincode && <p className="text-xs text-red-500 font-bold">{errors.pincode}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="pb-8">
            <div className={`rounded-2xl border border-blue-100 bg-white shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 ${prefersReducedMotion ? '' : 'animate-rise'}`}>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-2xl flex items-center justify-center">
                  🛒
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-lg">{Object.values(memberCounts).reduce((a, b) => a + b, 0)} member(s) selected</div>
                  <div className="text-sm text-gray-500">Ready to view plans</div>
                </div>
              </div>

              <button
                onClick={handleContinue}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                <span>View Plans</span>
                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
        </div>

      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        @keyframes rise {
           from { opacity: 0; transform: translateY(20px); }
           to { opacity: 1; transform: translateY(0); }
        }
        .animate-rise {
           animation: rise 0.7s ease forwards;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}</style>
    </div>
  );
};

export default PlanDetails;