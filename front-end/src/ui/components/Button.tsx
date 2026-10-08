import React from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    className?: string;
    isLoading?: boolean;
}

export function Button(props: ButtonProps) {
    const children = props.children;
    const onClick = props.onClick;
    const variant = props.variant || "primary";
    const size = props.size || "medium";
    const disabled = props.disabled || false;
    const className = props.className || "";
    const isLoading = props.isLoading || false;

    const isButtonDisabled = disabled || isLoading;
    const buttonClass = `button button-${variant} button-${size} ${className}`.trim();

    const buttonElement = (
        <button className={buttonClass} onClick={onClick} disabled={isButtonDisabled}>
            {isLoading ? "Loading..." : children}
        </button>
    );

    return buttonElement;
}