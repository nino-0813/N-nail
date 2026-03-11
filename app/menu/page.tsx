import MenuList from "@/components/MenuList";

export const metadata = {
  title: "Menu | N nail",
  description: "メニュー・料金",
};

export default function MenuPage() {
  return (
    <div className="pt-24">
      <MenuList />
    </div>
  );
}
