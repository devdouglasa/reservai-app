import { useState } from "react";
import { Text, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type Space, type Booking } from "@/lib/types";
import { useSession } from "@/lib/providers";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import { BookingList } from "@/components/booking-list";
import { SpaceCard } from "@/components/space-card";
import { ResponsiveGrid } from "@/components/responsive-grid";
import {
  Button,
  Card,
  Copy,
  EmptyState,
  Gate,
  Heading,
  Icon,
  Notice,
  Page,
  SegmentedControl,
  Skeleton,
  styles,
  type IconName,
} from "@/components/ui-kit";
function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value?: number;
  icon: IconName;
}) {
  const { colors } = useTheme();
  return (
    <Card style={{ flex: 1, minWidth: 140 }}>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Icon name={icon} color={colors.primary} />
        <Text
          style={{
            fontFamily: fonts.extraBold,
            fontSize: 30,
            color: colors.text,
          }}
        >
          {value ?? "—"}
        </Text>
      </View>
      <Copy small>{label}</Copy>
    </Card>
  );
}
function OwnerContent() {
  const [tab, setTab] = useState<"spaces" | "bookings">("spaces");
  const { user } = useSession();
  const query = useQuery({
    queryKey: ["spaces", "owner", user?.id],
    queryFn: () => api<Space[]>("/owner/spaces"),
  });
  const bookings = useQuery({
    queryKey: ["bookings", user?.id, true],
    queryFn: () => api<Booking[]>("/owner/bookings"),
    refetchInterval: 30000,
  });
  return (
    <Page
      eyebrow="Área do proprietário"
      title="Tudo pronto para receber."
      subtitle="Seus espaços, sua agenda e novos encontros acontecendo."
      headerAction={
        <Button
          title="Novo espaço"
          icon="plus"
          onPress={() => router.push("/owner/new")}
        />
      }
    >
      <View style={[styles.row, { alignItems: "stretch" }]}>
        <Stat
          label="Espaços ativos"
          value={query.data?.filter((space) => space.active).length}
          icon="grid"
        />
        <Stat
          label="Solicitações pendentes"
          value={
            bookings.data?.filter(
              (booking) =>
                booking.status === "pending" &&
                new Date(booking.startsAt) > new Date(),
            ).length
          }
          icon="clock"
        />
      </View>
      <SegmentedControl
        value={tab}
        onChange={setTab}
        options={[
          { value: "spaces", label: "Meus espaços" },
          { value: "bookings", label: "Solicitações" },
        ]}
      />
      {tab === "bookings" ? (
        <BookingList owner />
      ) : (
        <>
          <View style={styles.row}>
            <Heading>Seu portfólio de espaços</Heading>
            <Copy small>
              {query.data
                ? `${query.data.length} ${query.data.length === 1 ? "espaço cadastrado" : "espaços cadastrados"}`
                : "Carregando…"}
            </Copy>
          </View>
          {query.isPending && (
            <ResponsiveGrid>
              {[0, 1].map((key) => (
                <Card key={key}>
                  <Skeleton height={190} />
                  <Skeleton height={22} />
                  <Skeleton height={48} />
                </Card>
              ))}
            </ResponsiveGrid>
          )}
          <Notice
            error
            text={query.error?.message ?? bookings.error?.message}
          />
          {query.isError && (
            <Button
              title="Atualizar espaços"
              secondary
              onPress={() => {
                void query.refetch();
              }}
            />
          )}
          {query.data?.length === 0 && (
            <EmptyState
              icon="grid"
              title="Dê espaço a novos encontros"
              text="Cadastre seu primeiro espaço e organize os horários para receber seus clientes."
              action={
                <Button
                  title="Cadastrar meu primeiro espaço"
                  icon="plus"
                  onPress={() => router.push("/owner/new")}
                />
              }
            />
          )}
          <ResponsiveGrid>
            {query.data?.map((space) => (
              <SpaceCard key={space.id} space={space} owner />
            ))}
          </ResponsiveGrid>
        </>
      )}
    </Page>
  );
}
export default function OwnerScreen() {
  return (
    <Gate owner>
      <OwnerContent />
    </Gate>
  );
}
