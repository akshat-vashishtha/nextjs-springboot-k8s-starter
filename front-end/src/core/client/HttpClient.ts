import { ApiClientError } from "@/core/client/ApiClientError";
import { ErrorResponseDto } from "@/core/dto/ErrorResponseDto";

const DEFAULT_BASE_URL: string = 
    typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL !== undefined
        ? process.env.NEXT_PUBLIC_API_URL
        : "http://localhost:8080";

export class HttpClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string = DEFAULT_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    public async get<T>(path: string) : Promise<T>{
        return this.request<T>(path, "GET");
    }

    public async post<T,B> (path: string, body: B) : Promise <T> {
        return this.request<T>(path, "POST", body);
    }

    public async put<T,B> (path: string, body: B) : Promise <T> {
        return this.request<T>(path, "PUT", body);
    }

    public async delete<T> (path: string) : Promise<T> {
        return this.request<T>(path, "DELETE");
    }

    private async request<T>(path:string, method: string, body?: unknown) : Promise<T> {
        const url = `${this.baseUrl}${path}`;

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body ? JSON.stringify(body) : undefined
        });

        
        if (!response.ok) {
            const errorDto = (await response.json()) as ErrorResponseDto;
            throw new ApiClientError(errorDto);
        }

        if (response.status === 204) {
            return undefined as unknown as T;
        }

        return (await response.json()) as T;
    }

}

export const httpClient = new HttpClient();
