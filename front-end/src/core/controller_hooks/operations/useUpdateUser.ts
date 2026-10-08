"use client";

import { useState } from "react";
import { UserUpdateRequestDto } from "@/core/dto/UserUpdateRequestDto";
import { userService } from "@/core/service/UserServiceImpl";

export function useUpdateUser(onSuccess?: () => void) {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const updateUser = async (id: string, dto: UserUpdateRequestDto): Promise<boolean> => {
        setIsUpdating(true);
        setUpdateError(null);
        try {
            await userService.updateUser(id, dto);
            if (onSuccess) onSuccess(); // Callback: table refresh / modal close
            return true;
        } catch (err: unknown) {
            setUpdateError(err instanceof Error ? err.message : "Failed to update user");
            return false;
        } finally {
            setIsUpdating(false);
        }
    };

    return { updateUser, isUpdating, updateError };
}
