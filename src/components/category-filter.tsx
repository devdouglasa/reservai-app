import { Pressable, ScrollView, Text, View } from "react-native";
import { categories, type Category } from "@/lib/types";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import { Icon, type IconName } from "./ui-kit";
const icons: Record<string, IconName> = {
  "": "grid",
  sports_court: "activity",
  party_hall: "gift",
  office: "plus-square",
};
export function CategoryFilter({
  value,
  onChange,
  includeAll = true,
}: {
  value: string;
  onChange: (value: Category | "") => void;
  includeAll?: boolean;
}) {
  const { colors } = useTheme();
  const options = [
    ...(includeAll ? [["", "Todos os espaços"]] : []),
    ...Object.entries(categories),
  ];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingBottom: 2 }}
    >
      <View style={{ flexDirection: "row", gap: 10 }}>
        {options.map(([key, label]) => {
          const active = value === key;
          return (
            <Pressable
              key={key}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: active }}
              aria-pressed={active}
              onPress={() => onChange(key as Category | "")}
              style={({ pressed }) => ({
                minHeight: 48,
                paddingHorizontal: 17,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: active ? colors.primary : colors.border,
                backgroundColor: active ? colors.primary : colors.surface,
                flexDirection: "row",
                gap: 9,
                alignItems: "center",
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Icon
                name={icons[key]}
                size={16}
                color={active ? colors.onPrimary : colors.muted}
              />
              <Text
                style={{
                  fontFamily: fonts.semibold,
                  fontSize: 12,
                  color: active ? colors.onPrimary : colors.text,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}
