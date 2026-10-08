import React, { useState, useEffect } from "react";
import { UserResponseDto } from "@/core/dto/UserResponseDto";
import { UserUpdateRequestDto } from "@/core/dto/UserUpdateRequestDto";
import { UserRole } from "@/core/types/UserRole";
import { UserStatus } from "@/core/types/UserStatus";
import { Modal } from "@/ui/components/Modal";
import { Input } from "@/ui/components/Input";
import { Select, SelectOption } from "@/ui/components/Select";
import { Button } from "@/ui/components/Button";

const ROLE_OPTIONS: SelectOption[] = [
    { label: "Admin", value: UserRole.ADMIN },
    { label: "Manager", value: UserRole.MANAGER },
    { label: "User", value: UserRole.USER },
];

const STATUS_OPTIONS: SelectOption[] = [
    { label: "Active", value: UserStatus.ACTIVE },
    { label: "Inactive", value: UserStatus.INACTIVE },
    { label: "Suspended", value: UserStatus.SUSPEND },
];

function validateUpdateFields(name: string, role: string, status: string): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
        errors.name = "Name is required";
    }
    if (!role) {
        errors.role = "Role is required";
    }
    if (!status) {
        errors.status = "Status is required";
    }

    return errors;
}

interface UpdateUserFormFieldsProps {
    name: string;
    role: string;
    status: string;
    clientErrors: Record<string, string>;
    isSubmitting: boolean;
    onNameChange: (val: string) => void;
    onRoleChange: (val: string) => void;
    onStatusChange: (val: string) => void;
}

function UpdateUserFormFields(props: UpdateUserFormFieldsProps) {
    const name = props.name;
    const role = props.role;
    const status = props.status;
    const clientErrors = props.clientErrors;
    const isSubmitting = props.isSubmitting;
    const onNameChange = props.onNameChange;
    const onRoleChange = props.onRoleChange;
    const onStatusChange = props.onStatusChange;

    const fieldsElement = (
        <div className="form-fields">
            <Input
                name="name"
                label="Full Name"
                value={name}
                onChange={onNameChange}
                placeholder="e.g. John Doe"
                error={clientErrors.name}
                required={true}
                disabled={isSubmitting}
            />

            <Select
                name="role"
                label="Role"
                value={role}
                onChange={onRoleChange}
                options={ROLE_OPTIONS}
                error={clientErrors.role}
                required={true}
                disabled={isSubmitting}
            />

            <Select
                name="status"
                label="Status"
                value={status}
                onChange={onStatusChange}
                options={STATUS_OPTIONS}
                error={clientErrors.status}
                required={true}
                disabled={isSubmitting}
            />
        </div>
    );

    return fieldsElement;
}

interface UpdateUserFormActionsProps {
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

function UpdateUserFormActions(props: UpdateUserFormActionsProps) {
    const isSubmitting = props.isSubmitting;
    const onClose = props.onClose;
    const onSubmit = props.onSubmit;

    const actionsElement = (
        <div className="form-actions">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit} isLoading={isSubmitting}>
                Update User
            </Button>
        </div>
    );

    return actionsElement;
}

export interface UpdateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserResponseDto | null;
    onSubmit: (id: string, dto: UserUpdateRequestDto) => Promise<boolean>;
    isSubmitting: boolean;
    serverError?: string | null;
}

export function UpdateUserModal(props: UpdateUserModalProps) {
    const isOpen = props.isOpen;
    const onClose = props.onClose;
    const user = props.user;
    const onSubmit = props.onSubmit;
    const isSubmitting = props.isSubmitting;
    const serverError = props.serverError;

    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    // Pre-fill fields when user is selected
    useEffect(() => {
        if (user) {
            setName(user.name);
            setRole(user.role);
            setStatus(user.status);
            setClientErrors({});
        }
    }, [user, isOpen]);

    const handleSubmit = async () => {
        if (!user) return;

        const validationErrors = validateUpdateFields(name, role, status);
        if (Object.keys(validationErrors).length > 0) {
            setClientErrors(validationErrors);
            return;
        }

        setClientErrors({});

        const updateDto: UserUpdateRequestDto = {
            name: name.trim(),
            role: role as UserRole,
            status: status as UserStatus,
        };

        const success = await onSubmit(user.id, updateDto);
        if (success) {
            onClose();
        }
    };

    const modalElement = (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
            <div className="form-container">
                {serverError && (
                    <div className="form-server-error">{serverError}</div>
                )}

                <UpdateUserFormFields
                    name={name}
                    role={role}
                    status={status}
                    clientErrors={clientErrors}
                    isSubmitting={isSubmitting}
                    onNameChange={setName}
                    onRoleChange={setRole}
                    onStatusChange={setStatus}
                />

                <UpdateUserFormActions
                    isSubmitting={isSubmitting}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                />
            </div>
        </Modal>
    );

    return modalElement;
}
