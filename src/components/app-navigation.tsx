import type { ComponentProps } from "react";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Brand, Copy, Icon, type IconName } from "./ui-kit";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import { useSession } from "@/lib/providers";
type TabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];
const items: Record<string, { title: string; icon: IconName }> = {
  index: { title: "Explorar", icon: "compass" },
  bookings: { title: "Reservas", icon: "calendar" },
  owner: { title: "Gestão", icon: "grid" },
  profile: { title: "Perfil", icon: "user" },
};
export function AppNavigation({ state, emitter, navigateToTab }: TabBarProps) {
  const { colors } = useTheme();
  const { user } = useSession();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const desktop = width >= 900;
  return (
    <View
      style={
        desktop
          ? {
              width: 224,
              padding: 22,
              gap: 36,
              borderRightWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
            }
          : {
              flexDirection: "row",
              borderTopWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.surface,
              paddingHorizontal: 10,
              paddingTop: 8,
              paddingBottom: Math.max(insets.bottom, 10),
            }
      }
    >
      {desktop && (
        <View style={{ paddingVertical: 16, gap: 7 }}>
          <Brand />
          <Copy small>Seu tempo, bem reservado.</Copy>
        </View>
      )}
      <View
        accessibilityRole="tablist"
        style={
          desktop ? { gap: 10 } : { flex: 1, flexDirection: "row", gap: 4 }
        }
      >
        {state.routes
          .filter(
            (route) =>
              items[route.name] &&
              (route.name !== "owner" || user?.role === "owner"),
          )
          .map((route) => {
            const item = items[route.name];
            const focused = state.routes[state.index].key === route.key;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityLabel={item.title}
                accessibilityState={{ selected: focused }}
                aria-selected={focused}
                onPress={() => {
                  const event = emitter.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });
                  if (!focused && !event.defaultPrevented)
                    navigateToTab(route.key);
                }}
                style={({ pressed }) => ({
                  flex: desktop ? undefined : 1,
                  minHeight: desktop ? 54 : 56,
                  borderRadius: 15,
                  paddingHorizontal: desktop ? 16 : 3,
                  paddingVertical: 8,
                  flexDirection: desktop ? "row" : "column",
                  gap: desktop ? 13 : 5,
                  alignItems: "center",
                  justifyContent: desktop ? "flex-start" : "center",
                  backgroundColor: focused ? colors.surfaceAlt : "transparent",
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Icon
                  name={item.icon}
                  size={20}
                  color={focused ? colors.primary : colors.muted}
                />
                <Text
                  style={{
                    fontFamily: focused ? fonts.bold : fonts.medium,
                    fontSize: desktop ? 13 : 10,
                    color: focused ? colors.primary : colors.muted,
                  }}
                >
                  {item.title}
                </Text>
                {focused && desktop && (
                  <View
                    style={{
                      marginLeft: "auto",
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: colors.accent,
                    }}
                  />
                )}
              </Pressable>
            );
          })}
      </View>
      {desktop && (
        <View
          style={{
            marginTop: "auto",
            padding: 16,
            borderRadius: 20,
            gap: 12,
            backgroundColor: colors.surfaceAlt,
          }}
        >
          <Icon name="sun" color={colors.primary} size={25} />
          <Text
            style={{
              color: colors.text,
              fontFamily: fonts.bold,
              fontSize: 13,
              lineHeight: 20,
            }}
          >
            Mais encontros.{"\n"}Boas histórias.
          </Text>
          <Copy small>Encontre um lugar para o que importa.</Copy>
        </View>
      )}
    </View>
  );
}
