import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

const CheckoutStepper = ({ currentStep }) => {
  const location = useLocation();

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const containerRef = useRef(null);
  const activeStepRef = useRef(null);

  /* ---------------- STEPS ---------------- */
  const steps = [
    { id: 1, label: "Members", path: "/plans", ariaLabel: "Step 1: Select Members" },
    { id: 2, label: "Select Plan", path: "/select-plan", ariaLabel: "Step 2: Select Plan" },
    { id: 3, label: "Review", path: "/plan-review", ariaLabel: "Step 3: Review Plan" },
    { id: 4, label: "KYC", path: "/kyc", ariaLabel: "Step 4: Complete KYC" },
    { id: 5, label: "Medical", path: "/medical", ariaLabel: "Step 5: Medical Information" },
    { id: 6, label: "Frequency", path: "/payment-frequency", ariaLabel: "Step 6: Payment Frequency" },
    { id: 7, label: "Summary", path: "/order-summary", ariaLabel: "Step 7: Order Summary" },
    { id: 8, label: "Payment", path: "/payment", ariaLabel: "Step 8: Complete Payment" },
  ];

  /* ---------------- REDUCED MOTION ---------------- */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  /* ---------------- AUTO-SCROLL ACTIVE STEP (MOBILE) ---------------- */
  useEffect(() => {
    if (
      activeStepRef.current &&
      containerRef.current &&
      !prefersReducedMotion
    ) {
      activeStepRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentStep, prefersReducedMotion]);

  return (
    <>
      {/* PLACEHOLDER TO PREVENT CONTENT JUMP */}
      <div className="h-12 md:h-14 w-full" aria-hidden="true" />

      {/* FIXED STEPPER */}
      <nav
        className="
          fixed left-0 w-full
          top-[var(--header-height)]
          z-40
          bg-white/95 backdrop-blur-md
          border-b border-slate-200
          shadow-sm
          transition-[top] duration-300 ease-in-out
        "
        aria-label="Checkout progress"
        role="navigation"
      >
        {/* INTERNAL STYLES */}
        <style>{`
          @keyframes checkmark {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }

          @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(26, 94, 219, 0.4); }
            70% { box-shadow: 0 0 0 6px rgba(26, 94, 219, 0); }
            100% { box-shadow: 0 0 0 0 rgba(26, 94, 219, 0); }
          }

          .step-completed .step-icon {
            background-color: #1A5EDB;
            border-color: #1A5EDB;
            color: white;
          }

          .step-completed .check-icon {
            animation: checkmark 0.3s ease-out forwards;
          }

          .step-active .step-icon {
            background-color: white;
            border-color: #1A5EDB;
            color: #1A5EDB;
            animation: pulse-ring 2s infinite;
          }

          .step-inactive .step-icon {
            background-color: white;
            border-color: #E2E8F0;
            color: #94A3B8;
          }

          .step-connector {
            transition: background-color 0.4s ease;
          }

          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        `}</style>

        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div
            ref={containerRef}
            className="
              flex items-center
              justify-start md:justify-center
              overflow-x-auto no-scrollbar
              gap-2 md:gap-0
              snap-x snap-mandatory
            "
            role="list"
          >
            {steps.map((step, index) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isLast = index === steps.length - 1;

              return (
                <React.Fragment key={step.id}>
                  {/* STEP */}
                  <div
                    ref={isActive ? activeStepRef : null}
                    className={`
                      flex items-center gap-3 flex-shrink-0 snap-center
                      ${isCompleted ? "step-completed" : isActive ? "step-active" : "step-inactive"}
                    `}
                    role="listitem"
                    aria-current={isActive ? "step" : undefined}
                  >
                    {/* ICON */}
                    <div
                      className="
                        step-icon w-8 h-8 md:w-10 md:h-10
                        rounded-full flex items-center justify-center
                        text-xs md:text-sm font-bold
                        border-[3px] shadow-sm
                        transition-all duration-300
                      "
                      aria-label={step.ariaLabel}
                    >
                      {isCompleted ? (
                        <svg
                          className="check-icon w-4 h-4 md:w-5 md:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="3"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        step.id
                      )}
                    </div>

                    {/* LABEL */}
                    <span
                      className={`
                        text-xs md:text-sm font-bold whitespace-nowrap
                        transition-colors duration-300
                        ${
                          isActive
                            ? "text-[#1A5EDB]"
                            : isCompleted
                            ? "text-[#1A5EDB] hidden md:block opacity-80"
                            : "text-slate-400 hidden md:block"
                        }
                      `}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* CONNECTOR */}
                  {!isLast && (
                    <div
                      className={`
                        step-connector h-1 min-w-[20px] flex-grow mx-2 rounded-full
                        ${isCompleted ? "bg-[#1A5EDB]" : "bg-slate-200"}
                      `}
                      aria-hidden="true"
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

export default CheckoutStepper;
