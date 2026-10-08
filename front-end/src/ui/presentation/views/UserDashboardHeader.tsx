import React from "react";
import { Button } from "@/ui/components/Button";

export interface UserDashboardHeaderProps {
    onAddUser: () => void;
}

export function UserDashboardHeader(props: UserDashboardHeaderProps) {
    const onAddUser = props.onAddUser;

    const headerElement = (
        <header className="app-header">
            <div className="app-title-group">
                <h1 className="app-title">User Management</h1>
                <p className="app-subtitle">
                    View, create, update, and manage system users with strict type safety.
                </p>
            </div>
            <Button variant="primary" onClick={onAddUser}>
                + Add New User
            </Button>
        </header>
    );

    return headerElement;
}
