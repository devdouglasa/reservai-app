import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { Providers } from "@/lib/providers";
import { AppearanceProvider } from "@/theme/provider";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
void SplashScreen.preventAutoHideAsync().catch(() => {});
function Navigation() {
  const { colors, isDark } = useTheme();
  const base = isDark ? DarkTheme : DefaultTheme;
  return (
    <ThemeProvider
      value={{
        ...base,
        colors: {
          ...base.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
        },
        fonts: {
          regular: { fontFamily: fonts.regular, fontWeight: "400" },
          medium: { fontFamily: fonts.medium, fontWeight: "500" },
          bold: { fontFamily: fonts.bold, fontWeight: "700" },
          heavy: { fontFamily: fonts.extraBold, fontWeight: "800" },
        },
      }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontFamily: fonts.bold, fontSize: 16 },
          headerShadowVisible: false,
          headerBackTitle: "Voltar",
          contentStyle: { backgroundColor: colors.background },
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
  );
}
export default function RootLayout() {
  return (
    <AppearanceProvider>
      <Providers>
        <Navigation />
      </Providers>
    </AppearanceProvider>
  );
}
