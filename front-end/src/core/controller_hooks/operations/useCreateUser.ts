"use client";

import { useState } from "react";
import { UserCreateRequestDto } from "@/core/dto/UserCreateRequestDto";
import { userService } from "@/core/service/UserServiceImpl";

export function useCreateUser(onSuccess?: () => void) {

    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const createUser = async (dto: UserCreateRequestDto): Promise<boolean> => {

        setIsCreating(true);
        setCreateError(null);

        try {
            const userResponseDto = await userService.createUser(dto);
            if (onSuccess) onSuccess(); // Callback to refresh table or close modal
            return true;
        } catch (err) {
            setCreateError( err instanceof Error ? err.message : "Failed to create users");
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    return {createUser, isCreating, createError};

}
