import {UserRole} from "@/core/types/UserRole";

export interface UserCreateRequestDto {
    name: string;
    email: string;
    role: UserRole;
}