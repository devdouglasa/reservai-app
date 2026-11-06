import { Tabs, router } from "expo-router";
import { useWindowDimensions } from "react-native";
import { AppNavigation } from "@/components/app-navigation";
import { Brand, IconButton } from "@/components/ui-kit";
import { useTheme } from "@/theme/context";
export default function TabsLayout() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  return (
    <Tabs
      tabBar={(props) => <AppNavigation {...props} />}
      screenOptions={{
        headerShown: width < 900,
        headerTitle: () => <Brand small />,
        headerRight: () => (
          <IconButton
            name="user"
            label="Abrir perfil"
            onPress={() => router.push("/profile")}
          />
        ),
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        tabBarPosition: width >= 900 ? "left" : "bottom",
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Explorar" }} />
      <Tabs.Screen name="bookings" options={{ title: "Reservas" }} />
      <Tabs.Screen name="owner" options={{ title: "Gestão" }} />
      <Tabs.Screen name="profile" options={{ title: "Perfil" }} />
    </Tabs>
  );
}
