export function dateFromKey(value: string): Date {
  return new Date(`${value}T12:00:00Z`);
}
export function addDays(value: string, days: number): string {
  const date = dateFromKey(value);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function shiftMonth(month: string, offset: number): string {
  const date = dateFromKey(`${month}-01`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 7);
}
export function monthCells(month: string): (string | null)[] {
  const first = dateFromKey(`${month}-01`);
  const end = dateFromKey(`${shiftMonth(month, 1)}-01`);
  end.setUTCDate(0);
  return [
    ...Array<null>(first.getUTCDay()).fill(null),
    ...Array.from(
      { length: end.getUTCDate() },
      (_, index) => `${month}-${String(index + 1).padStart(2, "0")}`,
    ),
  ];
}
