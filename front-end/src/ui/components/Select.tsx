import React from "react";

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectProps {
    name: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    error?: string | null;
    required?: boolean;
    disabled?: boolean;
}

export function Select(props: SelectProps) {
    const name = props.name;
    const label = props.label;
    const value = props.value;
    const onChange = props.onChange;
    const options = props.options;
    const placeholder = props.placeholder || "Select an option";
    const error = props.error || null;
    const required = props.required || false;
    const disabled = props.disabled || false;

    const selectId = `select-${name}`;
    
    const selectElement = (
        <div className="input-wrapper">
            {label && (
                <label htmlFor={selectId}>
                    {label}
                    {required && <span className="input-required-star"> *</span>}
                </label>
            )}

            <select
                id={selectId}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                required={required}
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p className="error">{error}</p>}
        </div>
    );

    return selectElement;
}
