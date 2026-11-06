import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, AppState, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { io } from "socket.io-client";
import {
  API_URL,
  getAccessToken,
  refreshSession,
  setSessionListener,
} from "./api";
import type { User } from "./types";
const SessionContext = createContext<{
  user: User | null;
  ready: boolean;
  online: boolean;
}>({ user: null, ready: false, online: true });
export const useSession = () => useContext(SessionContext);
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 15000 },
          mutations: { retry: false, networkMode: "always" },
        },
      }),
  );
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    setSessionListener((next) => {
      setUser(next);
      setToken(getAccessToken());
      if (!next) queryClient.clear();
    });
    void refreshSession()
      .catch(() => {})
      .finally(() => setReady(true));
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected =
        state.isConnected !== false && state.isInternetReachable !== false;
      setOnline(connected);
      onlineManager.setOnline(connected);
    });
    const subscription = AppState.addEventListener("change", (state) => {
      focusManager.setFocused(state === "active");
      if (state === "active") void queryClient.invalidateQueries();
    });
    return () => {
      unsubscribe();
      subscription.remove();
      setSessionListener(() => {});
    };
  }, [queryClient]);
  useEffect(() => {
    if (!ready || !online) return;
    const socket = io(API_URL.replace(/\/api\/v1$/, ""), {
      auth: { token },
      transports: ["websocket", "polling"],
    });
    socket.on("connect", () => {
      void queryClient.invalidateQueries();
    });
    socket.on("availability.changed", () => {
      void queryClient.invalidateQueries({ queryKey: ["availability"] });
      void queryClient.invalidateQueries({ queryKey: ["spaces"] });
    });
    socket.on("bookings.changed", () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
    });
    socket.on("disconnect", (reason) => {
      if (reason === "io server disconnect" && token)
        void refreshSession().catch(() => {});
    });
    const timer = token
      ? setInterval(() => {
          void refreshSession().catch(() => {});
        }, 12 * 60000)
      : undefined;
    return () => {
      socket.disconnect();
      clearInterval(timer);
    };
  }, [ready, online, token, queryClient]);
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContext.Provider value={{ user, ready, online }}>
        {ready ? (
          children
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "#F4F7F3",
            }}
          >
            <ActivityIndicator
              accessibilityLabel="Carregando Reservai"
              color="#156449"
              size="large"
            />
          </View>
        )}
      </SessionContext.Provider>
    </QueryClientProvider>
  );
}
