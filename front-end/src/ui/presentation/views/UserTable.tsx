import React from "react";
import { UserResponseDto } from "@/core/dto/UserResponseDto";
import { UserRole } from "@/core/types/UserRole";
import { UserStatus } from "@/core/types/UserStatus";
import { Badge, BadgeVariant } from "@/ui/components/Badge";
import { Button } from "@/ui/components/Button";


function getRoleBadgeVariant(role: UserRole): BadgeVariant {
    switch (role) {
        case UserRole.ADMIN:
            return "primary";
        case UserRole.MANAGER:
            return "info";
        case UserRole.USER:
        default:
            return "default";
    }
}

function getStatusBadgeVariant(status: UserStatus): BadgeVariant {
    switch (status) {
        case UserStatus.ACTIVE:
            return "success";
        case UserStatus.INACTIVE:
            return "warning";
        case UserStatus.SUSPEND:
            return "danger";
        default:
            return "default";
    }
}

interface UserTableRowProps {
    user: UserResponseDto;
    onEdit: (user: UserResponseDto) => void;
    onDelete: (user: UserResponseDto) => void;
}

function UserTableRow(props: UserTableRowProps) {
    const user = props.user;
    const onEdit = props.onEdit;
    const onDelete = props.onDelete;
    const roleVariant = getRoleBadgeVariant(user.role);
    const statusVariant = getStatusBadgeVariant(user.status);
    const rowElement = (
        <tr>
            <td className="font-medium">{user.name}</td>
            <td className="text-muted">{user.email}</td>
            <td>
                <Badge variant={roleVariant}>{user.role}</Badge>
            </td>
            <td>
                <Badge variant={statusVariant}>{user.status}</Badge>
            </td>
            <td className="table-actions">
                <Button variant="secondary" size="small" onClick={() => onEdit(user)}>
                    Edit
                </Button>
                <Button variant="danger" size="small" onClick={() => onDelete(user)}>
                    Delete
                </Button>
            </td>
        </tr>
    );
    return rowElement;
}

export interface UserTableProps {
    users: UserResponseDto[];
    isLoading: boolean;
    onEdit: (user: UserResponseDto) => void;
    onDelete: (user: UserResponseDto) => void;
}
export function UserTable(props: UserTableProps) {
    const users = props.users;
    const isLoading = props.isLoading;
    const onEdit = props.onEdit;
    const onDelete = props.onDelete;
    if (isLoading) {
        return <div className="loading-state">Loading users...</div>;
    }
    if (users.length === 0) {
        return <div className="empty-state">No users found. Click &quot;Add User&quot; to create one!</div>;
    }
    const tableElement = (
        <div className="table-responsive">
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserTableRow
                            key={user.id}
                            user={user}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
    return tableElement;
}



