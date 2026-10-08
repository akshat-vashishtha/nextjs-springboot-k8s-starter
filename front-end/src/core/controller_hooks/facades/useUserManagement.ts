"use client";

import { useState } from "react";
import { UserResponseDto } from "@/core/dto/UserResponseDto";
import { useUsers } from "@/core/controller_hooks/operations/useUsers";
import { useCreateUser } from "@/core/controller_hooks/operations/useCreateUser";
import { useUpdateUser } from "@/core/controller_hooks/operations/useUpdateUser";
import { useDeleteUser } from "@/core/controller_hooks/operations/useDeleteUser";

export function useUserManagement() {

    // Controller Hooks
    const userController = useUsers();
    const refreshUsers = userController.refreshUsers;

    const createController = useCreateUser(refreshUsers);
    const updateController = useUpdateUser(refreshUsers);
    const deleteController = useDeleteUser(refreshUsers);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [userToEdit, setUserToEdit] = useState<UserResponseDto | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserResponseDto | null>(null);

    const table = {
        users: userController.users,
        isLoading: userController.isLoading,
        error: userController.error,
        refresh: refreshUsers,
    };

    const createModal = {
        isOpen: isCreateModalOpen,
        open: () => setIsCreateModalOpen(true),
        close: () => setIsCreateModalOpen(false),
        submit: createController.createUser,
        isSubmitting: createController.isCreating,
        serverError: createController.createError,
    };

    const updateModal = {
        isOpen: userToEdit !== null,
        user: userToEdit,
        open: (user: UserResponseDto) => setUserToEdit(user),
        close: () => setUserToEdit(null),
        submit: updateController.updateUser,
        isSubmitting: updateController.isUpdating,
        serverError: updateController.updateError,
    };

    const deleteModal = {
        isOpen: userToDelete !== null,
        user: userToDelete,
        open: (user: UserResponseDto) => setUserToDelete(user),
        close: () => setUserToDelete(null),
        confirmDelete: deleteController.deleteUser,
        isDeleting: deleteController.isDeleting,
        serverError: deleteController.deleteError,
    };

    const pageState = {
        table: table,
        createModal: createModal,
        updateModal: updateModal,
        deleteModal: deleteModal,
    };

    return pageState;
}