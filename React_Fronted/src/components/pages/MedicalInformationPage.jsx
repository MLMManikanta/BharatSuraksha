import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CheckoutStepper from '../layout/CheckoutStepper';
import { submitMedicalInfo } from '../../utils/api';

const MedicalInformationPage = () => {
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

  const membersList = useMemo(() => {
    if (!planData.kycData || !planData.kycData.members) return [];
    
    return planData.kycData.members.map((member) => ({
      id: `${member.memberId}-${member.index}`,
      name: member.name || `${member.memberId.charAt(0).toUpperCase() + member.memberId.slice(1)} ${member.index + 1}`,
      relationship: member.relationship,
      age: member.calculatedAge
    }));
  }, [planData.kycData]);

  const [medicalData, setMedicalData] = useState({
    heightWeightMembers: [],
    illnessMembers: [],
    conditionsMembers: [],
    lifestyleMembers: [],
    acceptDeclaration: false,
    correctnessDeclaration: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (membersList.length > 0) {
      setMedicalData(prev => {
        const existingIds = new Set(prev.heightWeightMembers.map(m => m.memberId));
        const missingMembers = membersList.filter(m => !existingIds.has(m.id));
        
        if (missingMembers.length === 0) return prev;

        const newEntries = missingMembers.map(m => ({
          memberId: m.id,
          heightFeet: '',
          heightInches: '',
          weight: ''
        }));

        return {
          ...prev,
          heightWeightMembers: [...prev.heightWeightMembers, ...newEntries]
        };
      });
    }
  }, [membersList]);

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

  const validateForm = () => {
    const errors = {};

    if (medicalData.heightWeightMembers.length === 0) {
      errors.heightWeight = 'Please enter details for all members';
    } else {
      medicalData.heightWeightMembers.forEach(m => {
        if (!m.heightFeet || !m.heightInches || !m.weight) {
          errors[`hw_${m.memberId}`] = 'Height and weight required';
        }
      });
    }

    medicalData.illnessMembers.forEach(m => {
      if (!m.description.trim()) {
        errors[`ill_${m.memberId}`] = 'Description required';
      }
    });

    medicalData.conditionsMembers.forEach(m => {
      if (!m.description.trim()) {
        errors[`cond_${m.memberId}`] = 'Description required';
      }
    });

    medicalData.lifestyleMembers.forEach(m => {
      if (!m.description.trim()) {
        errors[`life_${m.memberId}`] = 'Description required';
      }
    });

    if (!medicalData.acceptDeclaration) errors.acceptDeclaration = 'Required';
    if (!medicalData.correctnessDeclaration) errors.correctnessDeclaration = 'Required';

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

    const medicalSubmitData = {
      ...medicalData,
      kycId: planData.kycId || null,
      planData: planData,
      submittedAt: new Date().toISOString()
    };

    try {
      // Get userId from localStorage if available (optional for new users)
      const userId = localStorage.getItem('userId');

      // Submit Medical Info to backend
      const response = await submitMedicalInfo({
        ...medicalSubmitData,
        ...(userId && { userId })
      });

      if (response.success) {
        // Build bank page data
        const bankPageData = {
          ...planData,
          medicalData: medicalSubmitData,
          medicalInfoId: response.data?.medicalInfoId
        };
        
        // Store in sessionStorage as backup
        sessionStorage.setItem('planData', JSON.stringify(bankPageData));
        
        // Navigate to bank info page with all data
        navigate('/bankinfo', { state: bankPageData });
      } else {
        setSubmitError(response.message || 'Failed to submit medical information. Please try again.');
      }
    } catch (error) {
      console.error('Medical info submission error:', error);
      setSubmitError(
        error.data?.message || 
        error.message || 
        'An error occurred while submitting medical information. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const MemberCard = ({ member, isSelected, onToggle }) => (
    <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
      isSelected 
        ? 'border-emerald-500 bg-emerald-50/50 shadow-md' 
        : 'border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm'
    }`}>
      <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-lg transition-colors`}>
        {isSelected ? '✅' : '⬜'}
      </div>
      <input type="checkbox" checked={isSelected} onChange={onToggle} className="hidden" />
      <div className="flex-1">
        <p className={`font-bold transition-colors ${isSelected ? 'text-emerald-900' : 'text-gray-700'}`}>{member.name}</p>
        <p className="text-xs text-gray-500">{member.relationship} • Age: {member.age || 'N/A'}</p>
      </div>
    </label>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <CheckoutStepper currentStep={5} />

      <div className="relative bg-gradient-to-br from-teal-700 via-emerald-600 to-green-800 text-white pt-12 pb-24 px-4 rounded-b-[4rem] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-400 rounded-full mix-blend-overlay blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-2">
            <span className="text-2xl">🩺</span>
            <span className="text-sm font-medium">Step 5 of 8</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Medical Information</h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto font-light">
            Help us understand your health profile for accurate underwriting.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10 space-y-8 animate-slide-up">
        
        <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl shadow-sm flex gap-3 items-start">
          <span className="text-xl mt-0.5">🔒</span>
          <p className="text-sm text-sky-800 font-medium leading-relaxed pt-1">
            All information provided will be kept strictly confidential and used only for underwriting purposes.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-emerald-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                📏
              </span>
              Height & Weight
            </h2>
            
            {formErrors.heightWeight && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-shake">
                <span className="text-red-500 text-lg">⚠️</span>
                <p className="text-sm text-red-700 font-medium">{formErrors.heightWeight}</p>
              </div>
            )}

            <div className="space-y-6">
              {membersList.map(memberInfo => {
                const m = medicalData.heightWeightMembers.find(d => d.memberId === memberInfo.id);
                if (!m) return null; 

                return (
                  <div key={memberInfo.id} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-200 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md text-sm">
                        👤
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{memberInfo.name}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{memberInfo.relationship}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="relative group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Height (Ft) <span className="text-red-400">*</span></label>
                        <input
                          type="number"
                          placeholder="e.g. 5"
                          value={m.heightFeet || ''}
                          onChange={(e) => updateMemberData('heightWeightMembers', m.memberId, 'heightFeet', e.target.value)}
                          className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${formErrors[`hw_${m.memberId}`] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'}`}
                        />
                      </div>

                      <div className="relative group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Height (In) <span className="text-red-400">*</span></label>
                        <input
                          type="number"
                          placeholder="e.g. 8"
                          value={m.heightInches || ''}
                          onChange={(e) => updateMemberData('heightWeightMembers', m.memberId, 'heightInches', e.target.value)}
                          className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${formErrors[`hw_${m.memberId}`] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'}`}
                        />
                      </div>

                      <div className="relative group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Weight (KG) <span className="text-red-400">*</span></label>
                        <input
                          type="number"
                          placeholder="e.g. 70"
                          value={m.weight || ''}
                          onChange={(e) => updateMemberData('heightWeightMembers', m.memberId, 'weight', e.target.value)}
                          className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${formErrors[`hw_${m.memberId}`] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'}`}
                        />
                      </div>
                    </div>
                    {formErrors[`hw_${m.memberId}`] && <p className="text-red-500 text-xs mt-3 flex items-center gap-1 font-medium">⚠️ {formErrors[`hw_${m.memberId}`]}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="bg-emerald-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                🏥
              </span>
              Medical History
            </h2>
            <p className="text-sm text-gray-500 mb-8 ml-14">Any significant illness in the last 5 years?</p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Select applicable members</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {membersList.map(member => (
                  <MemberCard key={member.id} member={member} isSelected={medicalData.illnessMembers.some(m => m.memberId === member.id)} onToggle={() => toggleMemberInSection('illnessMembers', member.id)} />
                ))}
              </div>

              {medicalData.illnessMembers.length > 0 && (
                <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 animate-fade-in-up">
                  {medicalData.illnessMembers.map(m => {
                    const memberInfo = membersList.find(mb => mb.id === m.memberId);
                    return (
                      <div key={m.memberId} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="text-lg">🤒</span>
                          {memberInfo?.name}
                        </p>
                        <textarea 
                          value={m.description} 
                          onChange={(e) => updateMemberData('illnessMembers', m.memberId, 'description', e.target.value)} 
                          placeholder="Describe illness, treatment details, and outcomes..." 
                          rows="3" 
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${formErrors[`ill_${m.memberId}`] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'}`} 
                        />
                        {formErrors[`ill_${m.memberId}`] && <p className="text-red-500 text-xs mt-2 font-medium">{formErrors[`ill_${m.memberId}`]}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="bg-emerald-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                🦠
              </span>
              Pre-existing Conditions
            </h2>
            <p className="text-sm text-gray-500 mb-8 ml-14">Diabetes, hypertension, asthma, etc.</p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Select applicable members</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {membersList.map(member => (
                  <MemberCard key={member.id} member={member} isSelected={medicalData.conditionsMembers.some(m => m.memberId === member.id)} onToggle={() => toggleMemberInSection('conditionsMembers', member.id)} />
                ))}
              </div>

              {medicalData.conditionsMembers.length > 0 && (
                <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 animate-fade-in-up">
                  {medicalData.conditionsMembers.map(m => {
                    const memberInfo = membersList.find(mb => mb.id === m.memberId);
                    return (
                      <div key={m.memberId} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="text-lg">🧪</span>
                          {memberInfo?.name}
                        </p>
                        <textarea 
                          value={m.description} 
                          onChange={(e) => updateMemberData('conditionsMembers', m.memberId, 'description', e.target.value)} 
                          placeholder="List conditions, diagnosis date and treatment..." 
                          rows="3" 
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${formErrors[`cond_${m.memberId}`] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'}`} 
                        />
                        {formErrors[`cond_${m.memberId}`] && <p className="text-red-500 text-xs mt-2 font-medium">{formErrors[`cond_${m.memberId}`]}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <span className="bg-emerald-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                🏃
              </span>
              Lifestyle & Habits
            </h2>
            <p className="text-sm text-gray-500 mb-8 ml-14">Smoking, alcohol, exercise, diet information</p>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Select applicable members</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {membersList.map(member => (
                  <MemberCard key={member.id} member={member} isSelected={medicalData.lifestyleMembers.some(m => m.memberId === member.id)} onToggle={() => toggleMemberInSection('lifestyleMembers', member.id)} />
                ))}
              </div>

              {medicalData.lifestyleMembers.length > 0 && (
                <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 animate-fade-in-up">
                  {medicalData.lifestyleMembers.map(m => {
                    const memberInfo = membersList.find(mb => mb.id === m.memberId);
                    return (
                      <div key={m.memberId} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                        <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <span className="text-lg">🥗</span>
                          {memberInfo?.name}
                        </p>
                        <textarea 
                          value={m.description} 
                          onChange={(e) => updateMemberData('lifestyleMembers', m.memberId, 'description', e.target.value)} 
                          placeholder="Details on smoking, alcohol, exercise frequency..." 
                          rows="3" 
                          className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:bg-white transition-all ${formErrors[`life_${m.memberId}`] ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-100'}`} 
                        />
                        {formErrors[`life_${m.memberId}`] && <p className="text-red-500 text-xs mt-2 font-medium">{formErrors[`life_${m.memberId}`]}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-emerald-100 rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-sm">
                ✍️
              </span>
              Declarations
            </h2>

            <div className="space-y-4">
              <label className={`flex items-start gap-4 cursor-pointer p-5 rounded-xl border transition-all ${medicalData.acceptDeclaration ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
                <div className="relative flex items-center">
                   <span className="text-xl">{medicalData.acceptDeclaration ? '☑️' : '⬜'}</span>
                   <input type="checkbox" checked={medicalData.acceptDeclaration} onChange={(e) => setMedicalData(prev => ({ ...prev, acceptDeclaration: e.target.checked }))} className="hidden" />
                </div>
                <span className="text-sm text-gray-700 leading-relaxed mt-1">I declare that the above information is true, accurate, and complete to the best of my knowledge.</span>
              </label>
              {formErrors.acceptDeclaration && <p className="text-red-500 text-xs ml-2 font-medium">{formErrors.acceptDeclaration}</p>}

              <label className={`flex items-start gap-4 cursor-pointer p-5 rounded-xl border transition-all ${medicalData.correctnessDeclaration ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-white'}`}>
                <div className="relative flex items-center">
                  <span className="text-xl">{medicalData.correctnessDeclaration ? '☑️' : '⬜'}</span>
                  <input type="checkbox" checked={medicalData.correctnessDeclaration} onChange={(e) => setMedicalData(prev => ({ ...prev, correctnessDeclaration: e.target.checked }))} className="hidden" />
                </div>
                <span className="text-sm text-gray-700 leading-relaxed mt-1">I understand that providing false or misleading information may result in claim rejection or policy cancellation.</span>
              </label>
              {formErrors.correctnessDeclaration && <p className="text-red-500 text-xs ml-2 font-medium">{formErrors.correctnessDeclaration}</p>}
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 items-start">
               <span className="text-xl mt-0.5">⚠️</span>
               <p className="text-xs text-amber-800 font-medium leading-relaxed pt-1">Your responses will be reviewed by our medical underwriting team. Additional medical tests may be required based on the disclosures.</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 pb-8">
          {submitError && (
            <div className="md:col-span-2 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-red-600 text-sm font-medium">{submitError}</p>
            </div>
          )}
          <button onClick={() => navigate(-1)} className="group flex items-center justify-center gap-2 py-4 px-6 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm hover:shadow-md order-2 md:order-1">
            ⬅️ Go Back
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className={`group relative flex items-center justify-center gap-2 py-4 px-6 bg-emerald-600 text-white rounded-xl font-bold overflow-hidden shadow-lg shadow-emerald-500/30 transition-all hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] order-1 md:order-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <span>Proceed to Payment</span>
                ➡️
              </>
            )}
          </button>
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

export default MedicalInformationPage;