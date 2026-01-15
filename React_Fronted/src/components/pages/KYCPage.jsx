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
      if (dayDiff < 0) {
        totalMonths--;
      }
      const finalMonths = totalMonths < 0 ? 0 : totalMonths;
      
      return { 
        display: finalMonths, 
        unit: 'months', 
        yearsRaw: 0 
      };
    }

    return { 
      display: years, 
      unit: 'years', 
      yearsRaw: years 
    };
  };

  const validateAgeChanges = useMemo(() => {
    const messages = [];
    let hasMismatch = false;

    membersData.forEach((member) => {
      if (member.dateOfBirth) {
        const currentAgeInYears = member.ageInYears !== undefined ? member.ageInYears : member.calculatedAge;
        
        if (currentAgeInYears !== null && member.originalAge !== null) {
             if (currentAgeInYears != member.originalAge) {
                hasMismatch = true;
                messages.push(
                    `${member.name || 'Member'}: Age mismatch detected. Original: ${member.originalAge} years, Calculated: ${currentAgeInYears} years. Premium has been recalculated.`
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
      setProposerData(prev => ({
        ...prev,
        [field]: value
      }));
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
        updated[index] = {
          ...updated[index],
          [field]: value
        };
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
    if (!proposerData.noPAN && !proposerData.panCard) errors.panCard = 'PAN card or no-PAN confirmation required';

    membersData.forEach((member, idx) => {
      if (!member.name.trim()) errors[`member_${idx}_name`] = 'Member name is required';
      if (!member.dateOfBirth) errors[`member_${idx}_dob`] = 'Date of birth is required';
      if (member.memberId !== 'self' && !member.relationship) errors[`member_${idx}_rel`] = 'Relationship is required';
    });

    if (!addressData.house.trim()) errors.house = 'House/Flat number is required';
    if (!addressData.street.trim()) errors.street = 'Street/Area is required';
    if (!addressData.city.trim()) errors.city = 'City is required';
    if (!addressData.state) errors.state = 'State is required';
    if (!addressData.pincode.trim()) errors.pincode = 'Pincode is required';

    if (!contactData.email.trim()) errors.email = 'Email address is required';
    if (!contactData.mobileNumber.trim()) errors.mobile = 'Mobile number is required';
    if (!contactData.emergencyContact.trim()) errors.emergency = 'Emergency contact is required';

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
    <div className="min-h-screen bg-gray-50 pb-20 mt-8">
      <CheckoutStepper currentStep={4} />

      <div className="bg-linear-to-r from-blue-600 to-blue-700 text-white pt-10 pb-4 px-4 rounded-b-[3rem] shadow-xl relative mb-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">
            Know Your Customer (KYC)
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Complete your profile with accurate information to finalize your health insurance policy.
          </p>
        </div>
      </div>

      {validateAgeChanges.hasMismatch && planData.totalPremium && (
        <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 mb-6">
          <div className="bg-linear-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-lg shadow-md">
            <h3 className="font-bold text-green-900 flex items-center gap-2 mb-3">
              <span>✓</span> Premium Recalculated
            </h3>
            <div className="space-y-2 mb-3">
              {validateAgeChanges.messages.map((msg, idx) => (
                <p key={idx} className="text-sm text-green-800">
                  • {msg}
                </p>
              ))}
            </div>
            <div className="bg-white/60 p-4 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 font-semibold mb-2">Updated Premium Amount</p>
              <p className="text-2xl font-black text-green-700 italic">
                ₹{planData.totalPremium?.toLocaleString('en-IN') || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            Proposer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name <span className="text-red-600">*</span></label>
              <input
                type="text"
                value={proposerData.fullName}
                onChange={(e) => handleProposerChange('fullName', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.proposerName ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {formErrors.proposerName && <p className="text-red-600 text-xs mt-1">{formErrors.proposerName}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth <span className="text-red-600">*</span></label>
              <input
                type="date"
                value={proposerData.dateOfBirth}
                onChange={(e) => handleProposerChange('dateOfBirth', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.proposerDOB ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {formErrors.proposerDOB && <p className="text-red-600 text-xs mt-1">{formErrors.proposerDOB}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Gender <span className="text-red-600">*</span></label>
              <select
                value={proposerData.gender}
                onChange={(e) => handleProposerChange('gender', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.gender ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.gender && <p className="text-red-600 text-xs mt-1">{formErrors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Marital Status <span className="text-red-600">*</span></label>
              <select
                value={proposerData.maritalStatus}
                onChange={(e) => handleProposerChange('maritalStatus', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.maritalStatus ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {formErrors.maritalStatus && <p className="text-red-600 text-xs mt-1">{formErrors.maritalStatus}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Occupation <span className="text-red-600">*</span></label>
              <input
                type="text"
                value={proposerData.occupation}
                onChange={(e) => handleProposerChange('occupation', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors.occupation ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {formErrors.occupation && <p className="text-red-600 text-xs mt-1">{formErrors.occupation}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">PAN Card Number</label>
              <input
                type="text"
                value={proposerData.panCard}
                onChange={(e) => handleProposerChange('panCard', e.target.value.toUpperCase())}
                disabled={proposerData.noPAN}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${proposerData.noPAN ? 'bg-gray-100' : formErrors.panCard ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
              />
              {formErrors.panCard && <p className="text-red-600 text-xs mt-1">{formErrors.panCard}</p>}
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={proposerData.noPAN}
                  onChange={(e) => handleProposerChange('noPAN', e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700 font-medium">I don't have a PAN card</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
            Insured Members Details
          </h2>

          <div className="space-y-6">
            {membersData.map((member, idx) => (
              <div key={idx} className="border-2 border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-4">
                  {member.memberId === 'self' ? 'Proposer (Self)' : `Member ${idx + 1}`}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name <span className="text-red-600">*</span></label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`member_${idx}_name`] ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    />
                    {formErrors[`member_${idx}_name`] && <p className="text-red-600 text-xs mt-1">{formErrors[`member_${idx}_name`]}</p>}
                  </div>

                  {member.memberId !== 'self' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={member.lastName}
                        onChange={(e) => handleMemberChange(idx, 'lastName', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth <span className="text-red-600">*</span></label>
                    <input
                      type="date"
                      value={member.dateOfBirth}
                      onChange={(e) => handleMemberChange(idx, 'dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`member_${idx}_dob`] ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                    />
                    {formErrors[`member_${idx}_dob`] && <p className="text-red-600 text-xs mt-1">{formErrors[`member_${idx}_dob`]}</p>}
                  </div>

                  {member.calculatedAge !== null && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Calculated Age</label>
                      <div className="px-4 py-2.5 bg-gray-200 rounded-lg text-gray-800 font-semibold">
                        {member.calculatedAge} {member.ageUnit || 'years'}
                        {member.calculatedAge != member.originalAge && member.originalAge !== null && (
                          <span className="text-amber-600 text-xs ml-2">
                            (Original: {member.originalAge} years)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {member.memberId !== 'self' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Relationship <span className="text-red-600">*</span></label>
                      <select
                        value={member.relationship}
                        onChange={(e) => handleMemberChange(idx, 'relationship', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`member_${idx}_rel`] ? 'border-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
                      >
                        <option value="">Select Relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                      </select>
                      {formErrors[`member_${idx}_rel`] && <p className="text-red-600 text-xs mt-1">{formErrors[`member_${idx}_rel`]}</p>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
            Communication Address
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">House / Flat / Apartment <span className="text-red-600">*</span></label>
              <input type="text" value={addressData.house} onChange={e => handleAddressChange('house', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg ${formErrors.house ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.house && <p className="text-red-600 text-xs mt-1">{formErrors.house}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Street / Area / Locality <span className="text-red-600">*</span></label>
              <input type="text" value={addressData.street} onChange={e => handleAddressChange('street', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg ${formErrors.street ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.street && <p className="text-red-600 text-xs mt-1">{formErrors.street}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">City <span className="text-red-600">*</span></label>
              <input type="text" value={addressData.city} onChange={e => handleAddressChange('city', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg ${formErrors.city ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.city && <p className="text-red-600 text-xs mt-1">{formErrors.city}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">State <span className="text-red-600">*</span></label>
              <select value={addressData.state} onChange={e => handleAddressChange('state', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select State</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Delhi">Delhi</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Gujarat">Gujarat</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Telangana">Telangana</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
              </select>
              {formErrors.state && <p className="text-red-600 text-xs mt-1">{formErrors.state}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Pincode <span className="text-red-600">*</span></label>
              <input type="text" value={addressData.pincode} onChange={e => handleAddressChange('pincode', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg ${formErrors.pincode ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.pincode && <p className="text-red-600 text-xs mt-1">{formErrors.pincode}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
             <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
             Contact Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address <span className="text-red-600">*</span></label>
              <input type="email" value={contactData.email} onChange={e => handleContactChange('email', e.target.value)} className={`w-full px-4 py-2.5 border rounded-lg ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number <span className="text-red-600">*</span></label>
              <input type="tel" maxLength="10" value={contactData.mobileNumber} onChange={e => handleContactChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))} className={`w-full px-4 py-2.5 border rounded-lg ${formErrors.mobile ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.mobile && <p className="text-red-600 text-xs mt-1">{formErrors.mobile}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Emergency Contact <span className="text-red-600">*</span></label>
              <input type="tel" maxLength="10" value={contactData.emergencyContact} onChange={e => handleContactChange('emergencyContact', e.target.value.replace(/\D/g, '').slice(0, 10))} className={`w-full px-4 py-2.5 border rounded-lg ${formErrors.emergency ? 'border-red-500' : 'border-gray-300'}`} />
              {formErrors.emergency && <p className="text-red-600 text-xs mt-1">{formErrors.emergency}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>⚖️</span> Compliance & Data Accuracy
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            All details provided must match official records (Aadhar, PAN, Driving License, etc.). 
            Providing false information may lead to claim rejection. Premiums shown are indicative 
            and may change after final verification and underwriting.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <button onClick={handleSubmit} className="w-full py-5 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg">
            Continue to Medical Information →
          </button>
          <button onClick={() => navigate(-1)} className="w-full py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;