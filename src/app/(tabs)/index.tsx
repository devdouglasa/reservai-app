import { useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useSession } from "@/lib/providers";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import { type Category, type Space } from "@/lib/types";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Heading,
  Icon,
  Notice,
  Page,
  Reveal,
  Skeleton,
  styles,
} from "@/components/ui-kit";
import { SpaceCard } from "@/components/space-card";
import { ResponsiveGrid } from "@/components/responsive-grid";
import { CategoryFilter } from "@/components/category-filter";
export default function ExploreScreen() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const { user } = useSession();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const compact = width < 600;
  const query = useQuery({
    queryKey: ["spaces", search, category],
    queryFn: () =>
      api<Space[]>(
        `/spaces?search=${encodeURIComponent(search)}&category=${category}`,
      ),
  });
  return (
    <Page
      eyebrow={
        user
          ? compact
            ? `Olá, ${user.name.split(" ")[0]}!`
            : `Olá, ${user.name.split(" ")[0]}. Que bom ter você aqui!`
          : compact
            ? "Encontre seu espaço"
            : "Seu tempo merece um bom lugar"
      }
      title={compact ? "Seu próximo lugar." : "Encontre seu próximo lugar."}
      subtitle={
        compact
          ? "Escolha um espaço. Reserve um bom momento."
          : "Uma partida, uma celebração ou um novo atendimento. Reserve espaço para o que importa."
      }
    >
      {!compact && (
        <View
          style={{
            borderRadius: 24,
            padding: 22,
            backgroundColor: colors.surfaceAlt,
            flexDirection: "row",
            alignItems: "center",
            gap: 18,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: colors.accent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="sun" size={26} color={colors.onAccent} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontSize: 16,
                color: colors.text,
              }}
            >
              Mais encontros. Boas histórias.
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                color: colors.muted,
                fontSize: 12,
                lineHeight: 20,
              }}
            >
              Escolha o lugar. Encontre seu horário. Aproveite.
            </Text>
          </View>
        </View>
      )}
      <Field
        label="O que você procura?"
        icon="search"
        placeholder="Busque pelo nome do espaço"
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
      />
      <CategoryFilter value={category} onChange={setCategory} />
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Heading>
          {search || category ? "Seu próximo espaço" : "Explore os espaços"}
        </Heading>
        <Text
          accessibilityLiveRegion="polite"
          style={{
            fontFamily: fonts.medium,
            fontSize: 12,
            color: colors.muted,
          }}
        >
          {query.data
            ? `${query.data.length} ${query.data.length === 1 ? "espaço encontrado" : "espaços encontrados"}`
            : "Buscando espaços…"}
        </Text>
      </View>
      {query.isPending && (
        <ResponsiveGrid>
          {[0, 1, 2].map((key) => (
            <Card key={key}>
              <Skeleton height={190} />
              <Skeleton height={20} style={{ width: "65%" }} />
              <Skeleton height={15} />
              <Skeleton height={48} />
            </Card>
          ))}
        </ResponsiveGrid>
      )}
      <Notice error text={query.error?.message} />
      {query.isError && (
        <Button
          title="Tentar novamente"
          icon="refresh-cw"
          secondary
          onPress={() => {
            void query.refetch();
          }}
        />
      )}
      {query.data?.length === 0 && (
        <EmptyState
          icon="search"
          title="Ainda não encontramos esse lugar"
          text="Experimente outro nome ou explore uma categoria diferente."
          action={
            <Button
              title="Limpar filtros"
              secondary
              onPress={() => {
                setSearch("");
                setCategory("");
              }}
            />
          }
        />
      )}
      <ResponsiveGrid>
        {query.data?.map((space) => (
          <Reveal key={space.id}>
            <SpaceCard space={space} />
          </Reveal>
        ))}
      </ResponsiveGrid>
    </Page>
  );
}
