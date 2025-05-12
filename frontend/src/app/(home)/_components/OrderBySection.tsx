import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter, useSearchParams } from "next/navigation";

const options: {
  id: string;
  label: string;
}[] = [
  { label: "Trending", id: "trending" },
  { label: "Fecha de publicación: más recientes", id: "creationDate-desc" },
  { label: "Fecha de publicación más antiguas", id: "creationDate-asc" },
  { label: "Título: A-Z", id: "title-asc" },
  { label: "Título: Z-A", id: "title-desc" },
  { label: "Precio: más baratos primero", id: "price-asc" },
  { label: "Precio: más caros primero", id: "price-desc" },
];

export default function OrderBySection() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleValueChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orderBy", value);
    router.replace(`?${params.toString()}`);
  }

  return (
    <RadioGroup onValueChange={handleValueChange} defaultValue="trending">
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label className="font-normal" htmlFor={option.id}>
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
