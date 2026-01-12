import React from 'react';
import { useNavigate } from 'react-router-dom';

const CheckoutStepper = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Members', path: '/plans' },
    { id: 2, label: 'Select Plan', path: '/select-plan' },
    { id: 3, label: 'Review', path: '/plan-review' },
    { id: 4, label: 'KYC', path: '/kyc' },
    { id: 5, label: 'Medical', path: '/medical' },
    { id: 6, label: 'Bank Info', path: '/bankinfo' },
    { id: 7, label: 'Payment', path: '/payment' },
  ];

  return (
    <div className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Scrollable Container for Mobile */}
        <div className="flex items-center justify-between md:justify-center overflow-x-auto no-scrollbar gap-4 min-w-full">
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <React.Fragment key={step.id}>
                {/* STEP ITEM */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  
                  {/* Circle Indicator */}
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                      ${isCompleted 
                        ? 'bg-[#1A5EDB] border-[#1A5EDB] text-white' 
                        : isActive 
                          ? 'bg-white border-[#1A5EDB] text-[#1A5EDB]' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                    ) : (
                      step.id
                    )}
                  </div>

                  {/* Label */}
                  <span 
                    className={`text-sm font-bold whitespace-nowrap transition-colors duration-300
                      ${isActive || isCompleted ? 'text-[#1A5EDB]' : 'text-gray-400 hidden md:block'}
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                {/* CONNECTOR LINE (Don't show after last item) */}
                {index < steps.length - 1 && (
                  <div className={`h-0.5 min-w-[20px] md:w-12 lg:w-20 transition-all duration-500
                    ${isCompleted ? 'bg-[#1A5EDB]' : 'bg-gray-200'}
                  `}></div>
                )}

              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper;