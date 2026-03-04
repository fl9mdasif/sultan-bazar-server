/* eslint-disable @typescript-eslint/no-explicit-any */
import { authKey } from "@/contains/authKey";
import { decodedToken } from "@/utils/jwt";
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  setToLocalStorage,
} from "@/utils/local-storage";

// ─── Cookie helpers (for Next.js middleware access) ───────────────────────────
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export const storeUserInfo = ({ accessToken }: { accessToken: string }) => {
  setToLocalStorage(authKey, accessToken);
  setCookie(authKey, accessToken);
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);
  if (authToken) {
    const decodedData: any = decodedToken(authToken);
    return {
      ...decodedData,
      role: decodedData?.role?.toLowerCase(),
    };
  }
  return null;
};

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  return !!authToken;
};

export const removeUser = () => {
  removeFromLocalStorage(authKey);
  deleteCookie(authKey);
};
