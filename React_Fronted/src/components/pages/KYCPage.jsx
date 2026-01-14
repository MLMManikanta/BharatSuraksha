import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

/**
 * KYC (KNOW YOUR CUSTOMER) PAGE
 * ═════════════════════════════════════════════════════════════
 * 
 * Purpose: Collect detailed customer information before policy issuance
 * 
 * Sections:
 * 1. Proposer Details (Full Name, DOB, Gender, Marital Status, Occupation, PAN)
 * 2. Insured Members Details (Name, DOB, Relationship for each member)
 * 3. Communication Address (Full address details)
 * 4. Contact Details (Email, Mobile, Emergency Contact)
 * 
 * Validation Logic:
 * - Age calculated from DOB and validated against PlanDetails
 * - Premium recalculated if age mismatch detected
 * - Eligibility checked (e.g., Varishtha 60+ only)
 * - Real-time error messages and warnings
 * 
 * ═════════════════════════════════════════════════════════════
 */

const KYCPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planData = location.state || {};

  // ═══ STATE MANAGEMENT ═══
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

  const [ageValidation, setAgeValidation] = useState({
    isValid: true,
    messages: [],
    premiumUpdated: false
  });

  const [formErrors, setFormErrors] = useState({});

  // Initialize members array based on planData
  useEffect(() => {
    if (planData.counts) {
      const newMembers = [];
      Object.entries(planData.counts).forEach(([memberId, count]) => {
        const baseAge = planData.memberAges?.[memberId] || [];
        for (let i = 0; i < count; i++) {
          newMembers.push({
            memberId: memberId,
            index: i,
            name: '',
            lastName: '',
            dateOfBirth: '',
            relationship: memberId === 'self' ? 'Self' : '',
            calculatedAge: baseAge[i] || null,
            originalAge: baseAge[i] || null
          });
        }
      });
      setMembersData(newMembers);
    }
  }, [planData]);

  // ═══ AGE CALCULATION & VALIDATION ═══
  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : null;
  };

  // ═══ VALIDATE AGE AGAINST ORIGINAL ═══
  const validateAgeChanges = useMemo(() => {
    const messages = [];
    let hasMismatch = false;

    membersData.forEach((member) => {
      if (member.dateOfBirth) {
        const calculatedAge = calculateAge(member.dateOfBirth);
        if (calculatedAge !== null && member.originalAge !== null && calculatedAge !== member.originalAge) {
          hasMismatch = true;
          messages.push(
            `${member.name || 'Member'}: Age mismatch detected. Original: ${member.originalAge} years, Calculated: ${calculatedAge} years. Premium has been recalculated.`
          );
        }
      }
    });

    return { hasMismatch, messages };
  }, [membersData]);

  // ═══ HANDLER: PROPOSER DETAILS ═══
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

  // ═══ HANDLER: MEMBER DETAILS ═══
  const handleMemberChange = (index, field, value) => {
    setMembersData(prev => {
      const updated = [...prev];
      if (field === 'dateOfBirth') {
        const calculatedAge = calculateAge(value);
        updated[index] = {
          ...updated[index],
          [field]: value,
          calculatedAge: calculatedAge
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

  // ═══ HANDLER: ADDRESS ═══
  const handleAddressChange = (field, value) => {
    setAddressData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ═══ HANDLER: CONTACT ═══
  const handleContactChange = (field, value) => {
    setContactData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ═══ VALIDATION ═══
  const validateForm = () => {
    const errors = {};

    // Proposer validation
    if (!proposerData.fullName.trim()) errors.proposerName = 'Full name is required';
    if (!proposerData.dateOfBirth) errors.proposerDOB = 'Date of birth is required';
    if (!proposerData.gender) errors.gender = 'Gender is required';
    if (!proposerData.maritalStatus) errors.maritalStatus = 'Marital status is required';
    if (!proposerData.occupation) errors.occupation = 'Occupation is required';
    if (!proposerData.noPAN && !proposerData.panCard) errors.panCard = 'PAN card or no-PAN confirmation required';

    // Members validation
    membersData.forEach((member, idx) => {
      if (!member.name.trim()) errors[`member_${idx}_name`] = 'Member name is required';
      if (!member.dateOfBirth) errors[`member_${idx}_dob`] = 'Date of birth is required';
      if (member.memberId !== 'self' && !member.relationship) errors[`member_${idx}_rel`] = 'Relationship is required';
    });

    // Address validation
    if (!addressData.house.trim()) errors.house = 'House/Flat number is required';
    if (!addressData.street.trim()) errors.street = 'Street/Area is required';
    if (!addressData.city.trim()) errors.city = 'City is required';
    if (!addressData.state) errors.state = 'State is required';
    if (!addressData.pincode.trim()) errors.pincode = 'Pincode is required';

    // Contact validation
    if (!contactData.email.trim()) errors.email = 'Email address is required';
    if (contactData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactData.email)) errors.email = 'Invalid email format';
    if (!contactData.mobileNumber.trim()) errors.mobile = 'Mobile number is required';
    if (contactData.mobileNumber && !/^\d{10}$/.test(contactData.mobileNumber)) errors.mobile = 'Mobile must be 10 digits';
    if (!contactData.emergencyContact.trim()) errors.emergency = 'Emergency contact is required';
    if (contactData.emergencyContact && !/^\d{10}$/.test(contactData.emergencyContact)) errors.emergency = 'Contact must be 10 digits';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ═══ SUBMIT HANDLER ═══
  const handleSubmit = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Prepare complete KYC data
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

    // Navigate to medical information page
    navigate('/medical', {
      state: {
        ...planData,
        kycData: kycData,
        ageMismatchDetected: validateAgeChanges.hasMismatch
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={4} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl relative mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">
            Know Your Customer (KYC)
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Complete your profile with accurate information to finalize your health insurance policy.
          </p>
        </div>
      </div>

      {/* Premium Recalculation Message */}
      {validateAgeChanges.hasMismatch && planData.totalPremium && (
        <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10 mb-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-5 rounded-lg shadow-md">
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
              <p className="text-xs text-green-600 mt-2">
                This updated amount will be reflected in the Payment Summary.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4">
        {/* SECTION 1: PROPOSER DETAILS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            Proposer Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={proposerData.fullName}
                onChange={(e) => handleProposerChange('fullName', e.target.value)}
                placeholder="As per ID card"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.proposerName
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.proposerName && <p className="text-red-600 text-xs mt-1">{formErrors.proposerName}</p>}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Date of Birth (DD/MM/YYYY) <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={proposerData.dateOfBirth}
                onChange={(e) => handleProposerChange('dateOfBirth', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.proposerDOB
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.proposerDOB && <p className="text-red-600 text-xs mt-1">{formErrors.proposerDOB}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Gender <span className="text-red-600">*</span>
              </label>
              <select
                value={proposerData.gender}
                onChange={(e) => handleProposerChange('gender', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.gender
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {formErrors.gender && <p className="text-red-600 text-xs mt-1">{formErrors.gender}</p>}
            </div>

            {/* Marital Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Marital Status <span className="text-red-600">*</span>
              </label>
              <select
                value={proposerData.maritalStatus}
                onChange={(e) => handleProposerChange('maritalStatus', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.maritalStatus
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {formErrors.maritalStatus && <p className="text-red-600 text-xs mt-1">{formErrors.maritalStatus}</p>}
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Occupation <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={proposerData.occupation}
                onChange={(e) => handleProposerChange('occupation', e.target.value)}
                placeholder="e.g., Software Engineer, Doctor, etc."
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.occupation
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.occupation && <p className="text-red-600 text-xs mt-1">{formErrors.occupation}</p>}
            </div>

            {/* PAN Card */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">PAN Card Number</label>
              <input
                type="text"
                value={proposerData.panCard}
                onChange={(e) => handleProposerChange('panCard', e.target.value.toUpperCase())}
                placeholder="e.g., ABCDE1234F"
                disabled={proposerData.noPAN}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  proposerData.noPAN
                    ? 'bg-gray-100 text-gray-500'
                    : formErrors.panCard
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.panCard && <p className="text-red-600 text-xs mt-1">{formErrors.panCard}</p>}
            </div>

            {/* No PAN Checkbox */}
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

          {proposerData.noPAN && (
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-sm text-blue-800">
                ℹ️ A PAN card is not mandatory for health insurance. You can proceed with your Aadhar or other ID proof.
              </p>
            </div>
          )}
        </div>

        {/* SECTION 2: INSURED MEMBERS DETAILS */}
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
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      First Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => handleMemberChange(idx, 'name', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors[`member_${idx}_name`]
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {formErrors[`member_${idx}_name`] && (
                      <p className="text-red-600 text-xs mt-1">{formErrors[`member_${idx}_name`]}</p>
                    )}
                  </div>

                  {/* Last Name (if not self) */}
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

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Date of Birth (DD/MM/YYYY) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="date"
                      value={member.dateOfBirth}
                      onChange={(e) => handleMemberChange(idx, 'dateOfBirth', e.target.value)}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                        formErrors[`member_${idx}_dob`]
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:ring-blue-500'
                      }`}
                    />
                    {formErrors[`member_${idx}_dob`] && (
                      <p className="text-red-600 text-xs mt-1">{formErrors[`member_${idx}_dob`]}</p>
                    )}
                  </div>

                  {/* Calculated Age */}
                  {member.calculatedAge !== null && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Calculated Age</label>
                      <div className="px-4 py-2.5 bg-gray-200 rounded-lg text-gray-800 font-semibold">
                        {member.calculatedAge} years
                        {member.calculatedAge !== member.originalAge && (
                          <span className="text-amber-600 text-xs ml-2">(was {member.originalAge})</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Relationship */}
                  {member.memberId !== 'self' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Relationship <span className="text-red-600">*</span>
                      </label>
                      <select
                        value={member.relationship}
                        onChange={(e) => handleMemberChange(idx, 'relationship', e.target.value)}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                          formErrors[`member_${idx}_rel`]
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 focus:ring-blue-500'
                        }`}
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
                      {formErrors[`member_${idx}_rel`] && (
                        <p className="text-red-600 text-xs mt-1">{formErrors[`member_${idx}_rel`]}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: COMMUNICATION ADDRESS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
            Communication Address
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* House */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                House / Flat / Apartment <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={addressData.house}
                onChange={(e) => handleAddressChange('house', e.target.value)}
                placeholder="e.g., 123, ABC Tower"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.house
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.house && <p className="text-red-600 text-xs mt-1">{formErrors.house}</p>}
            </div>

            {/* Street */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Street / Area / Locality <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={addressData.street}
                onChange={(e) => handleAddressChange('street', e.target.value)}
                placeholder="e.g., Main Road, Sector 5"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.street
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.street && <p className="text-red-600 text-xs mt-1">{formErrors.street}</p>}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                City <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={addressData.city}
                onChange={(e) => handleAddressChange('city', e.target.value)}
                placeholder="e.g., Mumbai"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.city
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.city && <p className="text-red-600 text-xs mt-1">{formErrors.city}</p>}
            </div>

            {/* State */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                State <span className="text-red-600">*</span>
              </label>
              <select
                value={addressData.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.state
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              >
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
                {/* Add more states as needed */}
              </select>
              {formErrors.state && <p className="text-red-600 text-xs mt-1">{formErrors.state}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Pincode <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={addressData.pincode}
                onChange={(e) => handleAddressChange('pincode', e.target.value)}
                placeholder="e.g., 400001"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.pincode
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.pincode && <p className="text-red-600 text-xs mt-1">{formErrors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 4: CONTACT DETAILS */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
            Contact Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address (for digital policy copy) <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={contactData.email}
                onChange={(e) => handleContactChange('email', e.target.value)}
                placeholder="e.g., yourname@email.com"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.email
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.email && <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                value={contactData.mobileNumber}
                onChange={(e) => handleContactChange('mobileNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                maxLength="10"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.mobile
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.mobile && <p className="text-red-600 text-xs mt-1">{formErrors.mobile}</p>}
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Emergency Contact Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                value={contactData.emergencyContact}
                onChange={(e) => handleContactChange('emergencyContact', e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="10-digit number"
                maxLength="10"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${
                  formErrors.emergency
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {formErrors.emergency && <p className="text-red-600 text-xs mt-1">{formErrors.emergency}</p>}
            </div>
          </div>

          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
            <p className="text-sm text-blue-800">
              ℹ️ The emergency contact number can belong to your nominee or any trusted person.
            </p>
          </div>
        </div>

        {/* COMPLIANCE DISCLAIMER */}
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

        {/* ACTION BUTTONS */}
        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <button
            onClick={handleSubmit}
            className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-blue-500/30"
          >
            Continue to Medical Information →
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;
