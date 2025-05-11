import { Input } from "@/components/ui/input";

export default function FilterSection() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Input placeholder="Mín." type="number" />
      a
      <Input placeholder="Max." type="number" />
    </div>
  );
}
