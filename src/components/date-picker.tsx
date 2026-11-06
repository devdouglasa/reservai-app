import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { today } from "@/lib/types";
import { addDays, dateFromKey, monthCells, shiftMonth } from "@/lib/calendar";
import { useTheme } from "@/theme/context";
import { fonts } from "@/theme/tokens";
import { Copy, Heading, Icon, IconButton } from "./ui-kit";
export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const first = today();
  const last = addDays(first, 90);
  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState(value.slice(0, 7));
  const dates = Array.from({ length: 14 }, (_, index) => addDays(first, index));
  const selectedOutsideRail = !dates.includes(value);
  return (
    <View style={{ gap: 14 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 9, paddingBottom: 2 }}
      >
        {dates.map((date, index) => {
          const selected = date === value;
          const day = dateFromKey(date);
          return (
            <Pressable
              key={date}
              accessibilityRole="button"
              accessibilityLabel={day.toLocaleDateString("pt-BR", {
                timeZone: "UTC",
                dateStyle: "full",
              })}
              accessibilityState={{ selected }}
              aria-pressed={selected}
              onPress={() => onChange(date)}
              style={({ pressed }) => ({
                minWidth: 64,
                minHeight: 88,
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.border,
                backgroundColor: selected ? colors.primary : colors.surface,
                opacity: pressed ? 0.75 : 1,
              })}
            >
              <Text
                style={{
                  fontFamily: fonts.medium,
                  fontSize: 10,
                  color: selected ? colors.onPrimary : colors.muted,
                }}
              >
                {index === 0
                  ? "Hoje"
                  : index === 1
                    ? "Amanhã"
                    : day
                        .toLocaleDateString("pt-BR", {
                          timeZone: "UTC",
                          weekday: "short",
                        })
                        .replace(".", "")}
              </Text>
              <Text
                style={{
                  fontFamily: fonts.extraBold,
                  fontSize: 23,
                  color: selected ? colors.onPrimary : colors.text,
                }}
              >
                {day.getUTCDate()}
              </Text>
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: selected ? colors.onPrimary : "transparent",
                }}
              />
            </Pressable>
          );
        })}
      </ScrollView>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Escolher outra data"
        onPress={() => {
          setMonth(value.slice(0, 7));
          setVisible(true);
        }}
        style={({ pressed }) => ({
          minHeight: 48,
          paddingHorizontal: 14,
          borderRadius: 13,
          borderWidth: 1,
          borderColor: colors.border,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          backgroundColor: pressed ? colors.surfaceAlt : colors.surface,
        })}
      >
        <Icon name="calendar" size={17} color={colors.primary} />
        <Text
          style={{
            flex: 1,
            color: colors.primary,
            fontFamily: fonts.semibold,
            fontSize: 12,
          }}
        >
          {selectedOutsideRail
            ? dateFromKey(value).toLocaleDateString("pt-BR", {
                timeZone: "UTC",
                dateStyle: "long",
              })
            : "Escolher outra data"}
        </Text>
        <Icon name="chevron-down" size={17} />
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={() => setVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.overlay,
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
          }}
        >
          <View
            accessibilityViewIsModal
            style={{
              width: Math.min(width - 16, 440),
              padding: 12,
              gap: 16,
              backgroundColor: colors.surface,
              borderRadius: 26,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 8,
              }}
            >
              <View style={{ flex: 1 }}>
                <Heading>Uma data para você</Heading>
              </View>
              <IconButton
                name="x"
                label="Fechar calendário"
                onPress={() => setVisible(false)}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <IconButton
                name="chevron-left"
                label="Mês anterior"
                disabled={month <= first.slice(0, 7)}
                onPress={() => setMonth(shiftMonth(month, -1))}
              />
              <Text
                accessibilityLiveRegion="polite"
                style={{
                  color: colors.text,
                  fontFamily: fonts.bold,
                  fontSize: 14,
                  textTransform: "capitalize",
                }}
              >
                {dateFromKey(`${month}-01`).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <IconButton
                name="chevron-right"
                label="Próximo mês"
                disabled={month >= last.slice(0, 7)}
                onPress={() => setMonth(shiftMonth(month, 1))}
              />
            </View>
            <View style={{ flexDirection: "row" }}>
              {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
                <Text
                  key={index}
                  style={{
                    width: `${100 / 7}%`,
                    textAlign: "center",
                    fontFamily: fonts.semibold,
                    color: colors.muted,
                    fontSize: 11,
                  }}
                >
                  {day}
                </Text>
              ))}
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {monthCells(month).map((date, index) => {
                const disabled = !date || date < first || date > last;
                const selected = date === value;
                return (
                  <View
                    key={date ?? `empty-${index}`}
                    style={{ width: `${100 / 7}%`, padding: 1 }}
                  >
                    {date ? (
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ disabled, selected }}
                        aria-pressed={selected}
                        aria-disabled={disabled}
                        accessibilityLabel={dateFromKey(
                          date,
                        ).toLocaleDateString("pt-BR", {
                          timeZone: "UTC",
                          dateStyle: "full",
                        })}
                        disabled={disabled}
                        onPress={() => {
                          onChange(date);
                          setVisible(false);
                        }}
                        style={({ pressed }) => ({
                          minHeight: 48,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 13,
                          backgroundColor: selected
                            ? colors.primary
                            : pressed
                              ? colors.surfaceAlt
                              : "transparent",
                          opacity: disabled ? 0.3 : 1,
                        })}
                      >
                        <Text
                          style={{
                            fontFamily: fonts.semibold,
                            fontSize: 14,
                            color: selected ? colors.onPrimary : colors.text,
                          }}
                        >
                          {Number(date.slice(-2))}
                        </Text>
                      </Pressable>
                    ) : (
                      <View style={{ minHeight: 48 }} />
                    )}
                  </View>
                );
              })}
            </View>
            <View style={{ padding: 8 }}>
              <Copy small>
                Agendamentos disponíveis até{" "}
                {dateFromKey(last).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
                .
              </Copy>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
