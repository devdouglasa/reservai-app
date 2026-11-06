import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import { timeLabel, type Slot } from "@/lib/types";
import { Icon } from "./ui-kit";
export function TimeSlot({
  slot,
  selected,
  disabled,
  onPress,
}: {
  slot: Slot;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
}) {
  const { colors, reducedMotion } = useTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));
  const available = slot.available;
  const foreground = selected
    ? colors.onPrimary
    : available
      ? colors.text
      : colors.muted;
  return (
    <Animated.View style={[{ flexBasis: 135, flexGrow: 1 }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${timeLabel(slot.startsAt)} às ${timeLabel(slot.endsAt)}, ${available ? (selected ? "selecionado" : "disponível") : "indisponível"}`}
        accessibilityState={{ selected, disabled: !available || !!disabled }}
        aria-pressed={selected}
        aria-disabled={!available || !!disabled}
        disabled={!available || disabled}
        onPress={onPress}
        onPressIn={() => {
          if (!reducedMotion) scale.set(withTiming(0.97, { duration: 150 }));
        }}
        onPressOut={() => {
          scale.set(withTiming(1, { duration: reducedMotion ? 0 : 180 }));
        }}
        style={{
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.border,
          backgroundColor: selected
            ? colors.primary
            : available
              ? colors.surface
              : colors.neutralBg,
          borderRadius: 15,
          padding: 14,
          minHeight: 77,
          gap: 7,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 7,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              fontSize: 16,
              color: foreground,
              textDecorationLine: available ? "none" : "line-through",
            }}
          >
            {timeLabel(slot.startsAt)}
          </Text>
          <Icon
            name={selected ? "check-circle" : available ? "clock" : "lock"}
            size={15}
            color={foreground}
          />
        </View>
        <Text
          style={{ fontFamily: fonts.medium, fontSize: 10, color: foreground }}
        >
          {available ? `Até ${timeLabel(slot.endsAt)}` : "Indisponível"}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
