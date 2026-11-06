export type Category = "sports_court" | "party_hall" | "office";
export type User = {
  id: string;
  name: string;
  email: string;
  role: "customer" | "owner";
};
export type Space = {
  id: string;
  name: string;
  description: string;
  category: Category;
  address: string;
  capacity: number;
  imageUrl: string | null;
  slotMinutes: number;
  active: boolean;
};
export type Slot = { startsAt: string; endsAt: string; available: boolean };
export type Booking = {
  id: string;
  spaceId: string;
  startsAt: string;
  endsAt: string;
  spaceName: string;
  customerName: string;
  status: "pending" | "confirmed" | "rejected" | "cancelled" | "expired";
};
export type Schedule = { weekday: number; startTime: string; endTime: string };
export type Block = {
  id: string;
  startsAt: string;
  endsAt: string;
  reason: string;
};
export const categories: Record<Category, string> = {
  sports_court: "Quadras",
  party_hall: "Salões de festas",
  office: "Consultórios",
};
export const statusLabels = {
  pending: "Aguardando aprovação",
  confirmed: "Confirmada",
  rejected: "Recusada",
  cancelled: "Cancelada",
  expired: "Expirada",
};
export const timeLabel = (iso: string) =>
  new Date(iso).toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  });
export const dateLabel = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
export const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
