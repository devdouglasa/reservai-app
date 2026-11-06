import { useState } from "react";
import { Image, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, post } from "@/lib/api";
import { useSession } from "@/lib/providers";
import {
  type Space,
  type Slot,
  dateLabel,
  timeLabel,
  today,
} from "@/lib/types";
import {
  Button,
  Card,
  Copy,
  Heading,
  Loading,
  Notice,
  Page,
  styles,
} from "@/components/ui-kit";
import { DatePicker } from "@/components/date-picker";
export default function SpaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [date, setDate] = useState(today());
  const [selected, setSelected] = useState<Slot | null>(null);
  const { user, online } = useSession();
  const client = useQueryClient();
  const space = useQuery({
    queryKey: ["spaces", id],
    queryFn: () => api<Space>(`/spaces/${id}`),
  });
  const slots = useQuery({
    queryKey: ["availability", id, date],
    queryFn: () => api<Slot[]>(`/spaces/${id}/availability?date=${date}`),
    enabled: /^\d{4}-\d{2}-\d{2}$/.test(date),
    refetchInterval: 30000,
  });
  const booking = useMutation({
    mutationFn: () =>
      post("/bookings", { spaceId: id, startsAt: selected!.startsAt }),
    onSuccess: () => {
      setSelected(null);
      void client.invalidateQueries({ queryKey: ["bookings"] });
    },
    onSettled: () => {
      void client.invalidateQueries({ queryKey: ["availability"] });
    },
  });
  return (
    <Page
      title={space.data?.name ?? "Conheça o espaço"}
      subtitle={space.data?.address}
    >
      {space.isPending && <Loading />}
      <Notice error text={space.error?.message} />
      {space.data && (
        <Card>
          {space.data.imageUrl && (
            <Image
              source={{ uri: space.data.imageUrl }}
              style={{ height: 240, borderRadius: 16 }}
            />
          )}
          <Copy>{space.data.description}</Copy>
          <Copy>
            Até {space.data.capacity} pessoas · Cada horário tem{" "}
            {space.data.slotMinutes} minutos
          </Copy>
        </Card>
      )}
      <Card>
        <Heading>Escolha o melhor horário</Heading>
        <Copy>
          Horário de São Paulo. Disponibilidade para os próximos 90 dias.
        </Copy>
        <DatePicker
          value={date}
          onChange={(value) => {
            setDate(value);
            setSelected(null);
            booking.reset();
          }}
        />
        {slots.isFetching && <Loading />}
        <Notice error text={slots.error?.message} />
        {slots.data?.length === 0 && (
          <Copy>Este espaço não abre nesta data. Escolha outro dia.</Copy>
        )}
        <View style={styles.row}>
          {slots.data?.map((slot) => (
            <Button
              key={slot.startsAt}
              title={`${timeLabel(slot.startsAt)} – ${timeLabel(slot.endsAt)}${slot.available ? "" : " · Indisponível"}`}
              secondary={selected?.startsAt !== slot.startsAt}
              disabled={!slot.available || !online || booking.isPending}
              onPress={() => {
                setSelected(slot);
                booking.reset();
              }}
            />
          ))}
        </View>
      </Card>
      {selected && (
        <Card>
          <Heading>Revise sua solicitação</Heading>
          <Copy>
            {dateLabel(selected.startsAt)} · {timeLabel(selected.startsAt)} às{" "}
            {timeLabel(selected.endsAt)}
          </Copy>
          <Copy>
            O horário ficará reservado enquanto o proprietário analisa. Sem
            resposta até o início, a solicitação expira. Você pode cancelar
            gratuitamente antes do início.
          </Copy>
          <Button
            title={
              booking.isPending
                ? "Enviando…"
                : user
                  ? "Solicitar reserva"
                  : "Entrar para reservar"
            }
            disabled={
              !online ||
              booking.isPending ||
              !slots.data?.some(
                (slot) => slot.startsAt === selected.startsAt && slot.available,
              )
            }
            onPress={() => (user ? booking.mutate() : router.push("/login"))}
          />
        </Card>
      )}
      <Notice error text={booking.error?.message} />
      {booking.isSuccess && (
        <Card>
          <Heading>Solicitação enviada!</Heading>
          <Copy>
            Aguardando aprovação do proprietário. Acompanhe a resposta em suas
            reservas.
          </Copy>
          <Button
            title="Ver minhas reservas"
            onPress={() => router.push("/bookings")}
          />
        </Card>
      )}
    </Page>
  );
}
