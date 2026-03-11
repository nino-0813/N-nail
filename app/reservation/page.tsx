import Reservation from "@/components/Reservation";

export const metadata = {
  title: "Reservation | N nail",
  description: "ご予約・メニュー",
};

export default function ReservationPage() {
  return (
    <div className="pt-24">
      <Reservation />
    </div>
  );
}
