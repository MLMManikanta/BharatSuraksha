import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

const KYCPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planData = location.state || {};

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
            originalAge: ageValue
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

  const handleSubmit = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const kycData = {
      proposer: proposerData,
      members: membersData,
      address: addressData,
      contact: contactData,
      ageValidation: {
        hasMismatch: validateAgeChanges.hasMismatch,
        messages: validateAgeChanges.messages
      }
    };

    navigate('/medical', {
      state: {
        ...planData,
        kycData: kycData,
        ageMismatchDetected: validateAgeChanges.hasMismatch
      }
    });
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
          <div className="inline-flex items-center justify-center text-4xl p-4 bg-white/20 backdrop-blur-md rounded-full mb-4 ring-1 ring-white/30 shadow-lg">
            🆔
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Know Your Customer</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto font-light">
            Complete your profile to finalize your policy issuance.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 space-y-8 animate-slide-up">

        {/* Age Mismatch Alert */}
        {validateAgeChanges.hasMismatch && (
          <div className="bg-white rounded-2xl shadow-xl border-l-4 border-amber-500 overflow-hidden animate-shake">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-2 rounded-full text-xl">⚠️</div>
                <div className="flex-1">
                  <h3 className="font-bold text-amber-800 text-sm uppercase tracking-wide mb-2">Age Adjustment Detected</h3>
                  <div className="space-y-1">
                    {validateAgeChanges.messages.map((msg, idx) => (
                      <p key={idx} className="text-xs text-slate-600 font-medium bg-amber-50 p-2 rounded border border-amber-100">
                        {msg}
                      </p>
                    ))}
                  </div>
                  {planData.totalPremium && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-bold uppercase">New Premium:</span>
                      <span className="text-lg font-black text-blue-600">₹{planData.totalPremium.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. Proposer Details */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 rounded-xl w-10 h-10 flex items-center justify-center text-lg">👤</span>
            Proposer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Full Name" value={proposerData.fullName} onChange={(val) => handleProposerChange('fullName', val)} error={formErrors.proposerName} placeholder="As per PAN Card" />
            
            <InputField label="Date of Birth" type="date" value={proposerData.dateOfBirth} onChange={(val) => handleProposerChange('dateOfBirth', val)} error={formErrors.proposerDOB} />
            
            <SelectField label="Gender" value={proposerData.gender} onChange={(val) => handleProposerChange('gender', val)} error={formErrors.gender} options={['Male', 'Female', 'Other']} />
            
            <SelectField label="Marital Status" value={proposerData.maritalStatus} onChange={(val) => handleProposerChange('maritalStatus', val)} error={formErrors.maritalStatus} options={['Single', 'Married', 'Divorced', 'Widowed']} />
            
            <InputField label="Occupation" value={proposerData.occupation} onChange={(val) => handleProposerChange('occupation', val)} error={formErrors.occupation} placeholder="e.g. Salaried, Business" />
            
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
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative group hover:border-blue-300 transition-all">
                <div className="absolute top-4 right-4 text-3xl opacity-10 group-hover:opacity-20 transition-opacity">
                  {member.relationship === 'Self' ? '' : ''}
                </div>
                <h3 className="font-black text-slate-700 uppercase text-xs tracking-widest mb-4 border-b border-slate-200 pb-2">
                  {member.memberId === 'self' ? 'Proposer (Self)' : `Member ${idx + 1}`}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="First Name" value={member.name} onChange={(val) => handleMemberChange(idx, 'name', val)} error={formErrors[`member_${idx}_name`]} />
                  
                  {member.memberId !== 'self' && (
                    <InputField label="Last Name" value={member.lastName} onChange={(val) => handleMemberChange(idx, 'lastName', val)} />
                  )}

                  <InputField label="Date of Birth" type="date" value={member.dateOfBirth} onChange={(val) => handleMemberChange(idx, 'dateOfBirth', val)} error={formErrors[`member_${idx}_dob`]} />

                  {/* Auto Calculated Age Display */}
                  {member.calculatedAge !== null && (
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Age Check</label>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-slate-800">{member.calculatedAge} {member.ageUnit}</span>
                        {member.calculatedAge != member.originalAge && member.originalAge !== null && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">
                            Changed (Was {member.originalAge})
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {member.memberId !== 'self' && (
                    <SelectField label="Relationship" value={member.relationship} onChange={(val) => handleMemberChange(idx, 'relationship', val)} error={formErrors[`member_${idx}_rel`]} options={['Spouse', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister']} />
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
            <SelectField label="State" value={addressData.state} onChange={(val) => handleAddressChange('state', val)} error={formErrors.state} options={['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Uttar Pradesh', 'Rajasthan', 'Gujarat', 'West Bengal', 'Telangana', 'Andhra Pradesh']} />
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
        <div className="space-y-4 pb-8">
          <button 
            onClick={handleSubmit} 
            className="group w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-black uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="relative flex items-center justify-center gap-3">
              Continue to Medical <span className="group-hover:translate-x-1 transition-transform">→</span>
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

const InputField = ({ label, type = "text", value, onChange, error, placeholder, maxLength, disabled }) => (
  <div className="space-y-1">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-slate-800 placeholder-slate-300 ${disabled ? 'bg-slate-100 text-slate-400' : error ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50'}`}
    />
    {error && <p className="text-red-500 text-[10px] font-bold mt-1 animate-pulse">{error}</p>}
  </div>
);

const SelectField = ({ label, value, onChange, error, options }) => (
  <div className="space-y-1">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-slate-800 appearance-none ${error ? 'border-red-300 bg-red-50 focus:border-red-500' : 'border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50'}`}
      >
        <option value="">Select...</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold mt-1 animate-pulse">{error}</p>}
  </div>
);

export default KYCPage;