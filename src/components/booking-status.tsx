import { Text } from "react-native";
import { type Booking, statusLabels } from "@/lib/types";
const colors = {
  pending: { backgroundColor: "#FFF3D8", color: "#775216" },
  confirmed: { backgroundColor: "#E7F1E7", color: "#156449" },
  rejected: { backgroundColor: "#FCEEEE", color: "#A63838" },
  cancelled: { backgroundColor: "#EDF0F2", color: "#57636B" },
  expired: { backgroundColor: "#EDF0F2", color: "#57636B" },
};
export function BookingStatus({ booking }: { booking: Booking }) {
  const completed =
    booking.status === "confirmed" && new Date(booking.endsAt) <= new Date();
  return (
    <Text
      accessibilityRole="text"
      style={{
        alignSelf: "flex-start",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontWeight: "600",
        ...colors[booking.status],
      }}
    >
      {completed ? "Realizada" : statusLabels[booking.status]}
    </Text>
  );
}
