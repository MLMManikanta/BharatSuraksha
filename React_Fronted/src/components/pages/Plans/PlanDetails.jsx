import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutStepper from '../../layout/CheckoutStepper';

const PlanDetails = () => {
  const navigate = useNavigate();

  // --- 1. MEMBER SELECTION STATE ---
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

  // --- 1B. MEMBER AGES STATE ---
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

  // --- 2. PERSONAL DETAILS STATE ---
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    pincode: ''
  });

  // --- 3. ERROR STATE ---
  const [errors, setErrors] = useState({});

  // Member Options Configuration
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

  // --- HANDLERS ---

  const toggleMember = (id, isMulti) => {
    setMemberCounts(prev => {
      const currentCount = prev[id];
      if (isMulti) {
        // For multi-members: only toggle between 0 and 1 when clicking the card
        // If count > 1, clicking card does nothing (use +/- buttons to change count)
        if (currentCount === 0) {
          // Select: set to 1 and initialize age array
          setMemberAges(prevAges => ({
            ...prevAges,
            [id]: ['']
          }));
          return { ...prev, [id]: 1 };
        } else if (currentCount === 1) {
          // Unselect: set to 0 and clear age array
          setMemberAges(prevAges => ({
            ...prevAges,
            [id]: ['']
          }));
          return { ...prev, [id]: 0 };
        }
        // If count > 1, do nothing on card click
        return prev;
      }
      return { ...prev, [id]: currentCount === 1 ? 0 : 1 };
    });
    // Clear member error if selected
    if (errors.members) setErrors(prev => ({ ...prev, members: '' }));
  };

  const updateCount = (e, id, increment) => {
    e.stopPropagation();
    setMemberCounts(prev => {
      const current = prev[id];
      
      // LIMIT CHECK: Max 4 Children allowed
      if (increment && current >= 4) {
          alert(`You can add a maximum of 4 ${id}s.`);
          return prev;
      }

      const newCount = increment ? current + 1 : current - 1;
      
      // Update ages array for multi-members
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
    // Allow only numbers for pincode
    if (name === 'pincode' && isNaN(value)) return;
    
    setUserDetails(prev => ({ ...prev, [name]: value }));
    // Clear specific field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleAgeChange = (memberId, value, index = null) => {
    // Allow only numbers
    if (value && isNaN(value)) return;
    
    setMemberAges(prev => {
      if (index !== null) {
        // For multi-members (son/daughter)
        const newAges = [...prev[memberId]];
        newAges[index] = value;
        return { ...prev, [memberId]: newAges };
      } else {
        // For single members
        return { ...prev, [memberId]: value };
      }
    });
    
    // Clear age error for this member
    const errorKey = index !== null ? `${memberId}_${index}_age` : `${memberId}_age`;
    if (errors[errorKey]) setErrors(prev => ({ ...prev, [errorKey]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Check Members
    const totalMembers = Object.values(memberCounts).reduce((a, b) => a + b, 0);
    if (totalMembers === 0) newErrors.members = "Please select at least one member.";

    // Check Member Ages
    Object.keys(memberCounts).forEach(memberId => {
      const count = memberCounts[memberId];
      if (count > 0) {
        if (Array.isArray(memberAges[memberId])) {
          // Multi-members (son/daughter)
          memberAges[memberId].forEach((age, index) => {
            if (!age || parseInt(age) < 0 || parseInt(age) > 100) {
              newErrors[`${memberId}_${index}_age`] = "Required";
            }
          });
        } else {
          // Single members
          const age = memberAges[memberId];
          if (!age || parseInt(age) < 0 || parseInt(age) > 100) {
            newErrors[`${memberId}_age`] = "Required";
          }
        }
      }
    });

    // Check Fields
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
        // Scroll to top if errors exist
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      
      {/* 1. STEPPER */}
      <CheckoutStepper currentStep={1} />

      <div className="max-w-4xl mx-auto px-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Who would you like to insure?</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Select the family members you want to cover.
          </p>
          {errors.members && (
             <p className="text-red-500 font-bold mt-2 animate-pulse">{errors.members}</p>
          )}
        </div>

        {/* 2. MEMBER SELECTION GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {memberOptions.map((member) => {
            const count = memberCounts[member.id];
            const isSelected = count > 0;

            return (
              <div
                key={member.id}
                onClick={() => toggleMember(member.id, member.isMulti)}
                className={`cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all duration-300 border-2 shadow-sm relative overflow-hidden
                  ${isSelected 
                    ? 'border-[#1A5EDB] bg-blue-50/60 shadow-blue-100 scale-[1.02]' 
                    : 'border-white bg-white hover:border-gray-200 hover:shadow-md'
                  }
                `}
              >
                <div className={`text-4xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'grayscale opacity-70'}`}>
                  {member.icon}
                </div>
                
                <div className="flex flex-col items-center">
                  <span className={`font-bold text-sm ${isSelected ? 'text-[#1A5EDB]' : 'text-gray-600'}`}>
                    {member.label}
                  </span>
                  
                  {/* Counter Controls for Multiple (Son/Daughter) */}
                  {member.isMulti && isSelected ? (
                     <div className="flex items-center gap-3 mt-2 bg-white rounded-full px-2 py-1 shadow-sm border border-blue-100" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={(e) => updateCount(e, member.id, false)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-[#1A5EDB] font-bold hover:bg-blue-200 disabled:opacity-50"
                          disabled={count <= 1}
                        >-</button>
                        <span className="text-xs font-bold text-slate-800 w-3 text-center">{count}</span>
                        <button 
                          onClick={(e) => updateCount(e, member.id, true)}
                          className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1A5EDB] text-white font-bold hover:bg-blue-700 disabled:opacity-50"
                          disabled={count >= 4}
                        >+</button>
                     </div>
                  ) : isSelected && (
                    <div className="mt-2 w-5 h-5 bg-[#1A5EDB] rounded-full flex items-center justify-center">
                       <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* AGE INPUT SECTION - Only show if members are selected */}
        {Object.values(memberCounts).reduce((a, b) => a + b, 0) > 0 && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-[#1A5EDB] flex items-center justify-center text-sm">🎂</span>
              Member Ages <span className="text-xs font-normal text-gray-400 ml-2">(Enter age for each member)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memberOptions.map((member) => {
                const count = memberCounts[member.id];
                if (count === 0) return null;

                return (
                  <div key={member.id} className="space-y-3">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span>{member.icon}</span>
                      <span>{member.label}</span>
                      {count > 1 && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">×{count}</span>}
                    </label>

                    {member.isMulti ? (
                      // Multiple age inputs for son/daughter
                      <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: count }).map((_, index) => (
                          <div key={index} className="space-y-1">
                            <input
                              type="text"
                              maxLength="3"
                              value={memberAges[member.id]?.[index] || ''}
                              onChange={(e) => handleAgeChange(member.id, e.target.value, index)}
                              placeholder={`${member.label} ${index + 1}'s age`}
                              className={`w-full p-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white transition-all ${errors[`${member.id}_${index}_age`] ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1A5EDB]'}`}
                            />
                            {errors[`${member.id}_${index}_age`] && (
                              <p className="text-xs text-red-500 font-bold">{errors[`${member.id}_${index}_age`]}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      // Single age input
                      <div className="space-y-1">
                        <input
                          type="text"
                          maxLength="3"
                          value={memberAges[member.id] || ''}
                          onChange={(e) => handleAgeChange(member.id, e.target.value)}
                          placeholder={`${member.label}'s age (in years)`}
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
          </div>
        )}
        {/* 3. PERSONAL DETAILS FORM */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-24">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-[#1A5EDB] flex items-center justify-center text-sm">📝</span>
                Proposer Details <span className="text-xs font-normal text-gray-400 ml-2">(All fields required)</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        name="fullName"
                        value={userDetails.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={`w-full p-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white transition-all ${errors.fullName ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1A5EDB]'}`}
                    />
                    {errors.fullName && <p className="text-xs text-red-500 font-bold">{errors.fullName}</p>}
                </div>

                {/* Pincode Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Pincode <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        name="pincode"
                        maxLength="6"
                        value={userDetails.pincode}
                        onChange={handleInputChange}
                        placeholder="e.g. 560001"
                        className={`w-full p-3 bg-gray-50 border rounded-xl font-medium text-slate-800 focus:outline-none focus:bg-white transition-all ${errors.pincode ? 'border-red-500 focus:border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#1A5EDB]'}`}
                    />
                    {errors.pincode && <p className="text-xs text-red-500 font-bold">{errors.pincode}</p>}
                </div>

            </div>
        </div>

        {/* 4. BOTTOM ACTION BAR */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 md:static md:bg-transparent md:border-0 md:p-0 z-40">
           <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="hidden md:block text-sm text-gray-500">
                 <strong className="text-slate-800">
                    {Object.values(memberCounts).reduce((a, b) => a + b, 0)} Members
                 </strong> selected
              </div>

              <button 
                onClick={handleContinue}
                className="w-full md:w-auto px-12 py-4 bg-[#1A5EDB] text-white font-bold rounded-xl shadow-lg hover:bg-[#1149AE] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
              >
                View Plans
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default PlanDetails;