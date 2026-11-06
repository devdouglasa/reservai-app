import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { type Space } from "@/lib/types";
import { useSession } from "@/lib/providers";
import { BookingList } from "@/components/booking-list";
import {
  Button,
  Card,
  Copy,
  Gate,
  Heading,
  Loading,
  Notice,
  Page,
  styles,
} from "@/components/ui-kit";
function OwnerContent() {
  const [tab, setTab] = useState("spaces");
  const { user } = useSession();
  const query = useQuery({
    queryKey: ["spaces", "owner", user?.id],
    queryFn: () => api<Space[]>("/owner/spaces"),
  });
  return (
    <Page
      title="Tudo pronto para receber"
      subtitle="Gerencie seus espaços e acompanhe cada solicitação."
    >
      <View style={styles.row}>
        <Button
          title="Meus espaços"
          secondary={tab !== "spaces"}
          onPress={() => setTab("spaces")}
        />
        <Button
          title="Solicitações"
          secondary={tab !== "bookings"}
          onPress={() => setTab("bookings")}
        />
      </View>
      {tab === "bookings" ? (
        <BookingList owner />
      ) : (
        <>
          <Button
            title="+ Cadastrar espaço"
            onPress={() => router.push("/owner/new")}
          />
          {query.isPending && <Loading />}
          <Notice error text={query.error?.message} />
          {query.data?.length === 0 && (
            <Copy>Cadastre seu primeiro espaço para começar.</Copy>
          )}
          {query.data?.map((space) => (
            <Card key={space.id}>
              <Heading>{space.name}</Heading>
              <Copy>
                {space.active ? "Ativo" : "Inativo"} · {space.address}
              </Copy>
              <Button
                title="Editar espaço e agenda"
                secondary
                onPress={() => router.push(`/owner/${space.id}`)}
              />
            </Card>
          ))}
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
