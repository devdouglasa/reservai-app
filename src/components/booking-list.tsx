import { useState } from "react";
import { View } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, post } from "@/lib/api";
import { type Booking, dateLabel, timeLabel } from "@/lib/types";
import { BookingStatus } from "./booking-status";
import { useSession } from "@/lib/providers";
import { Button, Card, Copy, Heading, Loading, Notice, styles } from "./ui-kit";
export function BookingList({ owner = false }: { owner?: boolean }) {
  const client = useQueryClient();
  const { user, online } = useSession();
  const [confirmation, setConfirmation] = useState<{
    id: string;
    action: string;
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
  return (
    <>
      {query.isPending && <Loading />}
      <Notice error text={query.error?.message ?? action.error?.message} />
      {query.isError && (
        <Button
          secondary
          title="Tentar novamente"
          onPress={() => {
            void query.refetch();
          }}
        />
      )}
      {query.data?.length === 0 && (
        <Card>
          <Heading>Nenhuma reserva por aqui</Heading>
          <Copy>
            {owner
              ? "As novas solicitações aparecerão aqui."
              : "Explore os espaços e encontre seu próximo encontro."}
          </Copy>
        </Card>
      )}
      {query.data?.map((booking) => {
        const future = new Date(booking.startsAt) > new Date();
        return (
          <Card key={booking.id}>
            <Heading>{booking.spaceName}</Heading>
            <BookingStatus booking={booking} />
            <Copy>
              {dateLabel(booking.startsAt)} · {timeLabel(booking.startsAt)} às{" "}
              {timeLabel(booking.endsAt)}
            </Copy>
            {owner && <Copy>Cliente: {booking.customerName}</Copy>}
            {future && ["pending", "confirmed"].includes(booking.status) && (
              <View style={styles.row}>
                {owner && booking.status === "pending" && (
                  <>
                    <Button
                      title="Aprovar"
                      disabled={!online || action.isPending}
                      onPress={() =>
                        setConfirmation({ id: booking.id, action: "approve" })
                      }
                    />
                    <Button
                      secondary
                      title="Recusar"
                      disabled={!online || action.isPending}
                      onPress={() =>
                        setConfirmation({ id: booking.id, action: "reject" })
                      }
                    />
                  </>
                )}
                <Button
                  secondary
                  title="Cancelar reserva"
                  disabled={!online || action.isPending}
                  onPress={() =>
                    setConfirmation({ id: booking.id, action: "cancel" })
                  }
                />
              </View>
            )}
            {confirmation?.id === booking.id && (
              <>
                <Copy>
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
                    title={action.isPending ? "Salvando…" : "Confirmar"}
                    disabled={!online || action.isPending}
                    onPress={() => action.mutate(confirmation)}
                  />
                  <Button
                    title="Voltar"
                    secondary
                    disabled={action.isPending}
                    onPress={() => setConfirmation(null)}
                  />
                </View>
              </>
            )}
          </Card>
        );
      })}
    </>
  );
}
