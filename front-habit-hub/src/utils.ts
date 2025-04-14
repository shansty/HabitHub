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

export const formatString = (str: string): string => {
    return (str.charAt(0).toLocaleUpperCase() + str.slice(1).toLowerCase())
}

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

export function isTokenValid(token: string | null): boolean {
    if (!token) return false;
  
    try {
      const decoded: ICustomJwtPayload = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
