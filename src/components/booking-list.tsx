import { useState } from "react";
import { Text, View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, post } from "@/lib/api";
import { type Booking, dateLabel, timeLabel } from "@/lib/types";
import { dateFromKey } from "@/lib/calendar";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import { useSession } from "@/lib/providers";
import { BookingStatus } from "./booking-status";
import {
  Button,
  Card,
  Copy,
  EmptyState,
  Heading,
  Icon,
  Notice,
  Reveal,
  SegmentedControl,
  Skeleton,
  styles,
} from "./ui-kit";
export function BookingList({ owner = false }: { owner?: boolean }) {
  const { colors } = useTheme();
  const client = useQueryClient();
  const { user, online } = useSession();
  const [view, setView] = useState<"active" | "history">("active");
  const [confirmation, setConfirmation] = useState<{
    id: string;
    action: "approve" | "reject" | "cancel";
  } | null>(null);
  const path = owner ? "/owner/bookings" : "/bookings";
  const query = useQuery({
    queryKey: ["bookings", user?.id, owner],
    queryFn: () => api<Booking[]>(owner ? path : `${path}/me`),
    refetchInterval: 30000,
  });
  const action = useMutation({
    mutationFn: (input: { id: string; action: string }) =>
      post(`${path}/${input.id}/${input.action}`),
    onSuccess: () => setConfirmation(null),
    onSettled: () => {
      void client.invalidateQueries({ queryKey: ["bookings"] });
      void client.invalidateQueries({ queryKey: ["availability"] });
    },
  });
  const isActive = (booking: Booking) =>
    ["pending", "confirmed"].includes(booking.status) &&
    new Date(booking.endsAt) > new Date();
  const activeCount = query.data?.filter(isActive).length ?? 0;
  const bookings = query.data
    ?.filter((booking) =>
      view === "active" ? isActive(booking) : !isActive(booking),
    )
    .sort((a, b) =>
      view === "active"
        ? Date.parse(a.startsAt) - Date.parse(b.startsAt)
        : Date.parse(b.startsAt) - Date.parse(a.startsAt),
    );
  return (
    <>
      <SegmentedControl
        value={view}
        onChange={setView}
        options={[
          {
            value: "active",
            label: `Ativas${query.data ? ` · ${activeCount}` : ""}`,
          },
          { value: "history", label: "Histórico" },
        ]}
      />
      {query.isPending &&
        [0, 1].map((key) => (
          <Card key={key}>
            <Skeleton height={22} style={{ width: "65%" }} />
            <Skeleton height={16} />
            <Skeleton height={48} />
          </Card>
        ))}
      <Notice error text={query.error?.message ?? action.error?.message} />
      {query.isError && (
        <Button
          secondary
          title="Tentar novamente"
          icon="refresh-cw"
          onPress={() => {
            void query.refetch();
          }}
        />
      )}
      {bookings?.length === 0 && (
        <EmptyState
          title={
            view === "active"
              ? "Novos encontros estão por vir"
              : "Suas histórias vão aparecer aqui"
          }
          text={
            owner
              ? "As solicitações e reservas dos seus espaços aparecem nesta área."
              : view === "active"
                ? "Explore os espaços e escolha onde será seu próximo momento."
                : "Reservas encerradas, canceladas, recusadas e expiradas ficam no histórico."
          }
        />
      )}
      {bookings?.map((booking) => {
        const future = new Date(booking.startsAt) > new Date();
        const localDate = new Date(booking.startsAt).toLocaleDateString(
          "en-CA",
          { timeZone: "America/Sao_Paulo" },
        );
        const date = dateFromKey(localDate);
        return (
          <Reveal key={booking.id}>
            <Card>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <View
                  style={{
                    width: 65,
                    paddingVertical: 12,
                    alignItems: "center",
                    borderRadius: 18,
                    backgroundColor: colors.surfaceAlt,
                    gap: 3,
                  }}
                >
                  <Text
                    style={{
                      color: colors.primary,
                      fontFamily: fonts.bold,
                      fontSize: 9,
                      textTransform: "uppercase",
                    }}
                  >
                    {date
                      .toLocaleDateString("pt-BR", {
                        timeZone: "UTC",
                        month: "short",
                      })
                      .replace(".", "")}
                  </Text>
                  <Text
                    style={{
                      color: colors.primary,
                      fontFamily: fonts.extraBold,
                      fontSize: 27,
                    }}
                  >
                    {date.getUTCDate()}
                  </Text>
                </View>
                <View style={{ flex: 1, gap: 9 }}>
                  <Heading>{booking.spaceName}</Heading>
                  <BookingStatus booking={booking} />
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 7,
                    }}
                  >
                    <Icon name="clock" size={15} />
                    <Copy>
                      {timeLabel(booking.startsAt)} às{" "}
                      {timeLabel(booking.endsAt)}
                    </Copy>
                  </View>
                  <Copy small>{dateLabel(booking.startsAt)}</Copy>
                  {owner && <Copy small>Cliente: {booking.customerName}</Copy>}
                </View>
              </View>
              {future && ["pending", "confirmed"].includes(booking.status) && (
                <View
                  style={[
                    styles.row,
                    {
                      borderTopWidth: 1,
                      borderColor: colors.border,
                      paddingTop: 14,
                    },
                  ]}
                >
                  {owner && booking.status === "pending" && (
                    <>
                      <Button
                        title="Aprovar"
                        icon="check"
                        disabled={!online || action.isPending}
                        onPress={() => {
                          action.reset();
                          setConfirmation({
                            id: booking.id,
                            action: "approve",
                          });
                        }}
                      />
                      <Button
                        secondary
                        title="Recusar"
                        icon="x"
                        disabled={!online || action.isPending}
                        onPress={() => {
                          action.reset();
                          setConfirmation({ id: booking.id, action: "reject" });
                        }}
                      />
                    </>
                  )}
                  <Button
                    secondary
                    title="Cancelar reserva"
                    disabled={!online || action.isPending}
                    onPress={() => {
                      action.reset();
                      setConfirmation({ id: booking.id, action: "cancel" });
                    }}
                  />
                </View>
              )}
              {confirmation?.id === booking.id && (
                <View
                  style={{
                    padding: 16,
                    gap: 14,
                    borderRadius: 16,
                    backgroundColor: colors.surfaceAlt,
                  }}
                >
                  <Copy strong>
                    Deseja{" "}
                    {confirmation.action === "approve"
                      ? "aprovar"
                      : confirmation.action === "reject"
                        ? "recusar"
                        : "cancelar"}{" "}
                    esta reserva?
                  </Copy>
                  <View style={styles.row}>
                    <Button
                      title="Confirmar"
                      icon="check"
                      busy={action.isPending}
                      disabled={!online}
                      onPress={() => action.mutate(confirmation)}
                    />
                    <Button
                      title="Voltar"
                      secondary
                      disabled={action.isPending}
                      onPress={() => setConfirmation(null)}
                    />
                  </View>
                </View>
              )}
            </Card>
          </Reveal>
        );
      })}
    </>
  );
}
