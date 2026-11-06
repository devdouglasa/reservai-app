import React, { useEffect, type ComponentProps } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  type TextInputProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Redirect } from "expo-router";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  cancelAnimation,
  FadeIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSession } from "@/lib/providers";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
export type IconName = ComponentProps<typeof Feather>["name"];
export function Icon({
  name,
  size = 20,
  color,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  const { colors } = useTheme();
  return (
    <Feather
      name={name}
      size={size}
      color={color ?? colors.muted}
      accessible={false}
      aria-hidden
      importantForAccessibility="no"
    />
  );
}
export function Brand({ small = false }: { small?: boolean }) {
  const { colors } = useTheme();
  return (
    <Text
      accessibilityLabel="Reservai"
      style={{
        fontFamily: fonts.extraBold,
        fontSize: small ? 23 : 30,
        color: colors.text,
        letterSpacing: -1.3,
      }}
    >
      reservai<Text style={{ color: colors.accent }}>.</Text>
    </Text>
  );
}
export function Page({
  title,
  subtitle,
  eyebrow,
  children,
  footer,
  headerAction,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
}) {
  const { colors } = useTheme();
  const { online } = useSession();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: width < 600 ? 20 : 32,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View
            style={[
              styles.row,
              { justifyContent: "space-between", alignItems: "flex-start" },
            ]}
          >
            <View style={{ flex: 1, minWidth: 180, gap: 9 }}>
              {eyebrow && (
                <Text
                  style={{
                    fontFamily: fonts.bold,
                    fontSize: 11,
                    letterSpacing: 1.8,
                    color: colors.primary,
                  }}
                >
                  {eyebrow.toUpperCase()}
                </Text>
              )}
              <Text
                accessibilityRole="header"
                style={{
                  fontFamily: fonts.extraBold,
                  fontSize: width < 600 ? 28 : 36,
                  lineHeight: width < 600 ? 37 : 46,
                  color: colors.text,
                  letterSpacing: -1.2,
                }}
              >
                {title}
              </Text>
              {subtitle && <Copy>{subtitle}</Copy>}
            </View>
            {headerAction}
          </View>
          {!online && (
            <Notice
              text="Você está sem conexão. Reconecte-se para agendar."
              icon="wifi-off"
            />
          )}
          {children}
        </View>
      </ScrollView>
      {footer && (
        <View
          style={{
            borderTopWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            padding: 16,
            paddingBottom: Math.max(insets.bottom, 16),
          }}
        >
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          boxShadow: "0px 4px 20px rgba(24, 14, 54, 0.025)",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
export function Heading({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <Text
      accessibilityRole="header"
      style={{
        fontFamily: fonts.bold,
        fontSize: 20,
        lineHeight: 28,
        color: colors.text,
        letterSpacing: -0.4,
      }}
    >
      {children}
    </Text>
  );
}
export function Copy({
  children,
  strong = false,
  small = false,
}: {
  children: React.ReactNode;
  strong?: boolean;
  small?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Text
      style={{
        fontFamily: strong ? fonts.semibold : fonts.regular,
        fontSize: small ? 12 : 14,
        lineHeight: small ? 19 : 23,
        color: strong ? colors.text : colors.muted,
      }}
    >
      {children}
    </Text>
  );
}
export function Button({
  title,
  onPress,
  disabled,
  secondary = false,
  icon,
  danger = false,
  busy = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  icon?: IconName;
  danger?: boolean;
  busy?: boolean;
}) {
  const { colors, reducedMotion } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));
  const foreground = danger
    ? colors.danger
    : secondary
      ? colors.primary
      : colors.onPrimary;
  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled || busy, busy }}
        aria-disabled={!!disabled || busy}
        aria-busy={busy}
        disabled={disabled || busy}
        onPress={onPress}
        onPressIn={() => {
          if (!reducedMotion) scale.set(withTiming(0.97, { duration: 150 }));
        }}
        onPressOut={() => {
          scale.set(withTiming(1, { duration: reducedMotion ? 0 : 180 }));
        }}
        style={({ pressed }) => ({
          backgroundColor: danger
            ? colors.dangerBg
            : secondary
              ? colors.surfaceAlt
              : colors.primary,
          paddingHorizontal: 18,
          paddingVertical: 13,
          borderRadius: 14,
          minHeight: 48,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 9,
          opacity: disabled || busy ? 0.5 : pressed ? 0.85 : 1,
        })}
      >
        {busy ? (
          <ActivityIndicator size="small" color={foreground} />
        ) : (
          icon && <Icon name={icon} size={17} color={foreground} />
        )}
        <Text
          style={{
            fontFamily: fonts.bold,
            fontSize: 13,
            color: foreground,
            textAlign: "center",
            flexShrink: 1,
          }}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  disabled,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      aria-disabled={!!disabled}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        minWidth: 48,
        minHeight: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        backgroundColor: pressed ? colors.surfaceAlt : "transparent",
        opacity: disabled ? 0.35 : 1,
      })}
    >
      <Icon name={name} color={colors.primary} />
    </Pressable>
  );
}
export function Field({
  label,
  icon,
  trailing,
  ...props
}: TextInputProps & {
  label: string;
  icon?: IconName;
  trailing?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ gap: 8, flexGrow: 1, flexShrink: 1, minWidth: 110 }}>
      <Text
        style={{ fontFamily: fonts.semibold, fontSize: 12, color: colors.text }}
      >
        {label}
      </Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
          borderRadius: 14,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: icon ? 14 : 0,
        }}
      >
        {icon && <Icon name={icon} size={18} />}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.muted}
          {...props}
          style={[
            {
              flex: 1,
              minWidth: 0,
              color: colors.text,
              fontFamily: fonts.regular,
              paddingHorizontal: 14,
              paddingVertical: 13,
              minHeight: 50,
              fontSize: 15,
            },
            props.multiline && { minHeight: 110, textAlignVertical: "top" },
            props.style,
          ]}
        />
        {trailing}
      </View>
    </View>
  );
}
export function Notice({
  text,
  error = false,
  icon,
}: {
  text?: string;
  error?: boolean;
  icon?: IconName;
}) {
  const { colors } = useTheme();
  return text ? (
    <View
      accessibilityRole="alert"
      style={{
        padding: 14,
        borderRadius: 14,
        backgroundColor: error ? colors.dangerBg : colors.surfaceAlt,
        flexDirection: "row",
        gap: 10,
        alignItems: "flex-start",
      }}
    >
      <Icon
        name={icon ?? (error ? "alert-circle" : "check-circle")}
        size={18}
        color={error ? colors.danger : colors.primary}
      />
      <Text
        style={{
          flex: 1,
          fontFamily: fonts.medium,
          fontSize: 13,
          lineHeight: 21,
          color: error ? colors.danger : colors.primary,
        }}
      >
        {text}
      </Text>
    </View>
  ) : null;
}
export function Loading() {
  const { colors } = useTheme();
  return (
    <ActivityIndicator
      size="large"
      color={colors.primary}
      style={{ padding: 24 }}
      accessibilityLabel="Carregando"
    />
  );
}
export function Skeleton({
  height = 100,
  style,
}: {
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors, reducedMotion } = useTheme();
  const opacity = useSharedValue(0.55);
  useEffect(() => {
    opacity.set(
      reducedMotion
        ? 0.75
        : withRepeat(withTiming(1, { duration: 900 }), -1, true),
    );
    return () => cancelAnimation(opacity);
  }, [reducedMotion, opacity]);
  const animation = useAnimatedStyle(() => ({ opacity: opacity.get() }));
  return (
    <Animated.View
      accessibilityLabel="Carregando conteúdo"
      style={[
        { height, borderRadius: 16, backgroundColor: colors.skeleton },
        style,
        animation,
      ]}
    />
  );
}
export function Reveal({ children }: { children: React.ReactNode }) {
  const { reducedMotion } = useTheme();
  return (
    <Animated.View entering={reducedMotion ? undefined : FadeIn.duration(200)}>
      {children}
    </Animated.View>
  );
}
export function EmptyState({
  icon = "calendar",
  title,
  text,
  action,
}: {
  icon?: IconName;
  title: string;
  text: string;
  action?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <Card style={{ alignItems: "center", paddingVertical: 36 }}>
      <View
        style={{
          width: 60,
          height: 60,
          backgroundColor: colors.surfaceAlt,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} color={colors.primary} size={26} />
      </View>
      <Heading>{title}</Heading>
      <View style={{ maxWidth: 430 }}>
        <Copy>{text}</Copy>
      </View>
      {action}
    </Card>
  );
}
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  const { colors } = useTheme();
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 4,
        padding: 5,
        borderRadius: 17,
        backgroundColor: colors.surfaceAlt,
        alignSelf: "flex-start",
      }}
    >
      {options.map((option) => (
        <Pressable
          key={option.value}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === option.value }}
          aria-selected={value === option.value}
          onPress={() => onChange(option.value)}
          style={{
            minHeight: 48,
            paddingHorizontal: 18,
            justifyContent: "center",
            borderRadius: 12,
            backgroundColor:
              value === option.value ? colors.surface : "transparent",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.bold,
              color: value === option.value ? colors.primary : colors.muted,
              fontSize: 13,
            }}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
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
        <EmptyState
          icon="lock"
          title="Área do proprietário"
          text="Esta área é exclusiva para proprietários de espaços."
        />
      </Page>
    );
  return <>{children}</>;
}
export const styles = StyleSheet.create({
  content: { width: "100%", maxWidth: 1200, alignSelf: "center", gap: 24 },
  card: { padding: 22, borderRadius: 24, borderWidth: 1, gap: 16 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
  },
});
