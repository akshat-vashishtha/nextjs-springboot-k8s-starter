import React from "react";

export type BadgeVariant = "primary" | "success" | "warning" | "danger" | "info" | "default";

export interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
}

export function Badge(props: BadgeProps) {
    const children = props.children;
    const variant = props.variant || "default";

    const badgeClass = `badge badge-${variant}`;

    const badgeElement = (
        <span className={badgeClass}>
            {children}
        </span>
    );

    return badgeElement;
}