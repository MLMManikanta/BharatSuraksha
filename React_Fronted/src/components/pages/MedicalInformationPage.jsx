import React, { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';

/**
 * MEDICAL INFORMATION PAGE - RESTRUCTURED
 * ═════════════════════════════════════════════════════════════
 * 
 * NEW PATTERN:
 * 1. Height & Weight (MANDATORY AT TOP)
 * 2. Personal Medical History (Member-based with description field)
 * 3. Pre-existing Conditions (Member-based with description field)
 * 4. Lifestyle & Habits (Member-based with description field)
 * 5. Declarations
 * 
 * ═════════════════════════════════════════════════════════════
 */

const MedicalInformationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planData = location.state || {};

  // ═══ BUILD MEMBERS LIST FROM KYC DATA ═══
  const membersList = useMemo(() => {
    if (!planData.kycData || !planData.kycData.members) return [];
    
    return planData.kycData.members.map((member) => ({
      id: `${member.memberId}-${member.index}`,
      name: member.name || `${member.memberId.charAt(0).toUpperCase() + member.memberId.slice(1)} ${member.index + 1}`,
      relationship: member.relationship,
      age: member.calculatedAge
    }));
  }, [planData.kycData]);

  // ═══ STATE MANAGEMENT ═══
  const [medicalData, setMedicalData] = useState({
    // Height & Weight
    heightWeightMembers: [],
    
    // Personal Medical History
    illnessMembers: [],
    
    // Pre-existing Conditions
    conditionsMembers: [],
    
    // Lifestyle & Habits
    lifestyleMembers: [],
    
    // Declarations
    acceptDeclaration: false,
    correctnessDeclaration: false
  });

  const [formErrors, setFormErrors] = useState({});

  // ═══ GENERIC HANDLERS ═══
  const toggleMemberInSection = (section, memberId) => {
    setMedicalData(prev => ({
      ...prev,
      [section]: prev[section].some(m => m.memberId === memberId)
        ? prev[section].filter(m => m.memberId !== memberId)
        : [...prev[section], { memberId, description: '', details: {} }]
    }));
  };

  const updateMemberData = (section, memberId, field, value) => {
    setMedicalData(prev => ({
      ...prev,
      [section]: prev[section].map(m =>
        m.memberId === memberId
          ? { ...m, [field]: value }
          : m
      )
    }));
  };

  // ═══ VALIDATION ═══
  const validateForm = () => {
    const errors = {};

    // Height & Weight validation
    if (medicalData.heightWeightMembers.length === 0) {
      errors.heightWeight = 'Please select at least one member';
    } else {
      medicalData.heightWeightMembers.forEach(m => {
        if (!m.heightFeet || !m.heightInches || !m.weight) {
          errors[`hw_${m.memberId}`] = 'Height and weight required';
        }
      });
    }

    // Illness validation
    medicalData.illnessMembers.forEach(m => {
      if (!m.description.trim()) {
        errors[`ill_${m.memberId}`] = 'Description required';
      }
    });

    // Conditions validation
    medicalData.conditionsMembers.forEach(m => {
      if (!m.description.trim()) {
        errors[`cond_${m.memberId}`] = 'Description required';
      }
    });

    // Lifestyle validation
    medicalData.lifestyleMembers.forEach(m => {
      if (!m.description.trim()) {
        errors[`life_${m.memberId}`] = 'Description required';
      }
    });

    // Declarations
    if (!medicalData.acceptDeclaration) errors.acceptDeclaration = 'Required';
    if (!medicalData.correctnessDeclaration) errors.correctnessDeclaration = 'Required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ═══ SUBMIT ═══
  const handleSubmit = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    navigate('/bankinfo', {
      state: {
        ...planData,
        medicalData: {
          ...medicalData,
          submittedAt: new Date().toISOString()
        }
      }
    });
  };

  // ═══ MEMBER CARD COMPONENT ═══
  const MemberCard = ({ member, isSelected, onToggle }) => (
    <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
      isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-green-300'
    }`}>
      <input type="checkbox" checked={isSelected} onChange={onToggle} className="w-4 h-4 mt-1" />
      <div className="flex-1">
        <p className="font-bold text-gray-800">{member.name}</p>
        <p className="text-xs text-gray-600">{member.relationship} • Age: {member.age || 'N/A'}</p>
      </div>
    </label>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <CheckoutStepper currentStep={5} />

      {/* Header */}
      <div className="bg-linear-to-r from-green-600 to-green-700 text-white pt-10 pb-24 px-4 rounded-b-[3rem] shadow-xl mb-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold italic tracking-tight">Medical Information</h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto">
            Help us understand your health profile for accurate underwriting and premium assessment.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-8">
          <p className="text-sm text-blue-800 font-medium">
            ℹ️ All information provided will be kept confidential and used only for underwriting purposes.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* SECTION 1: HEIGHT & WEIGHT */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            Height & Weight Details
          </h2>
          <p className="text-sm text-gray-600 mb-6 ml-11">Please enter height and weight for each selected member</p>

          {formErrors.heightWeight && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-700">{formErrors.heightWeight}</p>
            </div>
          )}

          <p className="text-sm text-gray-600 font-semibold mb-3">Select members:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {membersList.map(member => (
              <MemberCard
                key={member.id}
                member={member}
                isSelected={medicalData.heightWeightMembers.some(m => m.memberId === member.id)}
                onToggle={() => toggleMemberInSection('heightWeightMembers', member.id)}
              />
            ))}
          </div>

          {/* Height & Weight Details for Selected Members */}
          {medicalData.heightWeightMembers.length > 0 && (
            <div className="space-y-6 pt-6 border-t-2 border-gray-200">
              {medicalData.heightWeightMembers.map(m => {
                const memberInfo = membersList.find(mb => mb.id === m.memberId);
                if (!memberInfo) return null;

                return (
                  <div key={m.memberId} className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-300">
                      <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                        {memberInfo.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{memberInfo.name}</p>
                        <p className="text-xs text-gray-600">{memberInfo.relationship}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Height - Feet */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Height (Feet) <span className="text-red-600">*</span></label>
                        <select
                          value={m.heightFeet || ''}
                          onChange={(e) => updateMemberData('heightWeightMembers', m.memberId, 'heightFeet', e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`hw_${m.memberId}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                        >
                          <option value="">Select Feet</option>
                          {[3, 4, 5, 6, 7].map(ft => (
                            <option key={ft} value={ft}>{ft} Feet</option>
                          ))}
                        </select>
                      </div>

                      {/* Height - Inches */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Height (Inches) <span className="text-red-600">*</span></label>
                        <select
                          value={m.heightInches || ''}
                          onChange={(e) => updateMemberData('heightWeightMembers', m.memberId, 'heightInches', e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`hw_${m.memberId}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                        >
                          <option value="">Select Inches</option>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(inch => (
                            <option key={inch} value={inch}>{inch} Inch</option>
                          ))}
                        </select>
                      </div>

                      {/* Weight - KG */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Weight (KG) <span className="text-red-600">*</span></label>
                        <input
                          type="number"
                          placeholder="e.g., 70"
                          value={m.weight || ''}
                          onChange={(e) => updateMemberData('heightWeightMembers', m.memberId, 'weight', e.target.value)}
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`hw_${m.memberId}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`}
                        />
                      </div>
                    </div>
                    {formErrors[`hw_${m.memberId}`] && <p className="text-red-600 text-xs mt-2">{formErrors[`hw_${m.memberId}`]}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* SECTION 2: PERSONAL MEDICAL HISTORY */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
            Personal Medical History
          </h2>
          <p className="text-sm text-gray-600 mb-6 ml-11">Any significant illness in the last 5 years?</p>

          <p className="text-sm text-gray-600 font-semibold mb-3">Select members:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {membersList.map(member => (
              <MemberCard key={member.id} member={member} isSelected={medicalData.illnessMembers.some(m => m.memberId === member.id)} onToggle={() => toggleMemberInSection('illnessMembers', member.id)} />
            ))}
          </div>

          {medicalData.illnessMembers.length > 0 && (
            <div className="space-y-4 pt-6 border-t-2 border-gray-200">
              {medicalData.illnessMembers.map(m => {
                const memberInfo = membersList.find(mb => mb.id === m.memberId);
                return (
                  <div key={m.memberId} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-bold text-gray-800 mb-3">{memberInfo?.name} ({memberInfo?.relationship})</p>
                    <textarea value={m.description} onChange={(e) => updateMemberData('illnessMembers', m.memberId, 'description', e.target.value)} placeholder="Describe any significant illnesses, treatment details, and outcomes..." rows="3" className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`ill_${m.memberId}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`} />
                    {formErrors[`ill_${m.memberId}`] && <p className="text-red-600 text-xs mt-1">{formErrors[`ill_${m.memberId}`]}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* SECTION 3: PRE-EXISTING CONDITIONS */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">3</span>
            Pre-existing Conditions
          </h2>
          <p className="text-sm text-gray-600 mb-6 ml-11">Check any conditions affecting member(s)</p>

          <p className="text-sm text-gray-600 font-semibold mb-3">Select members:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {membersList.map(member => (
              <MemberCard key={member.id} member={member} isSelected={medicalData.conditionsMembers.some(m => m.memberId === member.id)} onToggle={() => toggleMemberInSection('conditionsMembers', member.id)} />
            ))}
          </div>

          {medicalData.conditionsMembers.length > 0 && (
            <div className="space-y-4 pt-6 border-t-2 border-gray-200">
              {medicalData.conditionsMembers.map(m => {
                const memberInfo = membersList.find(mb => mb.id === m.memberId);
                return (
                  <div key={m.memberId} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-bold text-gray-800 mb-3">{memberInfo?.name} ({memberInfo?.relationship})</p>
                    <textarea value={m.description} onChange={(e) => updateMemberData('conditionsMembers', m.memberId, 'description', e.target.value)} placeholder="List pre-existing conditions: diabetes, hypertension, asthma, etc. Include diagnosis date and treatment..." rows="3" className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`cond_${m.memberId}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`} />
                    {formErrors[`cond_${m.memberId}`] && <p className="text-red-600 text-xs mt-1">{formErrors[`cond_${m.memberId}`]}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* SECTION 4: LIFESTYLE & HABITS */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">4</span>
            Lifestyle & Habits
          </h2>
          <p className="text-sm text-gray-600 mb-6 ml-11">Smoking, alcohol, exercise, diet information</p>

          <p className="text-sm text-gray-600 font-semibold mb-3">Select members:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {membersList.map(member => (
              <MemberCard key={member.id} member={member} isSelected={medicalData.lifestyleMembers.some(m => m.memberId === member.id)} onToggle={() => toggleMemberInSection('lifestyleMembers', member.id)} />
            ))}
          </div>

          {medicalData.lifestyleMembers.length > 0 && (
            <div className="space-y-4 pt-6 border-t-2 border-gray-200">
              {medicalData.lifestyleMembers.map(m => {
                const memberInfo = membersList.find(mb => mb.id === m.memberId);
                return (
                  <div key={m.memberId} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-bold text-gray-800 mb-3">{memberInfo?.name} ({memberInfo?.relationship})</p>
                    <textarea value={m.description} onChange={(e) => updateMemberData('lifestyleMembers', m.memberId, 'description', e.target.value)} placeholder="Describe lifestyle habits: Do you smoke? Alcohol consumption? How often do you exercise? Diet type?..." rows="3" className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 ${formErrors[`life_${m.memberId}`] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}`} />
                    {formErrors[`life_${m.memberId}`] && <p className="text-red-600 text-xs mt-1">{formErrors[`life_${m.memberId}`]}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* SECTION 5: DECLARATIONS */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">5</span>
            Declarations & Acknowledgments
          </h2>

          <div className="space-y-4">
            <label className="flex items-start gap-3 cursor-pointer p-4 bg-blue-50 rounded-lg border border-blue-200">
              <input type="checkbox" checked={medicalData.acceptDeclaration} onChange={(e) => setMedicalData(prev => ({ ...prev, acceptDeclaration: e.target.checked }))} className="w-4 h-4 mt-1" />
              <span className="text-sm text-blue-900">I declare that the above information is true, accurate, and complete to the best of my knowledge.</span>
            </label>
            {formErrors.acceptDeclaration && <p className="text-red-600 text-xs">{formErrors.acceptDeclaration}</p>}

            <label className="flex items-start gap-3 cursor-pointer p-4 bg-blue-50 rounded-lg border border-blue-200">
              <input type="checkbox" checked={medicalData.correctnessDeclaration} onChange={(e) => setMedicalData(prev => ({ ...prev, correctnessDeclaration: e.target.checked }))} className="w-4 h-4 mt-1" />
              <span className="text-sm text-blue-900">I understand that providing false or misleading information may result in claim rejection or policy cancellation.</span>
            </label>
            {formErrors.correctnessDeclaration && <p className="text-red-600 text-xs">{formErrors.correctnessDeclaration}</p>}
          </div>

          <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded">
            <p className="text-xs text-amber-800 font-medium">⚠️ Your responses will be reviewed by our medical underwriting team. Additional medical tests may be required.</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="max-w-2xl mx-auto mb-10 space-y-3">
          <button onClick={handleSubmit} className="w-full py-5 bg-linear-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] shadow-green-500/30">
            Proceed to Payment method →
          </button>
          <button onClick={() => navigate(-1)} className="w-full py-3 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalInformationPage;
