import React from "react";
import PlanSelect from "./PlanSelect";

const CustomSelect = ({ label, value, onChange, options = [], placeholder = "Select...", className = "" }) => {
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
    />
  );
};

export default CustomSelect;
