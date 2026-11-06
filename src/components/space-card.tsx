import { Text, View } from "react-native";
import { router } from "expo-router";
import { SpaceCover } from "./space-cover";
import { Button, Copy, Icon } from "./ui-kit";
import { categories, type Space } from "@/lib/types";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
export function SpaceCard({
  space,
  owner = false,
}: {
  space: Space;
  owner?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        borderRadius: 26,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        padding: 12,
        gap: 18,
      }}
    >
      <SpaceCover
        category={space.category}
        imageUrl={space.imageUrl}
        name={space.name}
      />
      <View style={{ paddingHorizontal: 8, paddingBottom: 8, gap: 13 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <Text
            style={{
              color: colors.primary,
              fontFamily: fonts.bold,
              fontSize: 10,
              letterSpacing: 0.8,
            }}
          >
            {categories[space.category].toUpperCase()}
          </Text>
          {owner && (
            <Text
              style={{
                fontFamily: fonts.semibold,
                fontSize: 11,
                color: space.active ? colors.success : colors.muted,
              }}
            >
              {space.active ? "● Ativo" : "○ Inativo"}
            </Text>
          )}
        </View>
        <Text
          style={{
            fontFamily: fonts.bold,
            color: colors.text,
            fontSize: 21,
            letterSpacing: -0.5,
          }}
        >
          {space.name}
        </Text>
        <View
          style={{ flexDirection: "row", gap: 7, alignItems: "flex-start" }}
        >
          <Icon name="map-pin" size={15} />
          <View style={{ flex: 1 }}>
            <Copy small>{space.address}</Copy>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <Icon name="users" size={15} />
            <Copy small>Até {space.capacity} pessoas</Copy>
          </View>
          <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
            <Icon name="clock" size={15} />
            <Copy small>{space.slotMinutes} min</Copy>
          </View>
        </View>
        <Button
          secondary={!owner}
          title={owner ? "Editar espaço" : "Ver horários"}
          icon={owner ? "edit-2" : "arrow-up-right"}
          onPress={() =>
            router.push(owner ? `/owner/${space.id}` : `/spaces/${space.id}`)
          }
        />
      </View>
    </View>
  );
}
