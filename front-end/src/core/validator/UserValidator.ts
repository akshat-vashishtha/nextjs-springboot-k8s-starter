import { UserCreateRequestDto } from "@/core/dto/UserCreateRequestDto";
import { UserUpdateRequestDto } from "@/core/dto/UserUpdateRequestDto";
import { ValidationResult } from "@/core/validator/ValidationResult";
import { UserRole } from "@/core/types/UserRole";
import { UserStatus } from "@/core/types/UserStatus";

export class UserValidator {

    public validateCreateUser(userDto: UserCreateRequestDto): ValidationResult {
        const errors: Record<string, string> = {};
        if (!userDto.name || userDto.name.trim().length === 0) {
            errors.name = "Name is required";
        }
        if (!userDto.email || userDto.email.trim().length === 0) {
            errors.email = "Email is required";
        }
        if (!userDto.role) {
            errors.role = "Role is required";
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    public validateUpdateUser(userDto: UserUpdateRequestDto): ValidationResult {
        const errors: Record<string, string> = {};
        if (!userDto.name || userDto.name.trim().length === 0) {
            errors.name = "Name is required";
        }
        if (!userDto.role) {
            errors.role = "Role is required";
        }
        if (!userDto.status) {
            errors.status = "Status is required";
        }
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

}