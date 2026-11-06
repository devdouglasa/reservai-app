import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import type { User } from "./types";
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"
).replace(/\/$/, "");
let accessToken: string | null = null;
let listener: (user: User | null) => void = () => {};
let refreshPromise: Promise<User | null> | null = null;
export const getAccessToken = () => accessToken;
export const setSessionListener = (callback: typeof listener) => {
  listener = callback;
};
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}
async function raw<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(Platform.OS !== "web" ? { "X-Client-Platform": "native" } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...options.headers,
      },
      signal: options.signal ?? AbortSignal.timeout(15000),
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Não foi possível conectar. Verifique sua conexão e tente novamente.",
    );
  }
  const body = await response.json();
  if (!response.ok)
    throw new ApiError(
      response.status,
      body.code,
      body.message ?? "Não foi possível concluir a operação.",
    );
  return body as T;
}
async function accept(result: {
  accessToken: string;
  refreshToken?: string;
  user: User;
}) {
  if (Platform.OS !== "web" && result.refreshToken)
    await SecureStore.setItemAsync("reservai.refresh", result.refreshToken);
  accessToken = result.accessToken;
  listener(result.user);
  return result.user;
}
async function refreshBody() {
  return Platform.OS === "web"
    ? {}
    : {
        refreshToken:
          (await SecureStore.getItemAsync("reservai.refresh")) ?? undefined,
      };
}
export async function refreshSession(): Promise<User | null> {
  if (!refreshPromise)
    refreshPromise = (async () => {
      try {
        return await accept(
          await raw("/auth/refresh", {
            method: "POST",
            body: JSON.stringify(await refreshBody()),
          }),
        );
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          accessToken = null;
          listener(null);
          if (Platform.OS !== "web")
            await SecureStore.deleteItemAsync("reservai.refresh");
          return null;
        }
        throw error;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}
export async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    return await raw<T>(path, options);
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      !path.startsWith("/auth/") &&
      (await refreshSession())
    )
      return raw<T>(path, options);
    throw error;
  }
}
export async function signIn(
  mode: "login" | "register",
  input: { name?: string; email: string; password: string },
) {
  return accept(
    await raw(`/auth/${mode}`, { method: "POST", body: JSON.stringify(input) }),
  );
}
export async function signOut() {
  await raw("/auth/logout", {
    method: "POST",
    body: JSON.stringify(await refreshBody()),
  });
  if (Platform.OS !== "web")
    await SecureStore.deleteItemAsync("reservai.refresh");
  accessToken = null;
  listener(null);
}
export const post = <T>(path: string, body: unknown = {}) =>
  api<T>(path, { method: "POST", body: JSON.stringify(body) });
export const put = <T>(path: string, body: unknown) =>
  api<T>(path, { method: "PUT", body: JSON.stringify(body) });
