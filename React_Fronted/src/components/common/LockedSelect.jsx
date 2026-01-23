import React from 'react';
import { useAuth } from '../../context/AuthContext';

const LockedSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  requiresAuth = false,
  requiresPurchase = false,
  disabledText = 'Login to enable',
  className = '',
}) => {
  const { isAuthenticated, user } = useAuth();
  const hasPurchase = Boolean(user?.hasActivePolicy);

  const renderOption = (opt) => {
    // support string or object options
    const o = typeof opt === 'string' ? { value: opt, label: opt } : opt;
    const needsAuth = Boolean(o.requiresAuth || requiresAuth);
    const needsPurchase = Boolean(o.requiresPurchase || requiresPurchase);
    const locked = (needsAuth && !isAuthenticated) || (needsPurchase && !hasPurchase);
    const title = locked ? (needsAuth && !isAuthenticated ? disabledText : 'Purchase required') : undefined;

    return (
      <option key={o.value} value={o.value} disabled={locked} title={title}>
        {o.label}
      </option>
    );
  };

  return (
    <div className="space-y-1">
      {label && <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-slate-800 appearance-none ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(renderOption)}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">▼</div>
      </div>
    </div>
  );
};

export default LockedSelect;
