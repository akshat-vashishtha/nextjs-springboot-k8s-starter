import React from "react";
import { UserDashboardHeader } from "@/ui/presentation/views/UserDashboardHeader";
import { UserTable } from "@/ui/presentation/views/UserTable";
import { CreateUserModal } from "@/ui/presentation/modals/CreateUserModal";
import { UpdateUserModal } from "@/ui/presentation/modals/UpdateUserModal";
import { DeleteUserModal } from "@/ui/presentation/modals/DeleteUserModal";
import { Button } from "@/ui/components/Button";
import { useUserManagement } from "@/core/controller_hooks/facades/useUserManagement";

export interface UserDashboardViewProps {
    state: ReturnType<typeof useUserManagement>;
}

export function UserDashboardView(props: UserDashboardViewProps) {
    const state = props.state;
    const table = state.table;
    const createModal = state.createModal;
    const updateModal = state.updateModal;
    const deleteModal = state.deleteModal;

    const viewElement = (
        <main className="app-container">
            {/* Header View */}
            <UserDashboardHeader onAddUser={createModal.open} />

            {/* Error Banner (if any) */}
            {table.error && (
                <div className="app-error-banner">
                    <span>{table.error}</span>
                    <Button variant="secondary" size="small" onClick={table.refresh}>
                        Retry
                    </Button>
                </div>
            )}

            {/* User Data Table View */}
            <UserTable
                users={table.users}
                isLoading={table.isLoading}
                onEdit={updateModal.open}
                onDelete={deleteModal.open}
            />

            {/* Create Modal Dialog */}
            <CreateUserModal
                isOpen={createModal.isOpen}
                onClose={createModal.close}
                onSubmit={createModal.submit}
                isSubmitting={createModal.isSubmitting}
                serverError={createModal.serverError}
            />

            {/* Edit Modal Dialog */}
            <UpdateUserModal
                isOpen={updateModal.isOpen}
                onClose={updateModal.close}
                user={updateModal.user}
                onSubmit={updateModal.submit}
                isSubmitting={updateModal.isSubmitting}
                serverError={updateModal.serverError}
            />

            {/* Delete Confirmation Modal Dialog */}
            <DeleteUserModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.close}
                user={deleteModal.user}
                onConfirmDelete={deleteModal.confirmDelete}
                isDeleting={deleteModal.isDeleting}
                serverError={deleteModal.serverError}
            />
        </main>
    );

    return viewElement;
}
