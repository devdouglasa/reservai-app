import { useEffect, useState, type ReactNode } from "react";
import {
  AccessibilityInfo,
  ActivityIndicator,
  Platform,
  Text,
  useColorScheme,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from "@expo-google-fonts/manrope";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";
import { darkColors, lightColors, fonts, type ThemePreference } from "./tokens";
import { AppearanceContext, useTheme } from "./context";

const storageKey = "reservai.appearance";
export function AppearanceProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, updatePreference] = useState<ThemePreference>("system");
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [fontLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  const isDark =
    preference === "dark" ||
    (preference === "system" && systemScheme === "dark");
  const colors = isDark ? darkColors : lightColors;
  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(storageKey)
      .then((value) => {
        if (
          active &&
          (value === "light" || value === "dark" || value === "system")
        )
          updatePreference(value);
      })
      .catch(() => {
        if (active)
          setError("Não foi possível carregar sua preferência de aparência.");
      })
      .finally(() => {
        if (active) setLoaded(true);
      });
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReducedMotion(value);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReducedMotion,
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  const ready = loaded && (fontLoaded || !!fontError);
  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync().catch(() => {});
      void SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
    }
  }, [ready, colors.background]);
  async function setPreference(value: ThemePreference) {
    updatePreference(value);
    setError(null);
    try {
      await AsyncStorage.setItem(storageKey, value);
    } catch {
      setError(
        "O tema foi aplicado, mas não foi possível salvar a preferência.",
      );
    }
  }
  return (
    <AppearanceContext.Provider
      value={{
        colors,
        isDark,
        preference,
        setPreference,
        error,
        reducedMotion,
      }}
    >
      {ready ? (
        children
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor:
              Platform.OS === "web"
                ? "var(--reservai-boot-background, #F7F7FC)"
                : lightColors.background,
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              color:
                Platform.OS === "web"
                  ? "var(--reservai-boot-primary, #5B42D6)"
                  : lightColors.primary,
            }}
          >
            reservai<Text style={{ color: lightColors.accent }}>.</Text>
          </Text>
          <ActivityIndicator
            color={
              Platform.OS === "web"
                ? "var(--reservai-boot-primary, #5B42D6)"
                : lightColors.primary
            }
            accessibilityLabel="Preparando seu espaço"
          />
        </View>
      )}
    </AppearanceContext.Provider>
  );
}
export function AppBoot() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.extraBold,
          fontSize: 30,
          color: colors.text,
        }}
      >
        reservai<Text style={{ color: colors.accent }}>.</Text>
      </Text>
      <ActivityIndicator
        color={colors.primary}
        accessibilityLabel="Carregando Reservai"
      />
    </View>
  );
}
