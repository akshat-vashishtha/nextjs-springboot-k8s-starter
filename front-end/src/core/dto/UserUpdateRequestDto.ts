import { UserRole } from "@/core/types/UserRole";
import { UserStatus } from "@/core/types/UserStatus";

export interface UserUpdateRequestDto {
    name: string;
    role: UserRole;
    status: UserStatus;
}