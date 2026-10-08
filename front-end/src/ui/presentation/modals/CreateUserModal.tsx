import React, { useState, useEffect } from "react";
import { UserCreateRequestDto } from "@/core/dto/UserCreateRequestDto";
import { UserRole } from "@/core/types/UserRole";
import { Modal } from "@/ui/components/Modal";
import { Input } from "@/ui/components/Input";
import { Select, SelectOption } from "@/ui/components/Select";
import { Button } from "@/ui/components/Button";

const ROLE_OPTIONS: SelectOption[] = [
    { label: "Admin", value: UserRole.ADMIN },
    { label: "Manager", value: UserRole.MANAGER },
    { label: "User", value: UserRole.USER },
];

function validateCreateFields(name: string, email: string, role: string): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!name.trim()) {
        errors.name = "Name is required";
    }
    if (!email.trim()) {
        errors.email = "Email is required";
    }
    if (!role) {
        errors.role = "Role is required";
    }

    return errors;
}

interface CreateUserFormFieldsProps {
    name: string;
    email: string;
    role: string;
    clientErrors: Record<string, string>;
    isSubmitting: boolean;
    onNameChange: (val: string) => void;
    onEmailChange: (val: string) => void;
    onRoleChange: (val: string) => void;
}

function CreateUserFormFields(props: CreateUserFormFieldsProps) {
    const name = props.name;
    const email = props.email;
    const role = props.role;
    const clientErrors = props.clientErrors;
    const isSubmitting = props.isSubmitting;
    const onNameChange = props.onNameChange;
    const onEmailChange = props.onEmailChange;
    const onRoleChange = props.onRoleChange;

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

            <Input
                name="email"
                label="Email Address"
                type="email"
                value={email}
                onChange={onEmailChange}
                placeholder="e.g. john@example.com"
                error={clientErrors.email}
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
        </div>
    );

    return fieldsElement;
}

interface CreateUserFormActionsProps {
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: () => void;
}

function CreateUserFormActions(props: CreateUserFormActionsProps) {
    const isSubmitting = props.isSubmitting;
    const onClose = props.onClose;
    const onSubmit = props.onSubmit;

    const actionsElement = (
        <div className="form-actions">
            <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
            </Button>
            <Button variant="primary" onClick={onSubmit} isLoading={isSubmitting}>
                Create User
            </Button>
        </div>
    );

    return actionsElement;
}

export interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (dto: UserCreateRequestDto) => Promise<boolean>;
    isSubmitting: boolean;
    serverError?: string | null;
}

export function CreateUserModal(props: CreateUserModalProps) {
    const isOpen = props.isOpen;
    const onClose = props.onClose;
    const onSubmit = props.onSubmit;
    const isSubmitting = props.isSubmitting;
    const serverError = props.serverError;

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>(UserRole.USER);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setName("");
            setEmail("");
            setRole(UserRole.USER);
            setClientErrors({});
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        const validationErrors = validateCreateFields(name, email, role);
        if (Object.keys(validationErrors).length > 0) {
            setClientErrors(validationErrors);
            return;
        }

        setClientErrors({});

        const createDto: UserCreateRequestDto = {
            name: name.trim(),
            email: email.trim(),
            role: role as UserRole,
        };

        const success = await onSubmit(createDto);
        if (success) {
            onClose();
        }
    };

    const modalElement = (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New User">
            <div className="form-container">
                {serverError && (
                    <div className="form-server-error">{serverError}</div>
                )}

                <CreateUserFormFields
                    name={name}
                    email={email}
                    role={role}
                    clientErrors={clientErrors}
                    isSubmitting={isSubmitting}
                    onNameChange={setName}
                    onEmailChange={setEmail}
                    onRoleChange={setRole}
                />

                <CreateUserFormActions
                    isSubmitting={isSubmitting}
                    onClose={onClose}
                    onSubmit={handleSubmit}
                />
            </div>
        </Modal>
    );

    return modalElement;
}
