import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterSection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleMinPriceChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("minPrice", value);
    router.replace(`?${params.toString()}`);
  }

  function handleMaxPriceChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("maxPrice", value);
    router.replace(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <Input
        placeholder="Mín."
        type="number"
        onChange={(e) => handleMinPriceChange(e.target.value)}
      />
      a
      <Input
        placeholder="Max."
        type="number"
        onChange={(e) => handleMaxPriceChange(e.target.value)}
      />
    </div>
  );
}
