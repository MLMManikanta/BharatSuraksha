import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutStepper = ({ currentStep }) => {
  const location = useLocation();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef(null);
  const activeStepRef = useRef(null);

  const isPlanDetailsPage = location.pathname === '/plans';
  const topOffsetClass = isPlanDetailsPage ? 'top-[5.5rem]' : 'top-[6rem]';

  const steps = [
    { id: 1, label: 'Members', path: '/plans', ariaLabel: 'Step 1: Select Members' },
    { id: 2, label: 'Select Plan', path: '/select-plan', ariaLabel: 'Step 2: Select Plan' },
    { id: 3, label: 'Review', path: '/plan-review', ariaLabel: 'Step 3: Review Plan' },
    { id: 4, label: 'KYC', path: '/kyc', ariaLabel: 'Step 4: Complete KYC' },
    { id: 5, label: 'Medical', path: '/medical', ariaLabel: 'Step 5: Medical Information' },
    { id: 6, label: 'Pay & Bank', path: '/bankinfo', ariaLabel: 'Step 6: Payment and Bank Information' },
    { id: 7, label: 'Summary', path: '/order-summary', ariaLabel: 'Step 7: Order Summary' },
    { id: 8, label: 'Payment', path: '/payment', ariaLabel: 'Step 8: Complete Payment' },
  ];

  // Check for reduced motion preference (WCAG 2.2)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Auto-scroll active step into view on mobile
  useEffect(() => {
    if (activeStepRef.current && containerRef.current && !prefersReducedMotion) {
      activeStepRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentStep, prefersReducedMotion]);

  return (
    <nav 
      className={`w-full bg-white border-b border-gray-200 fixed left-0 ${topOffsetClass} z-40 shadow-sm`}
      aria-label="Checkout progress"
      role="navigation"
    >
      <style>{`
        /* Enhanced stepper animations with reduced motion support */
        @media (prefers-reduced-motion: no-preference) {
          .step-indicator {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .step-connector {
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .step-label {
            transition: all 0.3s ease-out;
          }

          .step-completed .step-indicator {
            animation: checkmark 0.4s ease-out;
          }

          @keyframes checkmark {
            0%, 50% {
              transform: scale(0.8);
            }
            75% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          .step-active .step-indicator {
            animation: pulse 2s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(26, 94, 219, 0.4);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(26, 94, 219, 0);
            }
          }
        }

        /* Hide scrollbar for cleaner look */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Enhanced focus visible for keyboard navigation */
        .step-focus:focus-visible {
          outline: 4px solid #1A5EDB;
          outline-offset: 4px;
          border-radius: 50%;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 py-3">
        <div 
          ref={containerRef}
          className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 md:gap-4 w-full pb-2"
          role="list"
          aria-label="Checkout progress steps"
        >
          {steps.map((step, index) => {
            const isCompleted = step.id < currentStep;
            const isActive = step.id === currentStep;

            return (
              <React.Fragment key={step.id}>
                {/* STEP ITEM */}
                <div 
                  ref={isActive ? activeStepRef : null}
                  className={`flex items-center gap-2 flex-shrink-0 ${
                    isCompleted ? 'step-completed' : ''
                  } ${isActive ? 'step-active' : ''}`}
                  role="listitem"
                  aria-current={isActive ? 'step' : undefined}
                >
                  
                  {/* Circle Indicator */}
                  <div 
                    className={`step-indicator w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      prefersReducedMotion ? "" : "step-indicator"
                    } ${
                      isCompleted 
                        ? 'bg-[#1A5EDB] border-[#1A5EDB] border-3 text-white shadow-lg' 
                        : isActive 
                          ? 'bg-white border-[#1A5EDB] text-[#1A5EDB] border-[3px] shadow-md' 
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                    aria-label={step.ariaLabel}
                    aria-current={isActive ? 'step' : undefined}
                    aria-describedby={isActive ? `step-${step.id}-label` : undefined}
                    role="img"
                  >
                    {isCompleted ? (
                      <svg 
                        className="w-5 h-5 md:w-6 md:h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      <span aria-hidden="true">{step.id}</span>
                    )}
                  </div>

                  <span 
                    id={`step-${step.id}-label`}
                    className={`step-label text-sm md:text-base font-bold whitespace-nowrap ${
                      isActive || isCompleted 
                        ? 'text-[#1A5EDB]' 
                        : 'text-gray-400 hidden md:block'
                    } ${
                      isActive ? 'md:text-lg' : ''
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* CONNECTOR LINE (Don't show after last item) */}
                {index < steps.length - 1 && (
                  <div 
                    className={`step-connector h-1 min-w-[24px] md:w-16 lg:w-24 rounded-full ${
                      isCompleted ? 'bg-[#1A5EDB]' : 'bg-gray-200'
                    }`}
                    role="presentation"
                    aria-hidden="true"
                  />
                )}

              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Progress Indicator */}
        <div className="md:hidden mt-4 text-center">
          <span className="text-sm font-semibold text-gray-600">
            Step <span className="text-[#1A5EDB] text-base">{currentStep}</span> of {steps.length}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default CheckoutStepper;