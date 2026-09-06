import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;
  role?: string;
  exp: number;
}

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

const savedToken = localStorage.getItem("token");
let initialEmail: string | null = null;

if (savedToken) {
  try {
    const decoded = jwtDecode<DecodedToken>(savedToken);
    initialEmail = decoded.sub;
  } catch {
    localStorage.removeItem("token");
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: savedToken,
  email: initialEmail,
  isAuthenticated: !!savedToken,
  setToken: (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode<DecodedToken>(token);
    set({ token, email: decoded.sub, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, email: null, isAuthenticated: false });
  },
}));