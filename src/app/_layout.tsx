import { DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { Providers } from "@/lib/providers";
import { palette } from "@/components/ui-kit";
export default function RootLayout() {
  return (
    <Providers>
      <ThemeProvider
        value={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            primary: palette.green,
            background: palette.background,
            card: palette.white,
            text: palette.ink,
            border: palette.border,
          },
        }}
      >
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: palette.background },
            headerTintColor: palette.green,
            headerTitle: "Reservai",
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: "Sua conta" }} />
          <Stack.Screen
            name="spaces/[id]"
            options={{ title: "Conheça o espaço" }}
          />
          <Stack.Screen
            name="owner/[id]"
            options={{ title: "Gerenciar espaço" }}
          />
        </Stack>
      </ThemeProvider>
    </Providers>
  );
}
