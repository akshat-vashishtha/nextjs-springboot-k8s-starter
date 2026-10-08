import React from "react";
import { UserResponseDto } from "@/core/dto/UserResponseDto";
import { Modal } from "@/ui/components/Modal";
import { Button } from "@/ui/components/Button";

interface DeleteUserConfirmationBodyProps {
    user: UserResponseDto;
}

function DeleteUserConfirmationBody(props: DeleteUserConfirmationBodyProps) {
    const user = props.user;

    const bodyElement = (
        <div className="delete-modal-body">
            <p className="delete-warning-text">
                Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div className="delete-user-card">
                <span className="font-medium">{user.name}</span>
                <span className="text-muted">{user.email}</span>
            </div>
        </div>
    );

    return bodyElement;
}

interface DeleteUserFormActionsProps {
    isDeleting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteUserFormActions(props: DeleteUserFormActionsProps) {
    const isDeleting = props.isDeleting;
    const onClose = props.onClose;
    const onConfirm = props.onConfirm;

    const actionsElement = (
        <div className="form-actions">
            <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
                Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
                Delete User
            </Button>
        </div>
    );

    return actionsElement;
}

export interface DeleteUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserResponseDto | null;
    onConfirmDelete: (id: string) => Promise<boolean>;
    isDeleting: boolean;
    serverError?: string | null;
}

export function DeleteUserModal(props: DeleteUserModalProps) {
    const isOpen = props.isOpen;
    const onClose = props.onClose;
    const user = props.user;
    const onConfirmDelete = props.onConfirmDelete;
    const isDeleting = props.isDeleting;
    const serverError = props.serverError;

    if (!user) {
        return null;
    }

    const handleConfirm = async () => {
        const success = await onConfirmDelete(user.id);
        if (success) {
            onClose();
        }
    };

    const modalElement = (
        <Modal isOpen={isOpen} onClose={onClose} title="Delete User">
            <div className="form-container">
                {serverError && (
                    <div className="form-server-error">{serverError}</div>
                )}

                <DeleteUserConfirmationBody user={user} />

                <DeleteUserFormActions
                    isDeleting={isDeleting}
                    onClose={onClose}
                    onConfirm={handleConfirm}
                />
            </div>
        </Modal>
    );

    return modalElement;
}
