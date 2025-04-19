export class TokenResponseDto {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}