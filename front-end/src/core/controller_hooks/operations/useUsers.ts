"use client";

import { UserResponseDto } from "@/core/dto/UserResponseDto";
import { useState, useEffect, useCallback } from "react";
import { userService} from "@/core/service/UserServiceImpl"

export function useUsers() {
    const [users, setUsers] = useState<UserResponseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const usersData = await userService.getAllUsers();
            setUsers(usersData);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to load users";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }

    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {users, isLoading, error, refreshUsers: fetchUsers};
}