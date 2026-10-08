import React from "react";

export interface InputProps {
    name: string;
    label?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: "text" | "email" | "password";
    error?: string | null;
    required?: boolean;
    disabled?: boolean;   
}

export function Input(props: InputProps) {
    const name = props.name;
    const label = props.label;
    const value = props.value;
    const onChange = props.onChange;
    const placeholder = props.placeholder || "";
    const type = props.type || "text";
    const error = props.error || null;
    const required = props.required || false;
    const disabled = props.disabled || false;

    const inputId = `input-${name}`;

    const inputElement = (
        <div className="input-wrapper">
            {label && (
                <label htmlFor={inputId}>
                    {label}
                    {required && <span className="input-required-star"> *</span>}
                </label>
            )}
            <input
                id={inputId}
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
            />
            {error && <p className="error">{error}</p>}
        </div>
    );

    return inputElement;
}
