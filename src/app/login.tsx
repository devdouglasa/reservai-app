import { useState } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/lib/api";
import { useSession } from "@/lib/providers";
import { Button, Card, Copy, Field, Notice, Page } from "@/components/ui-kit";
export default function LoginScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { online } = useSession();
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
      title={
        mode === "login"
          ? "Que bom ter você aqui."
          : "Seu próximo encontro começa aqui."
      }
      subtitle="Entre na sua conta para solicitar e acompanhar suas reservas."
    >
      <View style={{ maxWidth: 480, width: "100%" }}>
        <Card>
          {mode === "register" && (
            <Field
              label="Nome completo"
              value={name}
              onChangeText={setName}
              autoComplete="name"
            />
          )}
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
          {mode === "register" && (
            <Copy>
              Use entre 8 e 128 caracteres. O cadastro cria uma conta de
              cliente.
            </Copy>
          )}
          <Notice error text={mutation.error?.message} />
          <Button
            title={
              mutation.isPending
                ? "Aguarde…"
                : mode === "login"
                  ? "Entrar"
                  : "Criar conta"
            }
            disabled={
              !online ||
              mutation.isPending ||
              !email ||
              password.length < 8 ||
              (mode === "register" && name.trim().length < 2)
            }
            onPress={() => mutation.mutate()}
          />
          <Button
            secondary
            title={
              mode === "login" ? "Ainda não tenho conta" : "Já tenho uma conta"
            }
            onPress={() => {
              setMode(mode === "login" ? "register" : "login");
              mutation.reset();
            }}
          />
        </Card>
      </View>
    </Page>
  );
}
