import { ScrollView, View } from "react-native";
import { Button, Field, styles } from "./ui-kit";
import { today } from "@/lib/types";
export function DatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const first = today();
  const dates = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(`${first}T12:00:00-03:00`);
    date.setUTCDate(date.getUTCDate() + index);
    return {
      value: date.toISOString().slice(0, 10),
      label:
        index === 0
          ? "Hoje"
          : index === 1
            ? "Amanhã"
            : date.toLocaleDateString("pt-BR", {
                timeZone: "America/Sao_Paulo",
                weekday: "short",
                day: "2-digit",
                month: "2-digit",
              }),
    };
  });
  return (
    <View style={{ gap: 14 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.row}>
          {dates.map((date) => (
            <Button
              key={date.value}
              title={date.label}
              secondary={value !== date.value}
              onPress={() => onChange(date.value)}
            />
          ))}
        </View>
      </ScrollView>
      <Field
        label="Outra data (AAAA-MM-DD)"
        value={value}
        onChangeText={onChange}
        maxLength={10}
        placeholder="2026-11-07"
      />
    </View>
  );
}
