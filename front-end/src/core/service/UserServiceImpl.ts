import { UserService } from "@/core/service/UserService";
import { UserResponseDto } from "@/core/dto/UserResponseDto";
import { UserCreateRequestDto } from "@/core/dto/UserCreateRequestDto";
import { UserUpdateRequestDto } from "@/core/dto/UserUpdateRequestDto";
import { HttpClient, httpClient } from "@/core/client/HttpClient";

export class UserServiceImpl implements UserService {

    private readonly endpoint = "/api/v1/users";
    private readonly client: HttpClient;

    constructor(client: HttpClient = httpClient) {
        this.client = client;
    }

    public async getAllUsers(): Promise<UserResponseDto[]> {
        return this.client.get<UserResponseDto[]>(this.endpoint);
    }

    public async getUserById(id: string): Promise<UserResponseDto> {
        return this.client.get<UserResponseDto>(`${this.endpoint}/${id}`);
    }

    public async createUser(userDto: UserCreateRequestDto): Promise<UserResponseDto> {
        return this.client.post<UserResponseDto, UserCreateRequestDto>(this.endpoint, userDto);
    }

    public async updateUser(id: string, userDto: UserUpdateRequestDto): Promise<UserResponseDto> {
        return this.client.put<UserResponseDto, UserUpdateRequestDto>(`${this.endpoint}/${id}`, userDto);
    }

    public async deleteUser(id: string): Promise<void> {
        return this.client.delete<void>(`${this.endpoint}/${id}`);
    }

}

export const userService: UserService = new UserServiceImpl()