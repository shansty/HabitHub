import { jwtDecode } from "jwt-decode";
interface ICustomJwtPayload {
    userId: string;
    exp: number;
    iat: number;
}

export const formatFieldName = (str: string): string => {
    return str
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/^./, (char) => char.toUpperCase());
};

export function setToken(token: string): void {
    localStorage.setItem("token", token);
}

export function getToken(): string | null {
    return localStorage.getItem("token") ;
}

export function getIDFromToken(token: string | null): string | null {
    if (!token) return null;
    const decoded: ICustomJwtPayload = jwtDecode(token);
    return decoded.userId;
}
