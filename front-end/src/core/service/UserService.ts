import { UserResponseDto } from "@/core/dto/UserResponseDto";
import { UserCreateRequestDto } from "@/core/dto/UserCreateRequestDto";
import { UserUpdateRequestDto } from "@/core/dto/UserUpdateRequestDto";

export interface UserService {
    getAllUsers() : Promise<UserResponseDto[]>;
    getUserById(id:string):Promise<UserResponseDto>;
    createUser(userDto: UserCreateRequestDto) : Promise<UserResponseDto>;
    updateUser(id:string, userDto:UserUpdateRequestDto) : Promise<UserResponseDto>;
    deleteUser(id:string) : Promise<void>;
}


