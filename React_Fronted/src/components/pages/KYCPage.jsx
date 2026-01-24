import React, { useState, useEffect, useMemo, useRef, useId } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';
import { submitKYC } from '../../utils/api';

const KYCPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get planData from navigation state OR sessionStorage fallback
  const planData = useMemo(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      return location.state;
    }
    const stored = sessionStorage.getItem('planData');
    return stored ? JSON.parse(stored) : {};
  }, [location.state]);

  const [proposerData, setProposerData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    occupation: '',
    panCard: '',
    noPAN: false
  });

  const [membersData, setMembersData] = useState([]);
  const [addressData, setAddressData] = useState({
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [contactData, setContactData] = useState({
    email: '',
    mobileNumber: '',
    emergencyContact: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const membersRef = useRef(null);

  const scrollToMembers = () => {
    if (membersRef.current) {
      membersRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollBy(0, -80);
    }
  };
  // Initialize Members based on Plan Selection
  useEffect(() => {
    if (planData.counts) {
      const newMembers = [];
      Object.entries(planData.counts).forEach(([memberId, count]) => {
        let rawAges = planData.memberAges?.[memberId];
        
        if (!Array.isArray(rawAges)) {
          rawAges = [rawAges];
        }

        for (let i = 0; i < count; i++) {
          const ageValue = rawAges[i] || null;
          
          newMembers.push({
            memberId: memberId,
            index: i,
            name: '',
            lastName: '',
            dateOfBirth: '',
            relationship: memberId === 'self' ? 'Self' : '',
            calculatedAge: ageValue, 
            ageUnit: 'years',      
            ageInYears: ageValue,
            originalAge: ageValue,
            uniqueId: `${memberId}-${i}`
          });
        }
      });
      setMembersData(newMembers);
    }
  }, [planData]);

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      years--;
    }

    if (years < 1) {
      let totalMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
      if (dayDiff < 0) totalMonths--;
      const finalMonths = totalMonths < 0 ? 0 : totalMonths;
      return { display: finalMonths, unit: 'months', yearsRaw: 0 };
    }

    return { display: years, unit: 'years', yearsRaw: years };
  };

  // Logic to detect if DOB entered differs from Age selected in step 1
  const validateAgeChanges = useMemo(() => {
    const messages = [];
    let hasMismatch = false;

    membersData.forEach((member) => {
      if (member.dateOfBirth) {
        const currentAgeInYears = member.ageInYears !== undefined ? member.ageInYears : member.calculatedAge;
        
        if (currentAgeInYears !== null && member.originalAge !== null) {
             if (currentAgeInYears != member.originalAge) {
                hasMismatch = true;
                const memberName = member.name || (member.memberId === 'self' ? 'Proposer' : 'Member');
                messages.push(
                    `${memberName}: Age mismatch. Selected: ${member.originalAge} yrs, Actual: ${currentAgeInYears} yrs. Premium updated.`
                );
             }
        }
      }
    });

    return { hasMismatch, messages };
  }, [membersData]);


  const handleProposerChange = (field, value) => {
    if (field === 'noPAN') {
      setProposerData(prev => ({
        ...prev,
        noPAN: value,
        panCard: value ? '' : prev.panCard
      }));
    } else {
      setProposerData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    setMembersData(prev => {
      const updated = [...prev];
      if (field === 'dateOfBirth') {
        const ageDetails = calculateAge(value);
        updated[index] = {
          ...updated[index],
          [field]: value,
          calculatedAge: ageDetails ? ageDetails.display : null,
          ageUnit: ageDetails ? ageDetails.unit : '',
          ageInYears: ageDetails ? ageDetails.yearsRaw : null
        };
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
      return updated;
    });
  };

  const handleAddressChange = (field, value) => {
    setAddressData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (!proposerData.fullName.trim()) errors.proposerName = 'Full name is required';
    if (!proposerData.dateOfBirth) errors.proposerDOB = 'Date of birth is required';
    if (!proposerData.gender) errors.gender = 'Gender is required';
    if (!proposerData.maritalStatus) errors.maritalStatus = 'Marital status is required';
    if (!proposerData.occupation) errors.occupation = 'Occupation is required';
    if (!proposerData.noPAN && !proposerData.panCard) errors.panCard = 'PAN or declaration required';

    membersData.forEach((member, idx) => {
      if (!member.name.trim()) errors[`member_${idx}_name`] = 'Name required';
      if (!member.dateOfBirth) errors[`member_${idx}_dob`] = 'DOB required';
      if (member.memberId !== 'self' && !member.relationship) errors[`member_${idx}_rel`] = 'Relationship required';
    });

    if (!addressData.house.trim()) errors.house = 'House No. required';
    if (!addressData.street.trim()) errors.street = 'Street required';
    if (!addressData.city.trim()) errors.city = 'City required';
    if (!addressData.state) errors.state = 'State required';
    if (!addressData.pincode.trim()) errors.pincode = 'Pincode required';

    if (!contactData.email.trim()) errors.email = 'Email required';
    if (!contactData.mobileNumber.trim() || contactData.mobileNumber.length < 10) errors.mobile = 'Valid mobile required';
    if (!contactData.emergencyContact.trim()) errors.emergency = 'Emergency contact required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const kycData = {
      proposer: proposerData,
      members: membersData,
      address: addressData,
      contact: contactData,
      ageValidation: {
        hasMismatch: validateAgeChanges.hasMismatch,
        messages: validateAgeChanges.messages
      },
      planData: planData
    };

    try {
      // Get userId from localStorage if available (optional for new users)
      const userId = localStorage.getItem('userId');

      // Submit KYC to backend
      const response = await submitKYC({
        ...kycData,
        ...(userId && { userId })
      });

      if (response.success) {
        // Build medical page data
        const medicalPageData = {
          ...planData,
          kycData: kycData,
          kycId: response.data?.kycId,
          ageMismatchDetected: validateAgeChanges.hasMismatch
        };
        
        // Store in sessionStorage as backup
        sessionStorage.setItem('planData', JSON.stringify(medicalPageData));
        
        // Navigate to medical page with KYC data and kycId
        navigate('/medical', { state: medicalPageData });
      } else {
        setSubmitError(response.message || 'Failed to submit KYC details. Please try again.');
      }
    } catch (error) {
      console.error('KYC submission error:', error);
      setSubmitError(
        error.data?.message || 
        error.message || 
        'An error occurred while submitting KYC details. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      <CheckoutStepper currentStep={4} />

      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-700 via-indigo-600 to-blue-800 text-white pt-12 pb-24 px-4 rounded-b-[4rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-400 rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2">
            <span className="text-2xl">🆔</span>
            <span className="text-sm font-medium">Step 4 of 8</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Know Your Customer</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-light">
            Complete your profile to finalize your policy issuance.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 space-y-8 animate-slide-up">

        {/* Age Mismatch Alert (updated design) */}
        {validateAgeChanges.hasMismatch && (() => {
          const firstMsg = validateAgeChanges.messages[0] || '';
          const namePart = firstMsg.includes(':') ? firstMsg.split(':')[0] : 'Member';
          const rest = firstMsg.includes(':') ? firstMsg.split(':')[1].trim() : firstMsg;

          return (
            <div className="flex flex-col gap-4 rounded-xl border border-yellow-300 bg-yellow-50 p-5 md:flex-row md:items-center md:justify-between animate-shake">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-100">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">Age Adjustment Detected</h4>
                  <p className="mt-1 text-sm text-yellow-700 leading-relaxed">
                    <span className="font-medium">{namePart}</span>: {rest}
                  </p>
                  {validateAgeChanges.messages.slice(1).map((m, i) => (
                    <p key={i} className="mt-1 text-xs text-yellow-700">{m}</p>
                  ))}
                  <p className="mt-1 text-xs text-yellow-600">Please update member DOBs in the Members section to continue.</p>
                </div>
              </div>

              <div className="flex gap-3 md:ml-6">
                <button onClick={() => navigate('/plans')} className="rounded-lg border border-blue-500 px-5 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition">Go to Members</button>
              </div>
            </div>
          );
        })()}

        {/* 1. Proposer Details */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-xl w-10 h-10 flex items-center justify-center text-lg">👤</span>
            Proposer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" value={proposerData.fullName} onChange={(val) => handleProposerChange('fullName', val)} error={formErrors.proposerName} placeholder="As per PAN Card" />
            
            <CustomDatePicker label="Date of Birth" value={proposerData.dateOfBirth} onChange={(val) => handleProposerChange('dateOfBirth', val)} error={formErrors.proposerDOB} max={new Date().toISOString().split('T')[0]} />
            
            <CustomSelect label="Gender" value={proposerData.gender} onChange={(val) => handleProposerChange('gender', val)} error={formErrors.gender} options={['Male', 'Female', 'Other']} />
            
            <CustomSelect label="Marital Status" value={proposerData.maritalStatus} onChange={(val) => handleProposerChange('maritalStatus', val)} error={formErrors.maritalStatus} options={['Single', 'Married', 'Divorced', 'Widowed']} />
            
            <InputField label="Occupation" value={proposerData.occupation} onChange={(val) => handleProposerChange('occupation', val)} error={formErrors.occupation} placeholder="e.g. Software engineer, Business" />
            
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">PAN Card Number</label>
              <input
                type="text"
                value={proposerData.panCard}
                onChange={(e) => handleProposerChange('panCard', e.target.value.toUpperCase())}
                disabled={proposerData.noPAN}
                placeholder="ABCDE1234F"
                maxLength="10"
                className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-bold uppercase text-slate-800 placeholder-slate-300 ${proposerData.noPAN ? 'bg-slate-100 text-slate-400 border-transparent' : formErrors.panCard ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50'}`}
              />
              <div className="mt-2 flex items-center gap-2">
                <input type="checkbox" checked={proposerData.noPAN} onChange={(e) => handleProposerChange('noPAN', e.target.checked)} className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-gray-300" />
                <span className="text-xs text-slate-500 font-medium">I don't have a PAN card</span>
              </div>
              {formErrors.panCard && <p className="text-red-500 text-[10px] font-bold mt-1">{formErrors.panCard}</p>}
            </div>
          </div>
        </div>

        {/* 2. Insured Members */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-xl w-10 h-10 flex items-center justify-center text-lg">👨‍👩‍👧</span>
            Insured Members
          </h2>

          <div className="space-y-6">
  {membersData.map((member, idx) => (
    <div key={member.uniqueId} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative">
      <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest mb-4 border-b border-slate-200 pb-2">
        {member.memberId === 'self' ? 'Proposer (Self)' : `Member ${idx + 1}`}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField 
           label="First Name" 
           value={member.name} 
           onChange={(v) => handleMemberChange(idx, 'name', v)} 
           error={formErrors[`member_${idx}_name`]} 
           placeholder="First Name" 
        />
        
        {member.memberId !== 'self' && (
          <InputField 
             label="Last Name" 
             value={member.lastName} 
             onChange={(v) => handleMemberChange(idx, 'lastName', v)} 
             placeholder="Last Name" 
          />
        )}
        
        <CustomDatePicker 
          label="Date of Birth" 
          value={member.dateOfBirth} 
          onChange={(v) => handleMemberChange(idx, 'dateOfBirth', v)} 
          error={formErrors[`member_${idx}_dob`]} 
          placeholder="Select DOB"
          max={new Date().toISOString().split("T")[0]}
        />

        {member.calculatedAge !== null && (
          <div className="bg-white p-3  w-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-600 uppercase">Age: </span>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-slate-800">{member.calculatedAge}</span>
              <span className="text-sm font-semibold text-slate-600">{member.ageUnit}</span>
              {Number(member.calculatedAge) !== Number(member.originalAge) && member.originalAge !== null && (
                <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">Changed</span>
              )}
            </div>
          </div>
        )}

        {member.memberId !== 'self' && (
          <CustomSelect 
             label="Relationship" 
             value={member.relationship} 
             onChange={(v) => handleMemberChange(idx, 'relationship', v)} 
             error={formErrors[`member_${idx}_rel`]} 
             options={RELATIONSHIP_OPTIONS} 
             placeholder="Select Relationship" 
          />
        )}
      </div>
    </div>
  ))}
</div>
        </div>

        {/* 3. Address */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-xl w-10 h-10 flex items-center justify-center text-lg">🏠</span>
            Address Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField label="House / Flat / Apt" value={addressData.house} onChange={(val) => handleAddressChange('house', val)} error={formErrors.house} />
            </div>
            <div className="md:col-span-2">
              <InputField label="Street / Area" value={addressData.street} onChange={(val) => handleAddressChange('street', val)} error={formErrors.street} />
            </div>
            <InputField label="City" value={addressData.city} onChange={(val) => handleAddressChange('city', val)} error={formErrors.city} />
            <CustomSelect label="State" value={addressData.state} onChange={(val) => handleAddressChange('state', val)} error={formErrors.state} options={['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Gujarat', 'West Bengal', 'Telangana', 'Andhra Pradesh']} />
            <InputField label="Pincode" value={addressData.pincode} onChange={(val) => handleAddressChange('pincode', val)} error={formErrors.pincode} maxLength={6} />
          </div>
        </div>

        {/* 4. Contact */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-xl w-10 h-10 flex items-center justify-center text-lg">📞</span>
            Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField label="Email Address" type="email" value={contactData.email} onChange={(val) => handleContactChange('email', val)} error={formErrors.email} />
            </div>
            <InputField label="Mobile Number" type="tel" value={contactData.mobileNumber} onChange={(val) => handleContactChange('mobileNumber', val.replace(/\D/g, '').slice(0, 10))} error={formErrors.mobile} maxLength={10} />
            <InputField label="Emergency Contact" type="tel" value={contactData.emergencyContact} onChange={(val) => handleContactChange('emergencyContact', val.replace(/\D/g, '').slice(0, 10))} error={formErrors.emergency} maxLength={10} />
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pb-8 w-auto mx-auto max-w-md">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600 text-sm font-medium">{submitError}</p>
            </div>
          )}
          
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || validateAgeChanges.hasMismatch}
            className={`group w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden ${(isSubmitting || validateAgeChanges.hasMismatch) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="relative flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Continue to Medical <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </span>
          </button>
          
          <button 
            onClick={() => navigate(-1)} 
            className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors"
          >
            Go Back
          </button>
        </div>

      </div>

      <style>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 1.5s infinite; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        @keyframes slide-up { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.7s ease-out forwards; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); } 20%, 40%, 60%, 80% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};

// --- Reusable UI Components ---

const InputField = ({ label, type = "text", value, onChange, error, placeholder, maxLength, disabled, autoComplete, ...props }) => {
  const uniqueId = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={uniqueId} className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
      <input
        id={uniqueId} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        disabled={disabled} placeholder={placeholder} maxLength={maxLength} autoComplete={autoComplete}
        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-slate-900 placeholder-slate-400
          ${disabled ? 'bg-slate-100 text-slate-500' : 
            error ? 'border-red-600 bg-red-50 focus:border-red-600' : 
            'border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-600'}`}
        {...props}
      />
      {error && <p className="text-red-600 text-xs font-bold mt-1">{error}</p>}
    </div>
  );
};

const CustomSelect = ({ label, value, onChange, error, options, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => { 
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); 
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
      <button
        type="button" onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-left flex justify-between items-center
          ${error ? 'border-red-600 bg-red-50' : 'border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white'}`}
      >
        <span className={!value ? 'text-slate-500' : 'text-slate-900'}>{value || placeholder}</span>
        <span className="text-slate-400 text-xs">▼</span>
      </button>

      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto py-1 animate-fade-in-up">
                {options.map((op, i) => {
                  const optValue = typeof op === 'string' ? op : op.value;
                  const optLabel = typeof op === 'string' ? op : op.label;
                  return (
                    <li
                      key={`${i}-${optValue}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSelect(optValue)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelect(optValue);
                        }
                      }}
                      className="text-[18px] cursor-pointer px-3 py-2 hover:bg-blue-800 hover:text-white focus:bg-blue-800 focus:text-white focus:outline-none hover:rounded-lg focus:rounded-lg"
                    >
                      {optLabel}
                    </li>
                  );
                })}
        </ul>
      )}
      {error && <p className="text-red-600 text-xs font-bold mt-1">{error}</p>}
    </div>
  );
};

const RELATIONSHIP_OPTIONS = ['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister'];

const CustomDatePicker = ({ label, value, onChange, error, placeholder = 'DD MMM YYYY', max }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date()); 
  const containerRef = useRef(null);

  useEffect(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      setViewDate(new Date(value));
    }
  }, [value, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => { 
      if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false); 
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (day) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const d = String(selected.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${d}`);
    setIsOpen(false);
  };

  const changeMonthDropdown = (monthIndex) => setViewDate(new Date(viewDate.getFullYear(), parseInt(monthIndex), 1));
  const changeYear = (year) => setViewDate(new Date(parseInt(year), viewDate.getMonth(), 1));

  const renderCalendar = () => {
    const totalDays = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    for (let i = 1; i <= totalDays; i++) {
      const currentDayDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
      const isFuture = max && currentDayDate > new Date(max);
      const isSelected = value && new Date(value).getDate() === i && 
                        new Date(value).getMonth() === viewDate.getMonth() && 
                        new Date(value).getFullYear() === viewDate.getFullYear();
      days.push(
        <button key={i} type="button" onClick={() => !isFuture && handleDateClick(i)} disabled={isFuture}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium transition-all 
            ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'} 
            ${isFuture ? 'text-slate-300 cursor-not-allowed hover:bg-transparent' : ''}`}
        >{i}</button>
      );
    }
    return days;
  };

  const formatDisplayValue = (isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const years = [];
  for (let y = new Date().getFullYear(); y >= 1900; y--) years.push(y);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-left flex justify-between items-center 
          ${error ? 'border-red-600 bg-red-50' : 'border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white'}`}
      >
        <span className={!value ? 'text-slate-500' : 'text-slate-900'}>
          {value ? formatDisplayValue(value) : placeholder}
        </span>
        <span className="text-slate-400 text-lg">📅</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-fade-in-up left-0 md:left-auto">
          <div className="flex justify-between items-center mb-4 gap-2">
             <div className="w-1/2">
               <CustomSelect value={months[viewDate.getMonth()]} options={months} onChange={(m) => changeMonthDropdown(months.indexOf(m))} />
             </div>
             <div className="w-1/2">
               <CustomSelect value={String(viewDate.getFullYear())} options={years.map(y => String(y))} onChange={(y) => changeYear(y)} />
             </div>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1 place-items-center">{renderCalendar()}</div>
        </div>
      )}
      {error && <p className="text-red-600 text-xs font-bold mt-1">{error}</p>}
    </div>
  );
};

export default KYCPage;