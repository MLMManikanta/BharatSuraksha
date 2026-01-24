import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { createPortal } from "react-dom";

const PlanSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Choose option",
  requiresAuth = false,
  requiresPurchase = false,
  disabledText = "Login required",
  className = "",
}) => {
  const { isAuthenticated, user } = useAuth();
  const hasPurchase = Boolean(user?.hasActivePolicy);

  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });

  const normalized = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );

  const selectedIdx = normalized.findIndex((o) => o.value === value);

  /* ---------------- POSITION CALC ---------------- */
  const calculatePosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  /* ---------------- OPEN / CLOSE ---------------- */
  const openList = () => {
    calculatePosition();
    setOpen(true);
  };

  const closeList = () => {
    setOpen(false);
    setActiveIdx(-1);
  };

  /* ---------------- OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const onDocClick = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        closeList();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  /* ---------------- SCROLL / RESIZE ---------------- */
  useEffect(() => {
    if (!open) return;
    window.addEventListener("scroll", calculatePosition, true);
    window.addEventListener("resize", calculatePosition);
    return () => {
      window.removeEventListener("scroll", calculatePosition, true);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [open]);

  /* ---------------- ACCESS CONTROL ---------------- */
  const isLocked = (opt) => {
    const needsAuth = opt.requiresAuth || requiresAuth;
    const needsPurchase = opt.requiresPurchase || requiresPurchase;
    return (needsAuth && !isAuthenticated) || (needsPurchase && !hasPurchase);
  };

  const lockReason = (opt) => {
    if ((opt.requiresAuth || requiresAuth) && !isAuthenticated)
      return disabledText;
    if ((opt.requiresPurchase || requiresPurchase) && !hasPurchase)
      return "Purchase required";
    return "";
  };

  /* ---------------- KEYBOARD ---------------- */
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) return openList();
      setActiveIdx((i) => Math.min(i + 1, normalized.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const idx = activeIdx >= 0 ? activeIdx : selectedIdx;
      const opt = normalized[idx];
      if (opt && !isLocked(opt)) {
        onChange(opt.value);
        closeList();
      }
    }
    if (e.key === "Escape") closeList();
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-500 uppercase">
          {label}
        </label>
      )}

      {/* BUTTON */}
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={handleKeyDown}
        className="
          w-full min-h-[44px]
          rounded-xl border-2 border-slate-200
          bg-white px-4 py-3
          text-sm font-semibold text-left
          flex items-center justify-between
          group
          focus:outline-none focus:ring-4 focus:ring-blue-500/10
        "
      >
        <span className={selectedIdx >= 0 ? "text-slate-800" : "text-slate-400"}>
          {selectedIdx >= 0 ? normalized[selectedIdx].label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-blue-600 transition-transform transition-colors duration-150 group-hover:text-blue-700 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* DROPDOWN */}
     {open &&
  createPortal(
    <ul
      ref={listRef}
      role="listbox"
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width: pos.width,
      }}
      className="
        z-[9999]
        max-h-64 overflow-auto
        rounded-xl border border-slate-200
        bg-white shadow-xl
        py-1
        animate-slide-up
      "
    >
      {normalized.map((opt, idx) => {
        const locked = isLocked(opt);
        const selected = opt.value === value;
        const active = idx === activeIdx;

        return (
          <li
            key={opt.value}
            role="option"
            aria-selected={selected}
            aria-disabled={locked}
            onMouseEnter={() => setActiveIdx(idx)}
            onClick={() => {
              if (!locked) {
                onChange(opt.value);
                closeList();
              }
            }}
            className={`
              px-4 py-3 text-sm
              flex items-center justify-between
              ${locked ? "text-slate-400 cursor-not-allowed" : "cursor-pointer"}
              ${selected ? "bg-blue-50 text-blue-700 font-semibold" : ""}
              ${active ? "bg-slate-50" : ""}
            `}
          >
            <span className="truncate">{opt.label}</span>
            {locked && (
              <span className="flex items-center gap-1 text-xs">
                <Lock className="w-3 h-3 text-slate-400" />
                {lockReason(opt)}
              </span>
            )}
          </li>
        );
      })}
    </ul>,
    document.body
  )}
    </div>
  );
};

export default PlanSelect;
