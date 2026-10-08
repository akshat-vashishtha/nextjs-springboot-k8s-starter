import { UserRole } from "@/core/types/UserRole";
import { UserStatus } from "@/core/types/UserStatus";

export interface UserResponseDto {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}