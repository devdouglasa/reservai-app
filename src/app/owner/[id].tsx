import { useState } from "react";
import { Switch, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, post, put } from "@/lib/api";
import { useSession } from "@/lib/providers";
import {
  type Space,
  type Schedule,
  type Block,
  type Category,
  categories,
  dateLabel,
  timeLabel,
  today,
} from "@/lib/types";
import {
  Button,
  Card,
  Copy,
  Field,
  Gate,
  Heading,
  Loading,
  Notice,
  Page,
  styles,
} from "@/components/ui-kit";
const days = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const emptySpace: Omit<Space, "id"> = {
  name: "",
  description: "",
  category: "sports_court",
  address: "",
  capacity: 10,
  slotMinutes: 60,
  imageUrl: null,
  active: true,
};
function SpaceForm({
  initial,
  id,
}: {
  initial: Omit<Space, "id">;
  id: string;
}) {
  const [form, setForm] = useState(initial);
  const client = useQueryClient();
  const { online } = useSession();
  const [capacity, setCapacity] = useState(String(initial.capacity));
  const [duration, setDuration] = useState(String(initial.slotMinutes));
  const save = useMutation({
    mutationFn: () => {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        address: form.address.trim(),
        capacity: Number(capacity),
        slotMinutes: Number(duration),
        imageUrl: form.imageUrl || null,
        active: form.active,
      };
      return id === "new"
        ? post<Space>("/owner/spaces", payload)
        : put<Space>(`/owner/spaces/${id}`, payload);
    },
    onSuccess: (result) => {
      void client.invalidateQueries({ queryKey: ["spaces"] });
      if (id === "new") router.replace(`/owner/${result.id}`);
    },
  });
  return (
    <Card>
      <Heading>Informações do espaço</Heading>
      <Field
        label="Nome"
        value={form.name}
        onChangeText={(name) => setForm({ ...form, name })}
      />
      <Field
        label="Descrição"
        multiline
        value={form.description}
        onChangeText={(description) => setForm({ ...form, description })}
      />
      <Copy>Categoria</Copy>
      <View style={styles.row}>
        {Object.entries(categories).map(([key, label]) => (
          <Button
            key={key}
            secondary={form.category !== key}
            title={label}
            onPress={() => setForm({ ...form, category: key as Category })}
          />
        ))}
      </View>
      <Field
        label="Endereço"
        value={form.address}
        onChangeText={(address) => setForm({ ...form, address })}
      />
      <View style={styles.row}>
        <Field
          label="Capacidade (pessoas)"
          value={capacity}
          onChangeText={setCapacity}
          keyboardType="number-pad"
        />
        <Field
          label="Duração do horário (minutos)"
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad"
        />
      </View>
      <Field
        label="Imagem (URL HTTPS, opcional)"
        value={form.imageUrl ?? ""}
        autoCapitalize="none"
        onChangeText={(imageUrl) => setForm({ ...form, imageUrl })}
      />
      <View style={styles.row}>
        <Switch
          accessibilityLabel="Espaço ativo"
          value={form.active}
          onValueChange={(active) => setForm({ ...form, active })}
        />
        <Copy>Disponível para novas reservas</Copy>
      </View>
      <Notice error text={save.error?.message} />
      {save.isSuccess && <Notice text="Informações salvas." />}
      <Button
        title={save.isPending ? "Salvando…" : "Salvar espaço"}
        disabled={
          !online ||
          save.isPending ||
          form.name.trim().length < 2 ||
          form.description.trim().length < 5 ||
          form.address.trim().length < 5 ||
          !Number.isInteger(Number(capacity)) ||
          Number(capacity) < 1 ||
          !Number.isInteger(Number(duration)) ||
          Number(duration) < 15 ||
          Number(duration) > 720
        }
        onPress={() => save.mutate()}
      />
    </Card>
  );
}
function ScheduleForm({ id, initial }: { id: string; initial: Schedule[] }) {
  const [intervals, setIntervals] = useState<Schedule[]>(
    initial.map(({ weekday, startTime, endTime }) => ({
      weekday,
      startTime,
      endTime,
    })),
  );
  const { online } = useSession();
  const client = useQueryClient();
  const save = useMutation({
    mutationFn: () => put(`/owner/spaces/${id}/schedule`, { intervals }),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ["schedule", id] });
      void client.invalidateQueries({ queryKey: ["availability"] });
    },
  });
  const change = (
    index: number,
    field: "startTime" | "endTime",
    value: string,
  ) =>
    setIntervals(
      intervals.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  return (
    <Card>
      <Heading>Funcionamento semanal</Heading>
      <Copy>
        Horários de São Paulo, no formato HH:MM. Adicione mais de um intervalo
        para incluir pausas. Alterações preservam reservas existentes.
      </Copy>
      {days.map((day, weekday) => (
        <View
          key={day}
          style={{
            gap: 12,
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: "#E6ECE5",
          }}
        >
          <Heading>{day}</Heading>
          {intervals.map(
            (item, index) =>
              item.weekday === weekday && (
                <View key={index} style={styles.row}>
                  <Field
                    label="Início"
                    value={item.startTime}
                    maxLength={5}
                    onChangeText={(value) => change(index, "startTime", value)}
                  />
                  <Field
                    label="Término"
                    value={item.endTime}
                    maxLength={5}
                    onChangeText={(value) => change(index, "endTime", value)}
                  />
                  <Button
                    secondary
                    title="Remover"
                    onPress={() =>
                      setIntervals(intervals.filter((_, i) => i !== index))
                    }
                  />
                </View>
              ),
          )}
          <Button
            secondary
            title="+ Adicionar intervalo"
            onPress={() =>
              setIntervals([
                ...intervals,
                { weekday, startTime: "08:00", endTime: "18:00" },
              ])
            }
          />
        </View>
      ))}
      <Notice error text={save.error?.message} />
      {save.isSuccess && <Notice text="Funcionamento atualizado." />}
      <Button
        title={save.isPending ? "Salvando…" : "Salvar funcionamento"}
        disabled={!online || save.isPending}
        onPress={() => save.mutate()}
      />
    </Card>
  );
}
function BlocksForm({ id }: { id: string }) {
  const [date, setDate] = useState(today());
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("18:00");
  const [reason, setReason] = useState("");
  const { online } = useSession();
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["blocks", id],
    queryFn: () => api<Block[]>(`/owner/spaces/${id}/blocks`),
  });
  const invalidate = () => {
    void client.invalidateQueries({ queryKey: ["blocks", id] });
    void client.invalidateQueries({ queryKey: ["availability"] });
  };
  const save = useMutation({
    mutationFn: () =>
      post(`/owner/spaces/${id}/blocks`, {
        startsAt: `${date}T${start}:00-03:00`,
        endsAt: `${date}T${end}:00-03:00`,
        reason,
      }),
    onSuccess: () => {
      setReason("");
      invalidate();
    },
  });
  const remove = useMutation({
    mutationFn: (blockId: string) =>
      api(`/owner/spaces/${id}/blocks/${blockId}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });
  return (
    <Card>
      <Heading>Bloqueios por data</Heading>
      <Copy>
        Use para feriados e manutenção. Se houver reservas no intervalo,
        cancele-as antes de bloquear.
      </Copy>
      <Field
        label="Data (AAAA-MM-DD)"
        value={date}
        onChangeText={setDate}
        maxLength={10}
      />
      <View style={styles.row}>
        <Field
          label="Início (HH:MM)"
          value={start}
          onChangeText={setStart}
          maxLength={5}
        />
        <Field
          label="Término (HH:MM)"
          value={end}
          onChangeText={setEnd}
          maxLength={5}
        />
      </View>
      <Field label="Motivo" value={reason} onChangeText={setReason} />
      <Button
        title={save.isPending ? "Salvando…" : "Adicionar bloqueio"}
        disabled={
          !online ||
          save.isPending ||
          reason.length < 2 ||
          !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
          !/^([01]\d|2[0-3]):[0-5]\d$/.test(start) ||
          !/^([01]\d|2[0-3]):[0-5]\d$/.test(end)
        }
        onPress={() => save.mutate()}
      />
      <Notice
        error
        text={
          save.error?.message ?? remove.error?.message ?? query.error?.message
        }
      />
      {query.isPending && <Loading />}
      {query.data?.length === 0 && <Copy>Nenhum bloqueio cadastrado.</Copy>}
      {query.data?.map((block) => (
        <View key={block.id} style={{ gap: 8 }}>
          <Copy>
            {dateLabel(block.startsAt)} · {timeLabel(block.startsAt)}–
            {timeLabel(block.endsAt)} · {block.reason}
          </Copy>
          <Button
            secondary
            title="Remover bloqueio"
            disabled={!online || remove.isPending}
            onPress={() => remove.mutate(block.id)}
          />
        </View>
      ))}
    </Card>
  );
}
function Editor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const space = useQuery({
    queryKey: ["spaces", "edit", id],
    queryFn: () => api<Space>(`/owner/spaces/${id}`),
    enabled: !isNew,
  });
  const schedule = useQuery({
    queryKey: ["schedule", id],
    queryFn: () => api<Schedule[]>(`/owner/spaces/${id}/schedule`),
    enabled: !isNew,
  });
  return (
    <Page
      title={
        isNew ? "Um novo espaço" : (space.data?.name ?? "Gerenciar espaço")
      }
      subtitle="Organize os detalhes e a disponibilidade para receber seus clientes."
    >
      {!isNew && space.isPending && <Loading />}
      <Notice error text={space.error?.message ?? schedule.error?.message} />
      {(isNew || space.data) && (
        <SpaceForm key={id} id={id} initial={space.data ?? emptySpace} />
      )}
      {!isNew && space.data && (
        <>
          {schedule.data && (
            <ScheduleForm key={id} id={id} initial={schedule.data} />
          )}
          <BlocksForm id={id} />
        </>
      )}
    </Page>
  );
}
export default function OwnerEditorScreen() {
  return (
    <Gate owner>
      <Editor />
    </Gate>
  );
}
