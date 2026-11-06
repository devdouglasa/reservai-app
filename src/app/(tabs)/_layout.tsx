import { Tabs } from "expo-router";
import { Text, useWindowDimensions } from "react-native";
import { useSession } from "@/lib/providers";
import { palette } from "@/components/ui-kit";
export default function TabsLayout() {
  const { user } = useSession();
  const { width } = useWindowDimensions();
  return (
    <Tabs
      screenOptions={{
        headerTitle: "Reservai",
        headerTintColor: palette.green,
        headerStyle: { backgroundColor: palette.background },
        headerShadowVisible: false,
        tabBarActiveTintColor: palette.green,
        tabBarActiveBackgroundColor: "#E7F1E7",
        tabBarInactiveTintColor: palette.muted,
        tabBarPosition: width >= 900 ? "left" : "bottom",
        tabBarStyle: {
          backgroundColor: palette.white,
          borderColor: palette.border,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Explorar",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 22 }}>⌕</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Reservas",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>▦</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="owner"
        options={{
          title: "Gestão",
          href: user?.role === "owner" ? "/owner" : null,
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>▤</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>○</Text>
          ),
        }}
      />
    </Tabs>
  );
}
