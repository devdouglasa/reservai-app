import { useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/lib/api";
import { useSession } from "@/lib/providers";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import {
  Button,
  Card,
  Copy,
  Field,
  Heading,
  Icon,
  IconButton,
  Notice,
  Page,
  SegmentedControl,
} from "@/components/ui-kit";
import { SpaceCover } from "@/components/space-cover";
export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { online } = useSession();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const mutation = useMutation({
    mutationFn: () =>
      signIn(mode, {
        email: email.trim(),
        password,
        ...(mode === "register" ? { name: name.trim() } : {}),
      }),
    onSuccess: () => router.replace("/"),
  });
  return (
    <Page
      eyebrow="Bom ter você por aqui"
      title="Seu próximo encontro começa aqui."
      subtitle="Reserve um lugar para suas melhores histórias."
    >
      <View
        style={{
          flexDirection: desktop ? "row" : "column",
          alignItems: "flex-start",
          gap: 32,
        }}
      >
        {desktop && (
          <View style={{ flex: 1, gap: 24, paddingTop: 8 }}>
            <SpaceCover
              category="sports_court"
              name="Ilustração Reservai"
              height={320}
            />
            <Heading>Menos combinações. Mais encontros.</Heading>
            <Copy>
              Descubra espaços para se movimentar, celebrar e atender. Encontre
              o horário ideal e deixe o resto com a gente.
            </Copy>
            <View
              style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
            >
              <Icon name="check-circle" color={colors.primary} />
              <Copy>Suas reservas, todas em um só lugar.</Copy>
            </View>
          </View>
        )}
        <View style={{ width: desktop ? 430 : "100%", maxWidth: 520 }}>
          <Card>
            <SegmentedControl
              value={mode}
              options={[
                { value: "login", label: "Entrar" },
                { value: "register", label: "Criar conta" },
              ]}
              onChange={(value) => {
                setMode(value);
                mutation.reset();
              }}
            />
            <View style={{ gap: 5 }}>
              <Heading>
                {mode === "login"
                  ? "Bem-vindo de volta."
                  : "Vamos nos conhecer?"}
              </Heading>
              <Copy>
                {mode === "login"
                  ? "Entre para continuar de onde parou."
                  : "Crie sua conta e encontre seu próximo espaço."}
              </Copy>
            </View>
            {mode === "register" && (
              <Field
                label="Nome completo"
                icon="user"
                value={name}
                onChangeText={setName}
                autoComplete="name"
              />
            )}
            <Field
              label="E-mail"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="voce@exemplo.com"
            />
            <Field
              label="Senha"
              icon="lock"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              trailing={
                <IconButton
                  name={showPassword ? "eye-off" : "eye"}
                  label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {mode === "register" && (
              <Copy small>Use uma senha com 8 a 128 caracteres.</Copy>
            )}
            <Notice error text={mutation.error?.message} />
            <Button
              title={
                mode === "login" ? "Entrar na minha conta" : "Criar minha conta"
              }
              icon="arrow-right"
              busy={mutation.isPending}
              disabled={
                !online ||
                !email ||
                password.length < 8 ||
                password.length > 128 ||
                (mode === "register" && name.trim().length < 2)
              }
              onPress={() => mutation.mutate()}
            />
            <View
              style={{
                paddingTop: 8,
                borderTopWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.regular,
                  fontSize: 11,
                  lineHeight: 18,
                  color: colors.muted,
                }}
              >
                Seu tempo merece um bom lugar. A gente ajuda a encontrar.
              </Text>
            </View>
          </Card>
        </View>
      </View>
    </Page>
  );
}
