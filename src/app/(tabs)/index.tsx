import { useState } from "react";
import { Image, View } from "react-native";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { categories, type Category, type Space } from "@/lib/types";
import {
  Button,
  Card,
  Copy,
  Field,
  Heading,
  Loading,
  Notice,
  Page,
  styles,
} from "@/components/ui-kit";
export default function ExploreScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const query = useQuery({
    queryKey: ["spaces", search, category],
    queryFn: () =>
      api<Space[]>(
        `/spaces?search=${encodeURIComponent(search)}&category=${category}`,
      ),
  });
  return (
    <Page
      title="Um espaço para cada momento."
      subtitle="Sua próxima partida, celebração ou atendimento começa aqui. Encontre o lugar e escolha seu horário."
    >
      <Field
        label="Encontre seu espaço"
        placeholder="Buscar pelo nome"
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.row}>
        <Button
          title="Todos"
          secondary={category !== ""}
          onPress={() => setCategory("")}
        />
        {Object.entries(categories).map(([key, label]) => (
          <Button
            key={key}
            title={label}
            secondary={category !== key}
            onPress={() => setCategory(key as Category)}
          />
        ))}
      </View>
      {query.isPending && <Loading />}
      <Notice error text={query.error?.message} />
      {query.isError && (
        <Button
          title="Tentar novamente"
          secondary
          onPress={() => {
            void query.refetch();
          }}
        />
      )}
      {query.data?.length === 0 && (
        <Card>
          <Heading>Nenhum espaço encontrado</Heading>
          <Copy>Tente outro nome ou outra categoria.</Copy>
        </Card>
      )}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 18 }}>
        {query.data?.map((space) => (
          <View
            key={space.id}
            style={{ flexGrow: 1, flexBasis: 310, maxWidth: 540 }}
          >
            <Card>
              {space.imageUrl ? (
                <Image
                  source={{ uri: space.imageUrl }}
                  style={{ height: 170, borderRadius: 14 }}
                />
              ) : (
                <View
                  style={{
                    height: 130,
                    borderRadius: 14,
                    backgroundColor: "#E5EEE0",
                    justifyContent: "center",
                    padding: 22,
                  }}
                >
                  <Heading>{categories[space.category]}</Heading>
                  <Copy>Encontre tempo para o que importa.</Copy>
                </View>
              )}
              <Heading>{space.name}</Heading>
              <Copy>{space.address}</Copy>
              <Copy>
                Até {space.capacity} pessoas · {space.slotMinutes} min por
                horário
              </Copy>
              <Button
                title="Ver disponibilidade →"
                onPress={() => router.push(`/spaces/${space.id}`)}
              />
            </Card>
          </View>
        ))}
      </View>
    </Page>
  );
}
