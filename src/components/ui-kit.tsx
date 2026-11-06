import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from "react-native";
import { Redirect } from "expo-router";
import { useSession } from "@/lib/providers";
export const palette = {
  green: "#156449",
  ink: "#16372D",
  muted: "#637970",
  background: "#F4F7F3",
  border: "#DCE6DD",
  white: "#FFFFFF",
  red: "#A63838",
};
export function Page({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { online } = useSession();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.eyebrow}>RESERVAI / SEU PRÓXIMO ENCONTRO</Text>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {!online && (
          <Notice text="Você está sem conexão. Reconecte-se para agendar." />
        )}
        {children}
      </View>
    </ScrollView>
  );
}
export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}
export function Heading({ children }: { children: React.ReactNode }) {
  return <Text style={styles.heading}>{children}</Text>;
}
export function Copy({ children }: { children: React.ReactNode }) {
  return <Text style={styles.copy}>{children}</Text>;
}
export function Button({
  title,
  onPress,
  disabled,
  secondary = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        { opacity: disabled ? 0.45 : pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: palette.green }]}>
        {title}
      </Text>
    </Pressable>
  );
}
export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={{ gap: 7, flexGrow: 1 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#83958C"
        {...props}
        style={[
          styles.input,
          props.multiline && { minHeight: 96, textAlignVertical: "top" },
          props.style,
        ]}
      />
    </View>
  );
}
export function Notice({
  text,
  error = false,
}: {
  text?: string;
  error?: boolean;
}) {
  return text ? (
    <Text
      accessibilityRole="alert"
      style={[
        styles.notice,
        error && { backgroundColor: "#FCEEEE", color: palette.red },
      ]}
    >
      {text}
    </Text>
  ) : null;
}
export function Loading() {
  return (
    <ActivityIndicator
      size="large"
      color={palette.green}
      style={{ padding: 24 }}
    />
  );
}
export function Gate({
  children,
  owner = false,
}: {
  children: React.ReactNode;
  owner?: boolean;
}) {
  const { user, ready } = useSession();
  if (!ready) return <Loading />;
  if (!user) return <Redirect href="/login" />;
  if (owner && user.role !== "owner")
    return (
      <Page title="Acesso restrito">
        <Copy>Esta área é exclusiva para proprietários.</Copy>
      </Page>
    );
  return <>{children}</>;
}
export const styles = StyleSheet.create({
  page: { padding: 22, paddingBottom: 48 },
  content: { width: "100%", maxWidth: 1120, alignSelf: "center", gap: 18 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    color: palette.green,
    marginTop: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: palette.ink,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 25,
    color: palette.muted,
    maxWidth: 650,
  },
  card: {
    padding: 22,
    borderRadius: 22,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 14,
  },
  heading: { fontSize: 21, fontWeight: "700", color: palette.ink },
  copy: { fontSize: 15, lineHeight: 23, color: palette.muted },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },
  button: {
    backgroundColor: palette.green,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  secondary: {
    backgroundColor: "#EAF2E9",
    borderWidth: 1,
    borderColor: palette.border,
  },
  buttonText: { fontSize: 14, fontWeight: "700", color: "white" },
  label: { fontSize: 13, color: palette.ink, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    backgroundColor: "white",
    color: palette.ink,
    minHeight: 48,
  },
  notice: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#E7F1E7",
    color: palette.green,
    lineHeight: 22,
  },
});
