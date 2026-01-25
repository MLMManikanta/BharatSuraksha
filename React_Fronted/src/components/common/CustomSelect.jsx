import React from "react";
import PlanSelect from "./PlanSelect";

const CustomSelect = ({ label, value, onChange, options = [], placeholder = "Select...", className = "", compact = false }) => {
  const normalized = options.map((o) =>
    typeof o === "string" || typeof o === "number"
      ? { value: String(o), label: String(o) }
      : { value: String(o.value), label: o.label }
  );

  return (
    <PlanSelect
      label={label}
      value={value !== undefined && value !== null ? String(value) : ""}
      onChange={(v) => onChange(v === "" ? "" : v)}
      options={normalized}
      placeholder={placeholder}
      className={className}
      compact={compact}
    />
  );
};

export default CustomSelect;
