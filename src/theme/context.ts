import { createContext, useContext } from "react";
import type { ThemeColors, ThemePreference } from "./tokens";
type AppearanceValue = {
  colors: ThemeColors;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => Promise<void>;
  error: string | null;
  reducedMotion: boolean;
};
export const AppearanceContext = createContext<AppearanceValue | null>(null);
export function useTheme() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("AppearanceProvider is missing");
  return context;
}
