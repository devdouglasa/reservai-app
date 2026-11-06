import { Pressable, Text, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { signOut } from "@/lib/api";
import { useSession } from "@/lib/providers";
import { useTheme } from "@/theme/context";
import { fonts, type ThemePreference } from "@/theme/tokens";
import {
  Button,
  Card,
  Copy,
  Heading,
  Icon,
  Notice,
  Page,
  styles,
  type IconName,
} from "@/components/ui-kit";
export default function ProfileScreen() {
  const { user, online } = useSession();
  const { colors, preference, setPreference, error } = useTheme();
  const logout = useMutation({
    mutationFn: signOut,
    onSuccess: () => router.replace("/"),
  });
  const options: {
    value: ThemePreference;
    label: string;
    description: string;
    icon: IconName;
  }[] = [
    {
      value: "light",
      label: "Claro",
      description: "Leve e iluminado",
      icon: "sun",
    },
    {
      value: "dark",
      label: "Escuro",
      description: "Conforto a qualquer hora",
      icon: "moon",
    },
    {
      value: "system",
      label: "Automático",
      description: "Acompanha seu aparelho",
      icon: "monitor",
    },
  ];
  return (
    <Page
      eyebrow="Do seu jeito"
      title="Seu espaço no Reservai."
      subtitle="Sua conta, seus encontros e uma aparência que combina com você."
    >
      <Card>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 24,
              backgroundColor: colors.surfaceAlt,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {user ? (
              <Text
                style={{
                  fontFamily: fonts.extraBold,
                  color: colors.primary,
                  fontSize: 24,
                }}
              >
                {user.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((name) => name[0])
                  .join("")}
              </Text>
            ) : (
              <Icon name="user" size={28} color={colors.primary} />
            )}
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <Heading>
              {user?.name ?? "Seu próximo encontro começa aqui"}
            </Heading>
            <Copy>
              {user?.email ??
                "Entre para solicitar e acompanhar suas reservas."}
            </Copy>
            {user && (
              <Copy small>
                {user.role === "owner"
                  ? "Conta de proprietário"
                  : "Conta de cliente"}
              </Copy>
            )}
          </View>
        </View>
        {!user && (
          <Button
            title="Entrar ou cadastrar"
            icon="arrow-right"
            onPress={() => router.push("/login")}
          />
        )}
      </Card>
      <Card>
        <View style={styles.row}>
          <Icon name="sliders" color={colors.primary} />
          <Heading>Como você prefere ver o Reservai?</Heading>
        </View>
        <Copy>
          Escolha sua aparência. A preferência fica salva neste dispositivo.
        </Copy>
        <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ checked: preference === option.value }}
              aria-checked={preference === option.value}
              onPress={() => {
                void setPreference(option.value);
              }}
              style={{
                minHeight: 76,
                padding: 16,
                borderRadius: 18,
                flexDirection: "row",
                gap: 14,
                alignItems: "center",
                backgroundColor:
                  preference === option.value
                    ? colors.surfaceAlt
                    : colors.surface,
                borderWidth: 1,
                borderColor:
                  preference === option.value ? colors.primary : colors.border,
              }}
            >
              <Icon
                name={option.icon}
                size={22}
                color={
                  preference === option.value ? colors.primary : colors.muted
                }
              />
              <View style={{ flex: 1, gap: 3 }}>
                <Copy strong>{option.label}</Copy>
                <Copy small>{option.description}</Copy>
              </View>
              <Icon
                name={preference === option.value ? "check-circle" : "circle"}
                size={20}
                color={
                  preference === option.value ? colors.primary : colors.muted
                }
              />
            </Pressable>
          ))}
        </View>
        <Notice error text={error ?? undefined} />
      </Card>
      {user && (
        <Card>
          <Heading>Até o próximo encontro</Heading>
          <Copy>
            Você pode voltar quando quiser. Suas reservas continuam salvas.
          </Copy>
          <View style={styles.row}>
            <Button
              secondary
              title="Sair da conta"
              icon="log-out"
              busy={logout.isPending}
              disabled={!online}
              onPress={() => logout.mutate()}
            />
          </View>
          <Notice error text={logout.error?.message} />
        </Card>
      )}
    </Page>
  );
}
