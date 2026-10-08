"use client";

import { useState } from "react";
import { userService } from "@/core/service/UserServiceImpl";

export function useDeleteUser(onSuccess?: () => void) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const deleteUser = async (id: string): Promise<boolean> => {
        setIsDeleting(true);
        setDeleteError(null);
        try {
            await userService.deleteUser(id);
            if (onSuccess) onSuccess(); // Table refresh
            return true;
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : "Failed to delete user");
            return false;
        } finally {
            setIsDeleting(false);
        }
    };

    return { deleteUser, isDeleting, deleteError };
}
