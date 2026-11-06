import { useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, post } from "@/lib/api";
import { useSession } from "@/lib/providers";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import {
  type Space,
  type Slot,
  dateLabel,
  timeLabel,
  today,
  categories,
} from "@/lib/types";
import {
  Button,
  Card,
  Copy,
  Heading,
  Icon,
  IconButton,
  Notice,
  Page,
  Reveal,
  Skeleton,
  styles,
} from "@/components/ui-kit";
import { DatePicker } from "@/components/date-picker";
import { SpaceCover } from "@/components/space-cover";
import { TimeSlot } from "@/components/time-slot";
export default function SpaceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [date, setDate] = useState(today());
  const [selected, setSelected] = useState<Slot | null>(null);
  const { user, online } = useSession();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const desktop = width >= 1000;
  const client = useQueryClient();
  const space = useQuery({
    queryKey: ["spaces", id],
    queryFn: () => api<Space>(`/spaces/${id}`),
  });
  const slots = useQuery({
    queryKey: ["availability", id, date],
    queryFn: () => api<Slot[]>(`/spaces/${id}/availability?date=${date}`),
    refetchInterval: 30000,
  });
  const selection =
    slots.data?.find(
      (slot) => slot.startsAt === selected?.startsAt && slot.available,
    ) ?? null;
  const booking = useMutation({
    mutationFn: () => {
      if (!selection)
        throw new Error("Escolha um horário disponível para continuar.");
      return post("/bookings", { spaceId: id, startsAt: selection.startsAt });
    },
    onSuccess: () => {
      setSelected(null);
      void client.invalidateQueries({ queryKey: ["bookings"] });
    },
    onSettled: () => {
      void client.invalidateQueries({ queryKey: ["availability"] });
    },
  });
  const submit = () => (user ? booking.mutate() : router.push("/login"));
  const action = (
    <Button
      title={user ? "Solicitar reserva" : "Entrar para reservar"}
      icon="arrow-right"
      busy={booking.isPending}
      disabled={!online || !selection}
      onPress={submit}
    />
  );
  const footer =
    !desktop && booking.isSuccess ? (
      <View
        style={{ width: "100%", maxWidth: 700, alignSelf: "center", gap: 12 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Icon name="check-circle" color={colors.success} size={26} />
          <View style={{ flex: 1 }}>
            <Heading>Solicitação enviada!</Heading>
            <Copy small>Aguardando aprovação do proprietário.</Copy>
          </View>
        </View>
        <Button
          title="Ver minhas reservas"
          icon="arrow-right"
          onPress={() => router.push("/bookings")}
        />
      </View>
    ) : !desktop && booking.isError ? (
      <View style={{ gap: 10 }}>
        <Notice error text={booking.error.message} />
        <Button
          secondary
          title="Escolher outro horário"
          onPress={() => {
            booking.reset();
            setSelected(null);
          }}
        />
      </View>
    ) : !desktop && selection ? (
      <View
        style={{ width: "100%", maxWidth: 700, alignSelf: "center", gap: 10 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 15,
                color: colors.text,
              }}
            >
              {timeLabel(selection.startsAt)} – {timeLabel(selection.endsAt)}
            </Text>
            <Copy small>
              {dateLabel(selection.startsAt)} · Sujeito à aprovação
            </Copy>
          </View>
          <IconButton
            name="x"
            label="Limpar horário selecionado"
            disabled={booking.isPending}
            onPress={() => setSelected(null)}
          />
        </View>
        {action}
      </View>
    ) : undefined;
  return (
    <Page
      eyebrow={
        space.data ? categories[space.data.category] : "Encontre seu espaço"
      }
      title={space.data?.name ?? "Conheça o espaço"}
      subtitle={space.data?.address}
      footer={footer}
    >
      {space.isPending && <Skeleton height={260} />}
      <Notice error text={space.error?.message} />
      {space.isError && (
        <Button
          title="Tentar novamente"
          secondary
          onPress={() => {
            void space.refetch();
          }}
        />
      )}
      {space.data && (
        <Reveal>
          <SpaceCover
            category={space.data.category}
            imageUrl={space.data.imageUrl}
            name={space.data.name}
            height={width < 600 ? 230 : 290}
          />
        </Reveal>
      )}
      <View
        style={{
          flexDirection: desktop ? "row" : "column",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <View
          style={{
            flex: 1,
            width: desktop ? undefined : "100%",
            minWidth: 0,
            gap: 24,
          }}
        >
          {space.data && (
            <Card>
              <Heading>Um lugar para o seu momento</Heading>
              <Copy>{space.data.description}</Copy>
              <View style={styles.row}>
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <Icon name="users" color={colors.primary} />
                  <Copy strong>Até {space.data.capacity} pessoas</Copy>
                </View>
                <View
                  style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
                >
                  <Icon name="clock" color={colors.primary} />
                  <Copy strong>
                    {space.data.slotMinutes} minutos por horário
                  </Copy>
                </View>
              </View>
            </Card>
          )}
          <Card>
            <View style={{ gap: 4 }}>
              <Heading>Quando vamos nos encontrar?</Heading>
              <Copy small>Escolha a data e um horário. Fuso de São Paulo.</Copy>
            </View>
            <DatePicker
              value={date}
              onChange={(value) => {
                setDate(value);
                setSelected(null);
                booking.reset();
              }}
            />
            <View
              style={[
                styles.row,
                { justifyContent: "space-between", marginTop: 8 },
              ]}
            >
              <Copy strong>Horários disponíveis</Copy>
              <Copy small>
                {slots.isFetching && !slots.isPending
                  ? "Atualizando…"
                  : "Atualização em tempo real"}
              </Copy>
            </View>
            {slots.isPending && (
              <View style={styles.row}>
                {[0, 1, 2, 3].map((key) => (
                  <Skeleton
                    key={key}
                    height={77}
                    style={{ flexBasis: 135, flexGrow: 1 }}
                  />
                ))}
              </View>
            )}
            <Notice error text={slots.error?.message} />
            {slots.isError && (
              <Button
                title="Atualizar horários"
                secondary
                icon="refresh-cw"
                onPress={() => {
                  void slots.refetch();
                }}
              />
            )}
            {slots.data?.length === 0 && (
              <Notice
                icon="calendar"
                text="Este espaço não abre nesta data. Escolha outro dia."
              />
            )}
            <View style={[styles.row, { alignItems: "stretch", gap: 10 }]}>
              {slots.data?.map((slot) => (
                <TimeSlot
                  key={slot.startsAt}
                  slot={slot}
                  selected={selection?.startsAt === slot.startsAt}
                  disabled={!online || booking.isPending}
                  onPress={() => {
                    setSelected(slot);
                    booking.reset();
                  }}
                />
              ))}
            </View>
            {selected && slots.data && !selection && !booking.isSuccess && (
              <Notice
                error
                text="Este horário não está mais disponível. Escolha outro para continuar."
              />
            )}
          </Card>
        </View>
        <View style={{ width: desktop ? 325 : "100%", gap: 18 }}>
          {!booking.isSuccess && (
            <Card>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: colors.surfaceAlt,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="calendar" color={colors.primary} />
              </View>
              <Heading>Sua próxima reserva</Heading>
              {selection ? (
                <>
                  <Text
                    style={{
                      fontFamily: fonts.bold,
                      fontSize: 24,
                      color: colors.text,
                    }}
                  >
                    {timeLabel(selection.startsAt)} –{" "}
                    {timeLabel(selection.endsAt)}
                  </Text>
                  <Copy strong>{dateLabel(selection.startsAt)}</Copy>
                  <Copy>{space.data?.name}</Copy>
                </>
              ) : (
                <Copy>
                  Escolha uma data e um horário para preparar sua solicitação.
                </Copy>
              )}
              <View style={{ height: 1, backgroundColor: colors.border }} />
              <Copy small>
                O proprietário analisa sua solicitação. Sem resposta até o
                início, ela expira. Cancelamento gratuito antes do início.
              </Copy>
              {desktop && action}
            </Card>
          )}
          <Notice error text={booking.error?.message} />
          {booking.isSuccess && desktop && (
            <Reveal>
              <Card>
                <Icon name="check-circle" size={30} color={colors.success} />
                <Heading>Solicitação enviada!</Heading>
                <Copy>
                  Aguardando aprovação do proprietário. Você pode acompanhar a
                  resposta em suas reservas.
                </Copy>
                <Button
                  title="Ver minhas reservas"
                  icon="arrow-right"
                  onPress={() => router.push("/bookings")}
                />
              </Card>
            </Reveal>
          )}
        </View>
      </View>
    </Page>
  );
}
