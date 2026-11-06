import { Text, View } from "react-native";
import { type Booking, statusLabels } from "@/lib/types";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import { Icon, type IconName } from "./ui-kit";
export function BookingStatus({ booking }: { booking: Booking }) {
  const { colors } = useTheme();
  const completed =
    booking.status === "confirmed" && new Date(booking.endsAt) <= new Date();
  const tones = {
    pending: { color: colors.warning, bg: colors.warningBg, icon: "clock" },
    confirmed: {
      color: colors.success,
      bg: colors.successBg,
      icon: "check-circle",
    },
    rejected: { color: colors.danger, bg: colors.dangerBg, icon: "x-circle" },
    cancelled: { color: colors.neutral, bg: colors.neutralBg, icon: "slash" },
    expired: { color: colors.neutral, bg: colors.neutralBg, icon: "clock" },
  };
  const tone = tones[booking.status];
  return (
    <View
      style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        borderRadius: 999,
        paddingHorizontal: 11,
        paddingVertical: 7,
        backgroundColor: tone.bg,
      }}
    >
      <Icon name={tone.icon as IconName} size={13} color={tone.color} />
      <Text
        style={{ fontFamily: fonts.semibold, fontSize: 10, color: tone.color }}
      >
        {completed ? "Realizada" : statusLabels[booking.status]}
      </Text>
    </View>
  );
}
