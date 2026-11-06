import { BookingList } from "@/components/booking-list";
import { Gate, Page } from "@/components/ui-kit";
export default function BookingsScreen() {
  return (
    <Gate>
      <Page
        title="Meus próximos encontros"
        subtitle="Acompanhe solicitações, confirmações e o histórico das suas reservas."
      >
        <BookingList />
      </Page>
    </Gate>
  );
}
