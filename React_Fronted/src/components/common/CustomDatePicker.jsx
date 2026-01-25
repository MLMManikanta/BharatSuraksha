import React, { useEffect, useRef, useState } from 'react';
import CustomSelect from './CustomSelect';

const CustomDatePicker = ({ label, value, onChange, error, placeholder = 'DD MMM YYYY', max }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    if (value && !isNaN(new Date(value).getTime())) {
      setViewDate(new Date(value));
    }
  }, [value, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // If click was inside a portal-based dropdown (e.g. PlanSelect), ignore it
      const clickedInPortal = e?.target && e.target.closest && e.target.closest('[data-portal-dropdown]');
      if (containerRef.current && !containerRef.current.contains(e.target) && !clickedInPortal) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (day) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    const year = selected.getFullYear();
    const month = String(selected.getMonth() + 1).padStart(2, '0');
    const d = String(selected.getDate()).padStart(2, '0');
    onChange(`${year}-${month}-${d}`);
    setIsOpen(false);
  };

  const changeMonthDropdown = (monthIndex) => setViewDate(new Date(viewDate.getFullYear(), parseInt(monthIndex), 1));
  const changeYear = (year) => setViewDate(new Date(parseInt(year), viewDate.getMonth(), 1));

  const renderCalendar = () => {
    const totalDays = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const startDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const days = [];

    for (let i = 0; i < startDay; i++) days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    for (let i = 1; i <= totalDays; i++) {
      const currentDayDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), i);
      const isFuture = max && currentDayDate > new Date(max);
      const isSelected = value && new Date(value).getDate() === i && 
                        new Date(value).getMonth() === viewDate.getMonth() && 
                        new Date(value).getFullYear() === viewDate.getFullYear();
      days.push(
        <button key={i} type="button" onClick={() => !isFuture && handleDateClick(i)} disabled={isFuture}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium transition-all 
            ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'} 
            ${isFuture ? 'text-slate-300 cursor-not-allowed hover:bg-transparent' : ''}`}
        >{i}</button>
      );
    }
    return days;
  };

  const formatDisplayValue = (isoDate) => {
    if (!isoDate) return '';
    const d = new Date(isoDate);
    return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const years = [];
  for (let y = new Date().getFullYear(); y >= 1900; y--) years.push(y);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      {label && <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">{label}</label>}
      <button type="button" onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-semibold text-left flex justify-between items-center 
          ${error ? 'border-red-600 bg-red-50' : 'border-slate-300 bg-slate-50 focus:border-blue-600 focus:bg-white'}`}
      >
        <span className={!value ? 'text-slate-500' : 'text-slate-900'}>
          {value ? formatDisplayValue(value) : placeholder}
        </span>
        <span className="text-slate-400 text-lg">📅</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-auto bg-white rounded-xl shadow-2xl border border-slate-200 p-4 animate-fade-in-up left-0 overflow-hidden">
          <div className="flex justify-between items-center mb-4 gap-2">
            <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              className="h-10 w-12 flex items-center justify-center rounded-md text-blue-600 bg-white hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150"
              aria-label="Previous month"
            ><span className="text-2xl leading-none">⬅️</span></button>

            <div className="flex gap-2 items-center">
              <div className="w-48">
                <CustomSelect value={months[viewDate.getMonth()]} options={months} onChange={(m) => changeMonthDropdown(months.indexOf(m))} />
              </div>
              <div className="w-28">
                <CustomSelect value={String(viewDate.getFullYear())} options={years.map(y => String(y))} onChange={(y) => changeYear(y)} />
              </div>
            </div>
            <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              className="h-10 w-12 flex items-center justify-center rounded-md text-blue-600 bg-white hover:bg-blue-50 active:bg-blue-100 transition-colors duration-150"
              aria-label="Next month"
            ><span className="text-2xl leading-none">➡️</span></button>
          </div>
          <div className="grid grid-cols-7 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <span key={d} className="text-[10px] font-bold text-slate-400 uppercase">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1 place-items-center">{renderCalendar()}</div>
        </div>
      )}
      {error && <p className="text-red-600 text-xs font-bold mt-1">{error}</p>}
    </div>
  );
};

export default CustomDatePicker;
